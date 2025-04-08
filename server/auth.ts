import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express, Request, Response, NextFunction } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User } from "../shared/schema";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Extend Express types to include user
declare global {
  namespace Express {
    interface User extends User {}
  }
}

// Convert callback-based scrypt to Promise-based
const scryptAsync = promisify(scrypt);

/**
 * Hash a password using scrypt with a random salt
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

/**
 * Compare a provided password against a stored hash
 */
export async function comparePasswords(supplied: string, stored: string): Promise<boolean> {
  if (!stored || !stored.includes('.')) {
    return false; // Malformed stored password
  }

  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

/**
 * Set up authentication middleware and routes
 */
export function setupAuth(app: Express): void {
  // Session configuration
  const sessionSecret = process.env.SESSION_SECRET || randomBytes(32).toString("hex");
  
  const sessionSettings: session.SessionOptions = {
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    }
  };

  // Set up session middleware
  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  // Configure passport with local strategy
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        // Find user by username
        const user = await storage.getUserByUsername(username);
        
        if (!user) {
          return done(null, false, { message: "Invalid username or password" });
        }
        
        // Verify password
        const passwordValid = await comparePasswords(password, user.password);
        
        if (!passwordValid) {
          return done(null, false, { message: "Invalid username or password" });
        }
        
        // Authentication successful
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    })
  );

  // Serialize user to session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Deserialize user from session
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  // === Authentication Routes ===

  // Register new user
  app.post("/api/register", async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Check if username already exists
      const existingUser = await storage.getUserByUsername(req.body.username);
      if (existingUser) {
        return res.status(400).json({ error: "Username already exists" });
      }

      // Check if email already exists
      const existingEmail = await storage.getUserByEmail(req.body.email);
      if (existingEmail) {
        return res.status(400).json({ error: "Email already exists" });
      }

      // Hash the password
      const hashedPassword = await hashPassword(req.body.password);

      // Create new user with hashed password
      const user = await storage.createUser({
        ...req.body,
        password: hashedPassword,
        role: "user", // Default role for new users
      });

      // Remove password from response
      const userResponse = { ...user, password: undefined };

      // Log in the newly registered user
      req.login(user, (err) => {
        if (err) return next(err);
        
        // Create activity record for registration
        storage.createActivity({
          userId: user.id,
          action: "register",
          details: "User registration",
          ipAddress: req.ip,
          userAgent: req.headers["user-agent"] || "",
        }).catch(console.error);
        
        return res.status(201).json(userResponse);
      });
    } catch (error: any) {
      console.error("Registration error:", error);
      return res.status(500).json({ error: "Registration failed: " + error.message });
    }
  });

  // Login
  app.post("/api/login", (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("local", (err: Error | null, user: User | false, info: any) => {
      if (err) {
        return next(err);
      }
      
      if (!user) {
        return res.status(401).json({ error: info?.message || "Authentication failed" });
      }
      
      req.login(user, (loginErr) => {
        if (loginErr) {
          return next(loginErr);
        }
        
        // Create activity record for login
        storage.createActivity({
          userId: user.id,
          action: "login",
          details: "User login",
          ipAddress: req.ip,
          userAgent: req.headers["user-agent"] || "",
        }).catch(console.error);
        
        // Remove password from response
        const userResponse = { ...user, password: undefined };
        
        return res.status(200).json(userResponse);
      });
    })(req, res, next);
  });

  // Logout
  app.post("/api/logout", (req: Request, res: Response) => {
    if (req.isAuthenticated()) {
      const userId = req.user?.id;
      
      // Create activity record for logout
      if (userId) {
        storage.createActivity({
          userId,
          action: "logout",
          details: "User logout",
          ipAddress: req.ip,
          userAgent: req.headers["user-agent"] || "",
        }).catch(console.error);
      }
    }
    
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ error: "Logout failed" });
      }
      req.session.destroy((sessionErr) => {
        res.clearCookie("connect.sid");
        return res.status(200).json({ message: "Logged out successfully" });
      });
    });
  });

  // Get current user
  app.get("/api/user", (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    // Remove password from response
    const userResponse = { ...req.user, password: undefined };
    
    return res.status(200).json(userResponse);
  });
}

// Middleware for protecting routes
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "Authentication required" });
  }
  next();
}

// Middleware for requiring admin role
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "Authentication required" });
  }
  
  if (req.user?.role !== "admin" && req.user?.role !== "superadmin") {
    return res.status(403).json({ error: "Admin privileges required" });
  }
  
  next();
}

// Middleware for requiring superadmin role
export function requireSuperadmin(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "Authentication required" });
  }
  
  if (req.user?.role !== "superadmin") {
    return res.status(403).json({ error: "Superadmin privileges required" });
  }
  
  next();
}