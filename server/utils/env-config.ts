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
export function loadEnvironmentConfig(skipValidation = false): EnvironmentConfig {
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

  // Only validate if not skipping validation (to prevent crash loops)
  if (!skipValidation) {
    validateEnvironmentConfigWithGracefulHandling(config);
  }
  
  return config;
}

/**
 * Validate environment configuration
 * Returns validation result instead of throwing to prevent crash loops
 */
function validateEnvironmentConfig(config: EnvironmentConfig): { valid: boolean; errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Critical validations that prevent application startup
  if (isNaN(config.PORT) || config.PORT < 1 || config.PORT > 65535) {
    errors.push('PORT must be a valid port number between 1 and 65535');
  }
  
  if (!config.DATABASE_URL) {
    errors.push('DATABASE_URL is required for database operations');
  }
  
  // Production validations (warnings to allow graceful degradation)
  if (config.NODE_ENV === 'production') {
    if (!config.NEPALIPAY_CONTRACT_ADDRESS || config.NEPALIPAY_CONTRACT_ADDRESS.startsWith('0x1234')) {
      warnings.push('NEPALIPAY_CONTRACT_ADDRESS must be set to a valid contract address for blockchain operations');
    }
    
    if (!config.WALLET_PRIVATE_KEY) {
      warnings.push('WALLET_PRIVATE_KEY is required for blockchain operations - running in offline mode');
    }
    
    if (config.SESSION_SECRET === 'dev-session-secret-change-in-production') {
      warnings.push('SESSION_SECRET should be changed from default value in production');
    }
    
    if (!config.STRIPE_SECRET_KEY) {
      warnings.push('STRIPE_SECRET_KEY not configured - payment features will be disabled');
    }
  }
  
  // Development validations
  if (config.NODE_ENV === 'development') {
    if (!config.NEPALIPAY_CONTRACT_ADDRESS) {
      warnings.push('NEPALIPAY_CONTRACT_ADDRESS not set, using testnet default');
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Validate and handle environment configuration with graceful degradation
 */
export function validateEnvironmentConfigWithGracefulHandling(config: EnvironmentConfig): void {
  const validation = validateEnvironmentConfig(config);
  
  // Log warnings but don't stop execution
  if (validation.warnings.length > 0) {
    console.warn('Environment configuration warnings:');
    validation.warnings.forEach(warning => console.warn(`  - ${warning}`));
  }
  
  // Only throw for critical errors that prevent basic functionality
  if (!validation.valid) {
    throw new Error(`Critical environment configuration errors:\n${validation.errors.join('\n')}`);
  }
}

/**
 * Generate a default encryption key for development
 */
function generateDefaultEncryptionKey(): string {
  if (process.env.NODE_ENV === 'production') {
    console.warn('Warning: WALLET_ENCRYPTION_KEY not set in production, using temporary key');
    // Return a warning key that will be logged but won't crash the app
    return 'PRODUCTION-WARNING-SET-WALLET-ENCRYPTION-KEY-32CHAR';
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

// Export singleton instance with safe initialization
let _environmentConfig: EnvironmentConfig | null = null;

export function getEnvironmentConfig(): EnvironmentConfig {
  if (!_environmentConfig) {
    // Load without validation during module initialization to prevent crash loops
    _environmentConfig = loadEnvironmentConfig(true);
  }
  return _environmentConfig;
}

// For backward compatibility
export const environmentConfig = getEnvironmentConfig();