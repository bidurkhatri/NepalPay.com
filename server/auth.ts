import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Express, Request, Response, NextFunction } from 'express';
import session from 'express-session';
import { scrypt, randomBytes, timingSafeEqual } from 'crypto';
import { promisify } from 'util';
import { db, pgPool } from './db';
import { User } from '@shared/schema';
import connectPg from 'connect-pg-simple';

// Extend Express.User to use our User type
declare global {
  namespace Express {
    interface User extends User {}
  }
}

// Promisify scrypt
const scryptAsync = promisify(scrypt);

// Hash password function
async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex');
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString('hex')}.${salt}`;
}

// Compare passwords function
async function comparePasswords(supplied: string, stored: string): Promise<boolean> {
  const [hashed, salt] = stored.split('.');
  const hashedBuf = Buffer.from(hashed, 'hex');
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

// Middleware to check if user is authenticated
export function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: 'Not authenticated' });
}

// Middleware to check if user is admin
export function isAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated() && (req.user.role === 'admin' || req.user.role === 'superadmin')) {
    return next();
  }
  res.status(403).json({ message: 'Forbidden: Admin access required' });
}

// Middleware to check if user is superadmin
export function isSuperAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated() && req.user.role === 'superadmin') {
    return next();
  }
  res.status(403).json({ message: 'Forbidden: Superadmin access required' });
}

// Setup authentication
export function setupAuth(app: Express) {
  // PostgreSQL session store for Express
  const PostgresqlStore = connectPg(session);
  
  // Session configuration
  const sessionConfig: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
    },
    store: new PostgresqlStore({
      pool: pgPool,
      tableName: 'session',
      createTableIfMissing: true,
    }),
  };

  // Set trust proxy if in production
  if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1);
  }

  // Use session middleware
  app.use(session(sessionConfig));
  app.use(passport.initialize());
  app.use(passport.session());

  // Configure passport with local strategy
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        // Get users with matching username
        const users = await db.select().from('users').where({ username });
        
        if (users.length === 0) {
          return done(null, false, { message: 'Incorrect username or password' });
        }

        const user = users[0];
        
        // Check password
        const isValidPassword = await comparePasswords(password, user.password);
        
        if (!isValidPassword) {
          return done(null, false, { message: 'Incorrect username or password' });
        }
        
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
      const users = await db.select().from('users').where({ id });
      
      if (users.length === 0) {
        return done(null, false);
      }
      
      done(null, users[0]);
    } catch (error) {
      done(error);
    }
  });

  // Auth routes
  app.post('/api/register', async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Check if username already exists
      const existingUsers = await db.select().from('users').where({ username: req.body.username });
      
      if (existingUsers.length > 0) {
        return res.status(400).json({ message: 'Username already exists' });
      }

      // Hash password
      const hashedPassword = await hashPassword(req.body.password);
      
      // Create user
      const [user] = await db
        .insert('users')
        .values({
          ...req.body,
          password: hashedPassword,
        })
        .returning();

      // Log user in
      req.login(user, (err) => {
        if (err) return next(err);
        
        // Create a sanitized user object without password
        const { password, ...userWithoutPassword } = user;
        
        return res.status(201).json(userWithoutPassword);
      });
    } catch (error) {
      next(error);
    }
  });

  app.post('/api/login', (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('local', (err: Error, user: User, info: { message: string }) => {
      if (err) return next(err);
      
      if (!user) {
        return res.status(401).json({ message: info?.message || 'Authentication failed' });
      }
      
      req.login(user, (loginErr) => {
        if (loginErr) return next(loginErr);
        
        // Create a sanitized user object without password
        const { password, ...userWithoutPassword } = user;
        
        return res.json(userWithoutPassword);
      });
    })(req, res, next);
  });

  app.post('/api/logout', (req: Request, res: Response) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: 'Logout failed' });
      }
      res.status(200).json({ message: 'Logout successful' });
    });
  });

  app.get('/api/user', (req: Request, res: Response) => {
    if (req.isAuthenticated()) {
      // Create a sanitized user object without password
      const { password, ...userWithoutPassword } = req.user;
      return res.json(userWithoutPassword);
    }
    
    res.status(401).json({ message: 'Not authenticated' });
  });
}