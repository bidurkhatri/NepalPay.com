import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import { Express } from 'express';
import { hashPassword, comparePasswords, setupAuth } from '../auth';
import { User } from '@shared/schema';
import * as crypto from 'crypto';

// Mock the crypto module
jest.mock('crypto', () => {
  return {
    scrypt: jest.fn((password, salt, keylen, callback) => {
      // Simple mock that just concatenates password and salt
      const result = Buffer.from(`${password}${salt}`);
      callback(null, result);
    }),
    randomBytes: jest.fn((size) => {
      return Buffer.from('mockedsalt');
    }),
    timingSafeEqual: jest.fn((a, b) => {
      // For testing, just check if the buffers have the same string representation
      return a.toString() === b.toString();
    }),
  };
});

describe('Auth Utilities', () => {
  describe('hashPassword', () => {
    it('should hash a password with a random salt', async () => {
      const password = 'testPassword123';
      const hashedPassword = await hashPassword(password);
      
      // Check that the hash contains both the hash and the salt
      expect(hashedPassword).toContain('.');
      
      const [hash, salt] = hashedPassword.split('.');
      expect(hash).toBeTruthy();
      expect(salt).toBeTruthy();
      
      // Verify that randomBytes was called
      expect(crypto.randomBytes).toHaveBeenCalledWith(16);
    });
  });
  
  describe('comparePasswords', () => {
    it('should return true for matching passwords', async () => {
      // Since we've mocked crypto.scrypt and crypto.timingSafeEqual,
      // we need to construct our test case based on their mock implementations
      const mockSalt = 'mockedsalt';
      const password = 'testPassword123';
      const mockHash = Buffer.from(`${password}${mockSalt}`).toString('hex');
      const storedPassword = `${mockHash}.${mockSalt}`;
      
      const result = await comparePasswords(password, storedPassword);
      
      expect(result).toBe(true);
      expect(crypto.timingSafeEqual).toHaveBeenCalled();
    });
    
    it('should return false for non-matching passwords', async () => {
      const mockSalt = 'mockedsalt';
      const password = 'testPassword123';
      const wrongPassword = 'wrongPassword';
      const mockHash = Buffer.from(`${password}${mockSalt}`).toString('hex');
      const storedPassword = `${mockHash}.${mockSalt}`;
      
      // Mock timingSafeEqual to return false for this test
      (crypto.timingSafeEqual as jest.Mock).mockReturnValueOnce(false);
      
      const result = await comparePasswords(wrongPassword, storedPassword);
      
      expect(result).toBe(false);
      expect(crypto.timingSafeEqual).toHaveBeenCalled();
    });
  });
});

describe('Auth Setup', () => {
  // Mock Express app
  const mockApp: Partial<Express> = {
    set: jest.fn(),
    use: jest.fn(),
    post: jest.fn(),
    get: jest.fn(),
  };
  
  // Mock passport
  const mockPassport = {
    initialize: jest.fn(() => 'passportInitialize'),
    session: jest.fn(() => 'passportSession'),
    use: jest.fn(),
    serializeUser: jest.fn(),
    deserializeUser: jest.fn(),
    authenticate: jest.fn(() => (req: any, res: any, next: any) => {
      req.user = { id: 1, username: 'testuser' };
      next();
    }),
  };
  
  // Mock storage
  const mockStorage = {
    sessionStore: 'mockSessionStore',
    getUserByUsername: jest.fn(),
    getUser: jest.fn(),
    createUser: jest.fn(),
  };
  
  // Mock session
  const mockSession = jest.fn(() => 'sessionMiddleware');
  
  beforeEach(() => {
    // Set up mocks
    jest.mock('passport', () => mockPassport);
    jest.mock('../storage', () => ({ storage: mockStorage }));
    jest.mock('express-session', () => mockSession);
    
    // Reset function call history
    mockApp.set = jest.fn();
    mockApp.use = jest.fn();
    mockApp.post = jest.fn();
    mockApp.get = jest.fn();
    mockPassport.initialize = jest.fn(() => 'passportInitialize');
    mockPassport.session = jest.fn(() => 'passportSession');
    mockPassport.use = jest.fn();
    mockStorage.getUserByUsername = jest.fn();
    mockStorage.getUser = jest.fn();
    mockStorage.createUser = jest.fn();
  });
  
  afterEach(() => {
    jest.resetAllMocks();
  });
  
  it('should set up the authentication middleware', () => {
    // Call the function to test
    setupAuth(mockApp as Express);
    
    // Verify that the app was configured correctly
    expect(mockApp.set).toHaveBeenCalledWith('trust proxy', 1);
    expect(mockApp.use).toHaveBeenCalledTimes(3); // session, passport.initialize, passport.session
    expect(mockPassport.initialize).toHaveBeenCalled();
    expect(mockPassport.session).toHaveBeenCalled();
    expect(mockPassport.use).toHaveBeenCalled();
    expect(mockPassport.serializeUser).toHaveBeenCalled();
    expect(mockPassport.deserializeUser).toHaveBeenCalled();
    
    // Verify that routes were set up
    expect(mockApp.post).toHaveBeenCalledWith('/api/register', expect.any(Function));
    expect(mockApp.post).toHaveBeenCalledWith('/api/login', expect.any(Function));
    expect(mockApp.post).toHaveBeenCalledWith('/api/logout', expect.any(Function));
    expect(mockApp.get).toHaveBeenCalledWith('/api/user', expect.any(Function));
  });
  
  it('should handle user registration correctly', async () => {
    // Setup
    const req = {
      body: {
        username: 'newuser',
        password: 'password123',
      },
      login: jest.fn((user, callback) => callback()),
    };
    const res = {
      status: jest.fn(() => res),
      send: jest.fn(),
      json: jest.fn(),
    };
    const next = jest.fn();
    
    // Mock storage to return no existing user
    mockStorage.getUserByUsername.mockResolvedValue(null);
    
    // Mock createUser to return a created user
    const createdUser = {
      id: 1,
      username: 'newuser',
      password: 'hashedpassword',
    };
    mockStorage.createUser.mockResolvedValue(createdUser);
    
    // Call setupAuth to register the route handlers
    setupAuth(mockApp as Express);
    
    // Get the register route handler and call it
    const registerRouteHandler = (mockApp.post as jest.Mock).mock.calls.find(
      call => call[0] === '/api/register'
    )[1];
    
    await registerRouteHandler(req, res, next);
    
    // Verify that the user was created and login was called
    expect(mockStorage.getUserByUsername).toHaveBeenCalledWith('newuser');
    expect(mockStorage.createUser).toHaveBeenCalled();
    expect(req.login).toHaveBeenCalledWith(createdUser, expect.any(Function));
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(createdUser);
  });
  
  it('should handle login correctly', async () => {
    // Setup
    const req = {
      user: { id: 1, username: 'testuser' },
    };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
    
    // Call setupAuth to register the route handlers
    setupAuth(mockApp as Express);
    
    // Get the login route handler and call it
    const loginRouteHandler = (mockApp.post as jest.Mock).mock.calls.find(
      call => call[0] === '/api/login'
    )[1];
    
    // The second argument is the middleware
    const authenticateMiddleware = mockPassport.authenticate();
    
    authenticateMiddleware(req, res, () => {
      loginRouteHandler(req, res);
    });
    
    // Verify that the user was logged in
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(req.user);
  });
  
  it('should handle logout correctly', async () => {
    // Setup
    const req = {
      logout: jest.fn((callback) => callback()),
    };
    const res = {
      sendStatus: jest.fn(),
    };
    const next = jest.fn();
    
    // Call setupAuth to register the route handlers
    setupAuth(mockApp as Express);
    
    // Get the logout route handler and call it
    const logoutRouteHandler = (mockApp.post as jest.Mock).mock.calls.find(
      call => call[0] === '/api/logout'
    )[1];
    
    await logoutRouteHandler(req, res, next);
    
    // Verify that logout was called
    expect(req.logout).toHaveBeenCalled();
    expect(res.sendStatus).toHaveBeenCalledWith(200);
  });
  
  it('should handle getting user info when authenticated', async () => {
    // Setup for authenticated user
    const req = {
      isAuthenticated: jest.fn(() => true),
      user: { id: 1, username: 'testuser' },
    };
    const res = {
      json: jest.fn(),
      sendStatus: jest.fn(),
    };
    
    // Call setupAuth to register the route handlers
    setupAuth(mockApp as Express);
    
    // Get the user route handler and call it
    const userRouteHandler = (mockApp.get as jest.Mock).mock.calls.find(
      call => call[0] === '/api/user'
    )[1];
    
    await userRouteHandler(req, res);
    
    // Verify that the user info was returned
    expect(req.isAuthenticated).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(req.user);
  });
  
  it('should handle getting user info when not authenticated', async () => {
    // Setup for unauthenticated user
    const req = {
      isAuthenticated: jest.fn(() => false),
    };
    const res = {
      json: jest.fn(),
      sendStatus: jest.fn(),
    };
    
    // Call setupAuth to register the route handlers
    setupAuth(mockApp as Express);
    
    // Get the user route handler and call it
    const userRouteHandler = (mockApp.get as jest.Mock).mock.calls.find(
      call => call[0] === '/api/user'
    )[1];
    
    await userRouteHandler(req, res);
    
    // Verify that 401 was returned
    expect(req.isAuthenticated).toHaveBeenCalled();
    expect(res.sendStatus).toHaveBeenCalledWith(401);
  });
});
