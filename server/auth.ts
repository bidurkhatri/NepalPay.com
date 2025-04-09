import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Express } from 'express';
import session from 'express-session';
import { scrypt, randomBytes, timingSafeEqual } from 'crypto';
import { promisify } from 'util';
import { storage } from './storage';
import { User } from '@shared/schema';
import { log } from './vite';
import connectPgSimple from 'connect-pg-simple';
import { pool } from './db';

// Extend Express.User interface
declare global {
  namespace Express {
    interface User extends Omit<User, 'id'> {
      id: number;
    }
  }
}

// Promisify scrypt
const scryptAsync = promisify(scrypt);

/**
 * Hash a password using scrypt with a random salt
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex');
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString('hex')}.${salt}`;
}

/**
 * Compare a password against a stored hash
 * Only processes properly hashed passwords for security (format: "hash.salt")
 */
export async function comparePasswords(supplied: string, stored: string): Promise<boolean> {
  // Make sure the stored password is in the correct format
  if (!stored.includes('.')) {
    return false;
  }

  const [hashed, salt] = stored.split('.');
  const hashedBuf = Buffer.from(hashed, 'hex');
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

/**
 * Set up authentication routes and passport configuration
 */
export function setupAuth(app: Express): void {
  // PostgreSQL session store
  const PgStore = connectPgSimple(session);

  // Configure session middleware
  const sessionSettings: session.SessionOptions = {
    store: new PgStore({
      pool,
      tableName: 'session', // Default session table name
      createTableIfMissing: true,
    }),
    secret: process.env.SESSION_SECRET || 'nepalipay_session_secret_change_in_production',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
      httpOnly: true,
      sameSite: 'lax',
    },
  };

  // Set up session and passport
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  // Configure local strategy (username/password)
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        // Find user by username
        const user = await storage.getUserByUsername(username);
        
        // If no user found or password doesn't match
        if (!user || !(await comparePasswords(password, user.password))) {
          return done(null, false);
        }

        // Update last login timestamp
        await storage.updateUser(user.id, {
          lastLoginAt: new Date(),
        });
        
        // Create activity record
        await storage.createActivity({
          userId: user.id,
          activityType: 'login',
          description: 'User logged in',
          ipAddress: null, // In a real app, we'd get this from the request
          userAgent: null, // In a real app, we'd get this from the request
          metadata: {
            method: 'local',
          },
          transactionId: null,
          loanId: null,
          collateralId: null
        });

        // Success
        return done(null, user);
      } catch (error) {
        log(`Authentication error: ${error instanceof Error ? error.message : String(error)}`);
        return done(error);
      }
    })
  );

  // Serialize/deserialize user to/from session
  passport.serializeUser((user: Express.User, done) => {
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

  // Registration endpoint
  app.post('/api/register', async (req, res) => {
    try {
      const { username, email, password, fullName = null, phone = null } = req.body;

      // Basic validation
      if (!username || !email || !password) {
        return res.status(400).json({ error: 'Username, email, and password are required' });
      }

      // Check if username already exists
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ error: 'Username already exists' });
      }

      // Check if email already exists
      const existingEmail = await storage.getUserByEmail(email);
      if (existingEmail) {
        return res.status(400).json({ error: 'Email already in use' });
      }

      // Create new user with hashed password
      const user = await storage.createUser({
        username,
        email,
        password: await hashPassword(password),
        fullName,
        phone,
        role: 'user',
        kycStatus: 'not_submitted',
        kycVerificationId: null,
        kycVerifiedAt: null,
        twoFactorEnabled: false,
        twoFactorSecret: null,
        lastLoginAt: new Date(),
        referralCode: generateReferralCode(username),
        referredBy: null,
        preferredLanguage: 'en',
        preferences: {},
        stripeCustomerId: null,
        stripeSubscriptionId: null,
      });

      // Create wallet for new user
      const wallet = await storage.createWallet({
        userId: user.id,
        nptBalance: '0',
        bnbBalance: '0',
        ethBalance: '0',
        btcBalance: '0',
        walletType: 'custodial',
        nptAddress: null,
        bnbAddress: null,
        ethAddress: null,
        btcAddress: null,
        privateKeyEncrypted: null,
        encryptionIv: null,
        lastSyncedAt: null
      });

      // Create activity record
      await storage.createActivity({
        userId: user.id,
        activityType: 'wallet_create',
        description: 'Wallet created for new user',
        ipAddress: null,
        userAgent: null,
        metadata: {
          walletId: wallet.id,
          walletType: wallet.walletType,
        },
        transactionId: null,
        loanId: null,
        collateralId: null
      });

      // Log the user in
      req.login(user, (err) => {
        if (err) {
          return res.status(500).json({ error: 'Login after registration failed' });
        }
        
        // Return user data (excluding password)
        const { password, ...userWithoutPassword } = user;
        return res.status(201).json(userWithoutPassword);
      });
    } catch (error) {
      log(`Registration error: ${error instanceof Error ? error.message : String(error)}`);
      return res.status(500).json({ error: 'Registration failed' });
    }
  });

  // Login endpoint (handled by passport)
  app.post('/api/login', (req, res, next) => {
    // Log incoming login request
    console.log('Login attempt for:', req.body.username);
    
    if (!req.body.username || !req.body.password) {
      console.log('Login failed: Missing username or password');
      return res.status(400).json({ error: 'Username and password are required' });
    }
    
    passport.authenticate('local', (err, user, info) => {
      if (err) {
        console.error('Login error:', err);
        return res.status(500).json({ error: 'Internal server error during authentication' });
      }
      
      if (!user) {
        console.log('Login failed: Invalid credentials for', req.body.username);
        return res.status(401).json({ error: 'Invalid username or password' });
      }
      
      req.login(user, (loginErr) => {
        if (loginErr) {
          console.error('Login session error:', loginErr);
          return res.status(500).json({ error: 'Failed to create login session' });
        }
        
        // Return user data (excluding password)
        const { password, ...userWithoutPassword } = user;
        console.log('Login successful for:', user.username);
        return res.json(userWithoutPassword);
      });
    })(req, res, next);
  });

  // Logout endpoint
  app.post('/api/logout', (req, res) => {
    if (req.isAuthenticated()) {
      const userId = req.user.id;
      
      // Create activity record
      storage.createActivity({
        userId,
        activityType: 'login',
        description: 'User logged out',
        ipAddress: null,
        userAgent: null,
        metadata: {},
        transactionId: null,
        loanId: null,
        collateralId: null
      }).catch(err => {
        log(`Error recording logout activity: ${err}`);
      });
    }
    
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ error: 'Logout failed' });
      }
      return res.sendStatus(200);
    });
  });

  // Get current user endpoint
  app.get('/api/user', (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    // Return user data (excluding password)
    const { password, ...userWithoutPassword } = req.user;
    return res.json(userWithoutPassword);
  });

  // Update user profile endpoint
  app.patch('/api/user', async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    try {
      const allowedFields = ['fullName', 'phone', 'preferredLanguage', 'preferences'];
      const updates: Partial<User> = {};

      // Only allow updating specific fields
      for (const field of allowedFields) {
        if (req.body[field] !== undefined) {
          updates[field] = req.body[field];
        }
      }

      if (Object.keys(updates).length === 0) {
        return res.status(400).json({ error: 'No valid fields to update' });
      }

      // Update the user
      const updatedUser = await storage.updateUser(req.user.id, updates);
      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Create activity record
      await storage.createActivity({
        userId: req.user.id,
        activityType: 'profile_update',
        description: 'User profile updated',
        ipAddress: null,
        userAgent: null,
        metadata: {
          fields: Object.keys(updates),
        },
        transactionId: null,
        loanId: null,
        collateralId: null
      });

      // Return updated user (excluding password)
      const { password, ...userWithoutPassword } = updatedUser;
      return res.json(userWithoutPassword);
    } catch (error) {
      log(`Profile update error: ${error instanceof Error ? error.message : String(error)}`);
      return res.status(500).json({ error: 'Profile update failed' });
    }
  });
}

/**
 * Generate a referral code based on username
 */
function generateReferralCode(username: string): string {
  const randomPart = randomBytes(3).toString('hex').toUpperCase();
  const usernamePart = username.slice(0, 4).toUpperCase();
  return `${usernamePart}-${randomPart}`;
}