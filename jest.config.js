export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      useESM: true,
    }],
  },
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
    '@shared/(.*)': '<rootDir>/shared/$1',
  },
  testMatch: [
    '**/server/**/*.test.(ts|js)',
    '**/shared/**/*.test.(ts|js)',
  ],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  collectCoverageFrom: [
    'server/**/*.{ts,js}',
    'shared/**/*.{ts,js}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!server/db.ts', // Exclude database connection file
  ],
  coverageReporters: ['text', 'lcov'],
};