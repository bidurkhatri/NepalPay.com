import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express, Request, Response, NextFunction } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User as UserType } from "../shared/schema";

// Extend Express User interface to use our User type
declare global {
  namespace Express {
    interface User extends UserType {}
  }
}

// Helper functions for password handling
const scryptAsync = promisify(scrypt);

// Hash password function
async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

// Compare passwords function
async function comparePasswords(supplied: string, stored: string): Promise<boolean> {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

// Check if user is authenticated
export function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized: Please login" });
}

// Check if user is an admin
export function isAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated() && (req.user.role === "admin" || req.user.role === "superadmin")) {
    return next();
  }
  res.status(403).json({ message: "Forbidden: Admin access required" });
}

// Check if user is a superadmin
export function isSuperAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated() && req.user.role === "superadmin") {
    return next();
  }
  res.status(403).json({ message: "Forbidden: SuperAdmin access required" });
}

// Setup authentication with Passport
export function setupAuth(app: Express) {
  // Configure session
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "nepalipay-secret-key",
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  // Configure Local Strategy for username/password authentication
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        // Find user by username
        const user = await storage.getUserByUsername(username);
        
        // If user not found or password doesn't match
        if (!user || !(await comparePasswords(password, user.password))) {
          return done(null, false, { message: "Invalid username or password" });
        }
        
        // Success
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    })
  );

  // Serialize user for session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Deserialize user from session
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      if (!user) {
        return done(null, false);
      }
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  // Register API route for user registration
  app.post("/api/register", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username, email, password } = req.body;

      // Check if required fields are provided
      if (!username || !email || !password) {
        return res.status(400).json({ message: "Username, email, and password are required" });
      }

      // Check if user already exists
      const existingUserByUsername = await storage.getUserByUsername(username);
      if (existingUserByUsername) {
        return res.status(409).json({ message: "Username already exists" });
      }

      const existingUserByEmail = await storage.getUserByEmail(email);
      if (existingUserByEmail) {
        return res.status(409).json({ message: "Email already exists" });
      }

      // Create user with hashed password
      const hashedPassword = await hashPassword(password);
      const user = await storage.createUser({
        username,
        email,
        password: hashedPassword,
        full_name: req.body.full_name || "",
        phone: req.body.phone || "",
        kyc_status: "none",
        role: "user",
        wallet_address: req.body.wallet_address || "",
        stripe_customer_id: "",
        stripe_subscription_id: "",
      });

      // Login the user after registration
      req.login(user, (err) => {
        if (err) return next(err);
        // Return user info without sensitive data
        return res.status(201).json({
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          wallet_address: user.wallet_address,
        });
      });
    } catch (error) {
      console.error("Registration error:", error);
      return res.status(500).json({ message: "Registration failed" });
    }
  });

  // Login API route
  app.post("/api/login", (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("local", (err: Error, user: UserType, info: { message: string }) => {
      if (err) {
        return next(err);
      }
      
      if (!user) {
        return res.status(401).json({ message: info?.message || "Login failed" });
      }
      
      req.login(user, (loginErr) => {
        if (loginErr) {
          return next(loginErr);
        }
        
        // Log the login activity
        storage.createActivity({
          user_id: user.id,
          type: "login",
          description: `User ${user.username} logged in`,
        }).catch(console.error);
        
        // Return user info without sensitive data
        return res.status(200).json({
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          wallet_address: user.wallet_address,
        });
      });
    })(req, res, next);
  });

  // Logout API route
  app.post("/api/logout", (req: Request, res: Response) => {
    const userId = req.user?.id;
    const username = req.user?.username;
    
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      
      // Log the logout activity if user was logged in
      if (userId && username) {
        storage.createActivity({
          user_id: userId,
          type: "login",
          description: `User ${username} logged out`,
        }).catch(console.error);
      }
      
      req.session.destroy((sessionErr) => {
        if (sessionErr) {
          console.error("Session destruction error:", sessionErr);
        }
        res.clearCookie("connect.sid");
        return res.status(200).json({ message: "Logout successful" });
      });
    });
  });

  // Get current user API route
  app.get("/api/user", (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    // Return user info without password
    const userInfo = {
      id: req.user.id,
      username: req.user.username,
      email: req.user.email,
      full_name: req.user.full_name,
      phone: req.user.phone,
      role: req.user.role,
      kyc_status: req.user.kyc_status,
      wallet_address: req.user.wallet_address,
    };
    
    return res.status(200).json(userInfo);
  });
}