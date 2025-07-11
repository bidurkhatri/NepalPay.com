/**
 * Environment configuration and validation for NepaliPay
 * Centralizes all environment variable handling with proper defaults and validation
 */

export interface EnvironmentConfig {
  // Network Configuration
  BSC_NETWORK_URL: string;
  NEPALIPAY_CONTRACT_ADDRESS: string;
  WALLET_PRIVATE_KEY?: string;
  WALLET_ENCRYPTION_KEY: string;
  
  // Application Environment
  NODE_ENV: 'development' | 'staging' | 'production';
  PORT: number;
  
  // Database Configuration
  DATABASE_URL: string;
  
  // External Services
  STRIPE_SECRET_KEY?: string;
  
  // Security
  SESSION_SECRET: string;
}

/**
 * Load and validate environment configuration
 */
export function loadEnvironmentConfig(): EnvironmentConfig {
  const config: EnvironmentConfig = {
    // Network Configuration
    BSC_NETWORK_URL: process.env.BSC_NETWORK_URL || 'https://bsc-dataseed1.binance.org/',
    NEPALIPAY_CONTRACT_ADDRESS: process.env.NEPALIPAY_CONTRACT_ADDRESS || '',
    WALLET_PRIVATE_KEY: process.env.WALLET_PRIVATE_KEY,
    WALLET_ENCRYPTION_KEY: process.env.WALLET_ENCRYPTION_KEY || generateDefaultEncryptionKey(),
    
    // Application Environment
    NODE_ENV: (process.env.NODE_ENV as any) || 'development',
    PORT: parseInt(process.env.PORT || '5000', 10),
    
    // Database Configuration
    DATABASE_URL: process.env.DATABASE_URL || '',
    
    // External Services
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    
    // Security
    SESSION_SECRET: process.env.SESSION_SECRET || 'dev-session-secret-change-in-production'
  };

  // Validate critical configuration
  validateEnvironmentConfig(config);
  
  return config;
}

/**
 * Validate environment configuration
 */
function validateEnvironmentConfig(config: EnvironmentConfig): void {
  const errors: string[] = [];
  
  // Production validations
  if (config.NODE_ENV === 'production') {
    if (!config.NEPALIPAY_CONTRACT_ADDRESS || config.NEPALIPAY_CONTRACT_ADDRESS.startsWith('0x1234')) {
      errors.push('NEPALIPAY_CONTRACT_ADDRESS must be set to a valid contract address in production');
    }
    
    if (!config.WALLET_PRIVATE_KEY) {
      errors.push('WALLET_PRIVATE_KEY is required in production for blockchain operations');
    }
    
    if (config.SESSION_SECRET === 'dev-session-secret-change-in-production') {
      errors.push('SESSION_SECRET must be changed from default value in production');
    }
    
    if (!config.DATABASE_URL) {
      errors.push('DATABASE_URL is required');
    }
  }
  
  // Development validations
  if (config.NODE_ENV === 'development') {
    if (!config.NEPALIPAY_CONTRACT_ADDRESS) {
      console.warn('Warning: NEPALIPAY_CONTRACT_ADDRESS not set, using testnet default');
    }
  }
  
  // General validations
  if (isNaN(config.PORT) || config.PORT < 1 || config.PORT > 65535) {
    errors.push('PORT must be a valid port number between 1 and 65535');
  }
  
  if (errors.length > 0) {
    throw new Error(`Environment configuration errors:\n${errors.join('\n')}`);
  }
}

/**
 * Generate a default encryption key for development
 */
function generateDefaultEncryptionKey(): string {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('WALLET_ENCRYPTION_KEY must be explicitly set in production');
  }
  
  // Return a consistent 32-character development key
  return 'nepalipay-dev-wallet-key-123456789';
}

/**
 * Get network configuration based on environment
 */
export function getNetworkConfig(env: string) {
  switch (env) {
    case 'production':
      return {
        name: 'BSC Mainnet',
        chainId: 56,
        rpcUrl: 'https://bsc-dataseed1.binance.org/',
        explorerUrl: 'https://bscscan.com'
      };
    
    case 'staging':
      return {
        name: 'BSC Testnet',
        chainId: 97,
        rpcUrl: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
        explorerUrl: 'https://testnet.bscscan.com'
      };
    
    default:
      return {
        name: 'BSC Testnet',
        chainId: 97,
        rpcUrl: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
        explorerUrl: 'https://testnet.bscscan.com'
      };
  }
}

// Export singleton instance
export const environmentConfig = loadEnvironmentConfig();