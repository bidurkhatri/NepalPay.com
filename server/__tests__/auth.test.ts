import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { storage } from '../storage';
import { hashPassword, comparePasswords } from '../auth';

// Mock express and passport modules
jest.mock('express', () => {
  const mockRequest = () => {
    const req: any = {};
    req.logout = jest.fn().mockImplementation((callback) => callback());
    req.login = jest.fn().mockImplementation((user, callback) => callback());
    req.isAuthenticated = jest.fn().mockReturnValue(true);
    req.user = { id: 1, username: 'testuser' };
    return req;
  };
  
  const mockResponse = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnThis();
    res.json = jest.fn().mockReturnThis();
    res.send = jest.fn().mockReturnThis();
    res.sendStatus = jest.fn().mockReturnThis();
    return res;
  };
  
  const mockNext = jest.fn();
  
  return {
    Router: jest.fn().mockReturnValue({
      post: jest.fn(),
      get: jest.fn(),
    }),
    mockRequest,
    mockResponse,
    mockNext,
  };
});

jest.mock('passport', () => ({
  initialize: jest.fn().mockReturnValue(jest.fn()),
  session: jest.fn().mockReturnValue(jest.fn()),
  use: jest.fn(),
  authenticate: jest.fn().mockReturnValue(jest.fn((req, res, next) => next())),
  serializeUser: jest.fn(),
  deserializeUser: jest.fn(),
}));

// Mock storage
jest.mock('../storage', () => ({
  storage: {
    getUserByUsername: jest.fn(),
    getUser: jest.fn(),
    createUser: jest.fn(),
    sessionStore: {},
  },
}));

describe('Auth Functions', () => {
  describe('Password Handling', () => {
    it('should hash passwords correctly', async () => {
      const password = 'test-password';
      const hashedPassword = await hashPassword(password);
      
      // Hashed password should be a string
      expect(typeof hashedPassword).toBe('string');
      
      // Hashed password should contain a salt (indicated by a dot)
      expect(hashedPassword.includes('.')).toBe(true);
      
      // Hashed password should be different from the original
      expect(hashedPassword).not.toBe(password);
    });
    
    it('should verify passwords correctly', async () => {
      const password = 'test-password';
      const hashedPassword = await hashPassword(password);
      
      // Correct password should match
      const isMatch = await comparePasswords(password, hashedPassword);
      expect(isMatch).toBe(true);
      
      // Incorrect password should not match
      const isNotMatch = await comparePasswords('wrong-password', hashedPassword);
      expect(isNotMatch).toBe(false);
    });
  });
  
  describe('User Authentication', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    
    it('should get user by username', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashed-password',
      };
      
      (storage.getUserByUsername as jest.Mock).mockResolvedValue(mockUser);
      
      const user = await storage.getUserByUsername('testuser');
      
      expect(storage.getUserByUsername).toHaveBeenCalledWith('testuser');
      expect(user).toEqual(mockUser);
    });
    
    it('should return undefined for non-existent username', async () => {
      (storage.getUserByUsername as jest.Mock).mockResolvedValue(undefined);
      
      const user = await storage.getUserByUsername('nonexistent');
      
      expect(storage.getUserByUsername).toHaveBeenCalledWith('nonexistent');
      expect(user).toBeUndefined();
    });
    
    it('should create a new user', async () => {
      const newUser = {
        username: 'newuser',
        email: 'new@example.com',
        password: 'hashed-password',
        firstName: 'New',
        lastName: 'User',
        role: 'USER',
      };
      
      const createdUser = {
        id: 2,
        ...newUser,
        createdAt: new Date(),
      };
      
      (storage.createUser as jest.Mock).mockResolvedValue(createdUser);
      
      const user = await storage.createUser(newUser);
      
      expect(storage.createUser).toHaveBeenCalledWith(newUser);
      expect(user).toEqual(createdUser);
    });
  });
});