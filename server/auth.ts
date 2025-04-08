import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express, Request, Response, NextFunction } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User as UserType } from "../shared/schema";

declare global {
  namespace Express {
    interface User extends UserType {}
  }
}

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string): Promise<boolean> {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
}

export function isAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated() && (req.user.role === 'admin' || req.user.role === 'superadmin')) {
    return next();
  }
  res.status(403).json({ message: "Access denied" });
}

export function isSuperAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated() && req.user.role === 'superadmin') {
    return next();
  }
  res.status(403).json({ message: "Access denied" });
}

export function setupAuth(app: Express) {
  const sessionSecret = process.env.SESSION_SECRET || randomBytes(32).toString('hex');

  const sessionSettings: session.SessionOptions = {
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      sameSite: 'lax',
    },
    store: storage.sessionStore,
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user || !(await comparePasswords(password, user.password))) {
          return done(null, false, { message: "Invalid username or password" });
        }
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }),
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  app.post("/api/register", async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(req.body.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      const existingEmail = await storage.getUserByEmail(req.body.email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }

      // Create user with hashed password
      const user = await storage.createUser({
        ...req.body,
        password: await hashPassword(req.body.password),
      });

      // Create a wallet for the user
      await storage.createWallet({
        userId: user.id,
        address: `0x${randomBytes(20).toString('hex')}`, // Mock address, should be replaced with real wallet address
        balance: 0,
      });

      // Log activity
      await storage.createActivity({
        userId: user.id,
        type: 'login',
        details: 'User registered and logged in',
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'] || '',
      });

      // Log the user in
      req.login(user, (err) => {
        if (err) return next(err);
        // Don't send password to client
        const { password, ...userWithoutPassword } = user;
        return res.status(201).json(userWithoutPassword);
      });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/login", (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("local", (err: Error, user: UserType, info: { message: string }) => {
      if (err) return next(err);
      if (!user) return res.status(400).json({ message: info.message || "Invalid credentials" });

      req.login(user, async (loginErr) => {
        if (loginErr) return next(loginErr);

        try {
          // Log activity
          await storage.createActivity({
            userId: user.id,
            type: 'login',
            details: 'User logged in',
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'] || '',
          });

          // Don't send password to client
          const { password, ...userWithoutPassword } = user;
          return res.json(userWithoutPassword);
        } catch (activityError) {
          console.error("Failed to log login activity:", activityError);
          // Still return success even if activity logging fails
          const { password, ...userWithoutPassword } = user;
          return res.json(userWithoutPassword);
        }
      });
    })(req, res, next);
  });

  app.post("/api/logout", (req: Request, res: Response) => {
    const userId = req.user?.id;
    
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: "Failed to logout" });
      }

      if (userId) {
        // Log activity (don't await to avoid blocking logout)
        storage.createActivity({
          userId,
          type: 'login',
          details: 'User logged out',
          ipAddress: req.ip,
          userAgent: req.headers['user-agent'] || '',
        }).catch(err => console.error("Failed to log logout activity:", err));
      }

      req.session.destroy((err) => {
        if (err) {
          console.error("Error destroying session:", err);
        }
        res.clearCookie('connect.sid');
        return res.sendStatus(200);
      });
    });
  });

  app.get("/api/user", (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    // Don't send password to client
    const { password, ...userWithoutPassword } = req.user;
    res.json(userWithoutPassword);
  });
}