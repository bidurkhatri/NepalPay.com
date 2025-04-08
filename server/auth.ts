import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express, Request, Response, NextFunction } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User } from "../shared/schema";
import * as crypto from 'crypto';

declare global {
  namespace Express {
    interface User extends User {}
  }
}

const scryptAsync = promisify(scrypt);

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

export async function comparePasswords(supplied: string, stored: string): Promise<boolean> {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export function setupAuth(app: Express): void {
  // Ensure SESSION_SECRET is present
  if (!process.env.SESSION_SECRET) {
    // Generate a random secret if not provided
    process.env.SESSION_SECRET = crypto.randomBytes(32).toString('hex');
    console.warn('Warning: SESSION_SECRET not provided. Using a generated value.');
  }

  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
    }
  };

  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  // Set up passport local strategy
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        
        if (!user) {
          return done(null, false, { message: "Invalid username" });
        }
        
        const isPasswordValid = await comparePasswords(password, user.password);
        
        if (!isPasswordValid) {
          return done(null, false, { message: "Invalid password" });
        }
        
        // Update last login time
        await storage.updateUser(user.id, {
          lastLoginAt: new Date()
        });
        
        // Create activity log
        await storage.createActivity({
          userId: user.id,
          action: 'login',
          details: 'User logged in',
          ipAddress: null,
          userAgent: null
        });
        
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    })
  );

  // Serialize and deserialize user for session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      if (!user) {
        return done(new Error('User not found'), null);
      }
      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  });
  
  // Authentication routes
  
  // Register new user
  app.post("/api/register", async (req, res, next) => {
    try {
      const { username, password, email, fullName } = req.body;
      
      // Check if username already exists
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      // Hash password
      const hashedPassword = await hashPassword(password);
      
      // Create user
      const newUser = await storage.createUser({
        username,
        password: hashedPassword,
        email: email || null,
        fullName: fullName || null,
        role: 'user',
        kycStatus: 'none',
        isActive: true,
        isVerified: false
      });
      
      // Create activity log
      await storage.createActivity({
        userId: newUser.id,
        action: 'register',
        details: 'User registered',
        ipAddress: null,
        userAgent: null
      });
      
      // Log user in
      req.login(newUser, (err) => {
        if (err) {
          return next(err);
        }
        return res.status(201).json(newUser);
      });
    } catch (error) {
      return next(error);
    }
  });

  // Login
  app.post("/api/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        return next(err);
      }
      
      if (!user) {
        return res.status(401).json({ message: info?.message || "Authentication failed" });
      }
      
      req.login(user, (err) => {
        if (err) {
          return next(err);
        }
        return res.status(200).json(user);
      });
    })(req, res, next);
  });

  // Logout
  app.post("/api/logout", isAuthenticated, (req, res, next) => {
    try {
      const userId = req.user?.id;
      
      req.logout((err) => {
        if (err) {
          return next(err);
        }
        
        if (userId) {
          // Create activity log (we do this after logout, so it's not attached to the session)
          storage.createActivity({
            userId,
            action: 'logout',
            details: 'User logged out',
            ipAddress: null,
            userAgent: null
          }).catch(console.error); // Don't block the response
        }
        
        res.status(200).json({ message: "Logged out successfully" });
      });
    } catch (error) {
      next(error);
    }
  });

  // Get current user info
  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    return res.status(200).json(req.user);
  });
  
  // Update user profile
  app.put("/api/user", isAuthenticated, async (req, res, next) => {
    try {
      const userId = req.user?.id;
      const { email, fullName, avatar, phone, address, city, country, postalCode } = req.body;
      
      // Update user
      const updatedUser = await storage.updateUser(userId, {
        email,
        fullName,
        avatar,
        phone,
        address,
        city,
        country,
        postalCode,
        updatedAt: new Date()
      });
      
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Create activity log
      await storage.createActivity({
        userId,
        action: 'profile_update',
        details: 'User updated profile',
        ipAddress: null,
        userAgent: null
      });
      
      return res.status(200).json(updatedUser);
    } catch (error) {
      return next(error);
    }
  });
  
  // Change password
  app.post("/api/change-password", isAuthenticated, async (req, res, next) => {
    try {
      const userId = req.user?.id;
      const { currentPassword, newPassword } = req.body;
      
      // Get user
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Verify current password
      const isPasswordValid = await comparePasswords(currentPassword, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Current password is incorrect" });
      }
      
      // Hash new password
      const hashedPassword = await hashPassword(newPassword);
      
      // Update password
      const updatedUser = await storage.updateUser(userId, {
        password: hashedPassword,
        updatedAt: new Date()
      });
      
      // Create activity log
      await storage.createActivity({
        userId,
        action: 'password_change',
        details: 'User changed password',
        ipAddress: null,
        userAgent: null
      });
      
      return res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
      return next(error);
    }
  });
}

// Middleware to check if user is authenticated
export function isAuthenticated(req: Request, res: Response, next: NextFunction): void {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Not authenticated" });
}

// Middleware to check if user is admin
export function isAdmin(req: Request, res: Response, next: NextFunction): void {
  if (req.isAuthenticated() && req.user?.role === 'admin') {
    return next();
  }
  res.status(403).json({ message: "Access denied" });
}

// Middleware to check if user is super admin
export function isSuperAdmin(req: Request, res: Response, next: NextFunction): void {
  if (req.isAuthenticated() && req.user?.role === 'superadmin') {
    return next();
  }
  res.status(403).json({ message: "Access denied" });
}

// Middleware to check if user has completed KYC
export function hasKYC(req: Request, res: Response, next: NextFunction): void {
  if (req.isAuthenticated() && req.user?.kycStatus === 'verified') {
    return next();
  }
  res.status(403).json({ message: "KYC verification required" });
}

export const middlewares = {
  isAuthenticated,
  isAdmin,
  isSuperAdmin,
  hasKYC
};