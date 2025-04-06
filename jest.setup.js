// This file will run before each test file
import { jest } from '@jest/globals';

// Set environment variables for testing
process.env.NODE_ENV = 'test';
process.env.SESSION_SECRET = 'test-session-secret';

// Mock the PostgreSQL connection
jest.mock('./server/db', () => {
  return {
    pool: {
      query: jest.fn(),
      connect: jest.fn(),
      on: jest.fn(),
    },
    db: {
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      from: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      returning: jest.fn().mockReturnThis(),
    },
    initializeDatabase: jest.fn().mockResolvedValue(undefined),
    testConnection: jest.fn().mockResolvedValue(undefined),
    createTables: jest.fn().mockResolvedValue(undefined),
  };
});

// Mock Stripe
jest.mock('stripe', () => {
  return jest.fn().mockImplementation(() => ({
    paymentIntents: {
      create: jest.fn().mockResolvedValue({
        id: 'pi_test123456789',
        client_secret: 'pi_test123456789_secret_987654321',
        status: 'requires_payment_method',
      }),
      retrieve: jest.fn().mockResolvedValue({
        id: 'pi_test123456789',
        client_secret: 'pi_test123456789_secret_987654321',
        status: 'succeeded',
      }),
    },
    customers: {
      create: jest.fn().mockResolvedValue({
        id: 'cus_test123456789',
        email: 'test@example.com',
      }),
    },
    webhooks: {
      constructEvent: jest.fn().mockReturnValue({
        type: 'payment_intent.succeeded',
        data: {
          object: {
            id: 'pi_test123456789',
            amount: 10000,
            metadata: {
              userId: '1',
              walletAddress: '0x1234567890123456789012345678901234567890',
            },
          },
        },
      }),
    },
  }));
});

// Global afterAll cleanup
afterAll(async () => {
  // Any global cleanup after all tests
});