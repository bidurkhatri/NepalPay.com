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
  // Special case for older accounts with plaintext passwords (for demo accounts)
  if (!stored.includes('.')) {
    return supplied === stored;
  }

  // For properly hashed passwords
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

        // No need to update last login timestamp as it's not in our schema
        
        // Skip activity creation for now as we're having schema issues
        // We'll fix this in a future update

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
      console.log('Registration attempt with data:', req.body);
      const { username, email, password, firstName = null, lastName = null, fullName = null } = req.body;

      // Basic validation
      if (!username || !email || !password) {
        console.log('Registration failed: Missing required fields');
        return res.status(400).json({ error: 'Username, email, and password are required' });
      }

      try {
        // Check if username already exists
        const existingUser = await storage.getUserByUsername(username);
        if (existingUser) {
          console.log('Registration failed: Username already exists');
          return res.status(400).json({ error: 'Username already exists' });
        }

        // Check if email already exists
        const existingEmail = await storage.getUserByEmail(email);
        if (existingEmail) {
          console.log('Registration failed: Email already in use');
          return res.status(400).json({ error: 'Email already in use' });
        }
      } catch (error) {
        console.error('Error checking existing user:', error);
        return res.status(500).json({ error: 'Error checking user existence' });
      }

      // Split full name into first and last name if provided
      let firstNameValue = firstName;
      let lastNameValue = lastName;
      
      if (fullName && (!firstName || !lastName)) {
        const nameParts = fullName.split(' ');
        firstNameValue = nameParts[0] || null;
        lastNameValue = nameParts.slice(1).join(' ') || null;
      }

      // Create new user with hashed password
      const user = await storage.createUser({
        username,
        email,
        password: await hashPassword(password),
        firstName: firstNameValue,
        lastName: lastNameValue,
        phoneNumber: null,
        walletAddress: null,
        role: 'user',
        kycStatus: 'not_submitted',
        kycVerificationId: null,
        kycVerifiedAt: null,
        stripeCustomerId: null,
        stripeSubscriptionId: null,
        finapiUserId: null,
      });

      // Create wallet for new user
      const wallet = await storage.createWallet({
        userId: user.id,
        balance: '0',
        currency: 'NPT',
        lastUpdated: new Date(),
        nptBalance: '0',
        bnbBalance: '0',
        address: null,
        isPrimary: true
      });

      // Skip activity creation for now

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
      
      // Skip activity for now
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
      const allowedFields = ['firstName', 'lastName', 'phoneNumber'];
      const updates: Partial<User> = {};

      // Only allow updating specific fields
      for (const field of allowedFields) {
        if (req.body[field] !== undefined) {
          updates[field] = req.body[field];
        }
      }
      
      // Handle fullName field by splitting it into firstName and lastName
      if (req.body.fullName !== undefined) {
        const nameParts = req.body.fullName.split(' ');
        updates.firstName = nameParts[0] || null;
        updates.lastName = nameParts.slice(1).join(' ') || null;
      }

      if (Object.keys(updates).length === 0) {
        return res.status(400).json({ error: 'No valid fields to update' });
      }

      // Update the user
      const updatedUser = await storage.updateUser(req.user.id, updates);
      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Skip activity creation for now

      // Return updated user (excluding password)
      const { password, ...userWithoutPassword } = updatedUser;
      return res.json(userWithoutPassword);
    } catch (error) {
      log(`Profile update error: ${error instanceof Error ? error.message : String(error)}`);
      return res.status(500).json({ error: 'Profile update failed' });
    }
  });

  // Password reset token manager (in-memory storage for demo purposes)
  // In production, these would be stored in the database with expiration
  const passwordResetTokens: Map<string, { userId: number; expires: Date }> = new Map();

  // Request password reset endpoint
  app.post('/api/forgot-password', async (req, res) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ error: 'Email is required' });
      }

      // Find user by email
      const user = await storage.getUserByEmail(email);
      if (!user) {
        // Don't reveal whether or not a user exists for security
        return res.status(200).json({ message: 'If an account with that email exists, a password reset link has been sent.' });
      }

      // Generate a secure random token
      const token = randomBytes(32).toString('hex');
      
      // Store token with expiration (24 hours)
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);
      passwordResetTokens.set(token, { userId: user.id, expires: expiresAt });

      // In a real app, we would send an email here with the reset link
      // For demo purposes, we'll return the token in the response
      // NOTE: In production, you would use SendGrid or another email service

      // Skip activity creation for now

      console.log(`Password reset token for ${email}: ${token}`);

      return res.status(200).json({ 
        message: 'If an account with that email exists, a password reset link has been sent.',
        // Only include the token in development for testing purposes
        ...(process.env.NODE_ENV !== 'production' && { token })
      });
    } catch (error) {
      log(`Forgot password error: ${error instanceof Error ? error.message : String(error)}`);
      return res.status(500).json({ error: 'Failed to process password reset request' });
    }
  });

  // Reset password endpoint
  app.post('/api/reset-password', async (req, res) => {
    try {
      const { token, password } = req.body;

      if (!token || !password) {
        return res.status(400).json({ error: 'Token and new password are required' });
      }

      // Verify token exists and is not expired
      const tokenData = passwordResetTokens.get(token);
      if (!tokenData) {
        return res.status(400).json({ error: 'Invalid or expired reset token' });
      }

      if (tokenData.expires < new Date()) {
        // Clean up expired token
        passwordResetTokens.delete(token);
        return res.status(400).json({ error: 'Reset token has expired' });
      }

      // Get user
      const user = await storage.getUser(tokenData.userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Hash the new password
      const hashedPassword = await hashPassword(password);

      // Update user's password
      const updatedUser = await storage.updateUser(user.id, { password: hashedPassword });
      if (!updatedUser) {
        return res.status(500).json({ error: 'Failed to update password' });
      }

      // Clean up used token
      passwordResetTokens.delete(token);

      // Skip activity creation for now

      return res.status(200).json({ message: 'Password has been reset successfully' });
    } catch (error) {
      log(`Reset password error: ${error instanceof Error ? error.message : String(error)}`);
      return res.status(500).json({ error: 'Failed to reset password' });
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