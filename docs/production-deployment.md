# Production Deployment Guide for NepaliPay

## Required Environment Variables

### Critical Variables (Application won't start without these)
```bash
# Database Configuration
DATABASE_URL=postgresql://username:password@host:port/database

# Basic Application
PORT=5000
NODE_ENV=production
```

### Blockchain Configuration (Required for full functionality)
```bash
# BSC Network Configuration
BSC_RPC_URL=https://bsc-dataseed1.binance.org/
NEPALIPAY_CONTRACT_ADDRESS=0x[your-contract-address]

# Wallet Management (Use one of these)
WALLET_PRIVATE_KEY=0x[your-private-key]
# OR (legacy support)
ADMIN_PRIVATE_KEY=0x[your-private-key]

# Wallet Security
WALLET_ENCRYPTION_KEY=[32-character-encryption-key]
```

### Security Configuration
```bash
# Session Management
SESSION_SECRET=[random-secure-string-for-session-encryption]
```

### Optional Service Integrations
```bash
# Stripe Payment Processing
STRIPE_SECRET_KEY=sk_live_[your-stripe-secret-key]

# Additional Services (if implemented)
SENDGRID_API_KEY=[your-sendgrid-key]
TWILIO_ACCOUNT_SID=[your-twilio-sid]
TWILIO_AUTH_TOKEN=[your-twilio-token]
```

## Environment Variable Details

### BSC_RPC_URL
- **Purpose**: Connects to Binance Smart Chain network
- **Production**: `https://bsc-dataseed1.binance.org/`
- **Testnet**: `https://data-seed-prebsc-1-s1.binance.org:8545/`
- **Required for**: Blockchain operations, balance checking, transaction processing

### WALLET_PRIVATE_KEY
- **Purpose**: Admin wallet for blockchain operations
- **Format**: Hexadecimal string starting with `0x`
- **Security**: Keep this secret and secure
- **Required for**: Minting tokens, processing transactions, user registration on blockchain

### NEPALIPAY_CONTRACT_ADDRESS
- **Purpose**: Address of deployed NepaliPay smart contract
- **Format**: Ethereum address starting with `0x`
- **Required for**: All smart contract interactions

### WALLET_ENCRYPTION_KEY
- **Purpose**: Encrypts user wallet private keys in database
- **Format**: 32-character string
- **Security**: Critical for user wallet security
- **Example**: `nepalipay-prod-encryption-key-32chars`

## Deployment Steps

### 1. Set Environment Variables
Configure all required environment variables in your deployment platform:

**Replit Deployments:**
1. Go to your Repl settings
2. Navigate to "Secrets" tab
3. Add each environment variable as a secret

**Other Platforms:**
- Heroku: Use `heroku config:set VAR_NAME=value`
- Docker: Use environment files or `-e` flags
- AWS/GCP: Configure through platform-specific environment variable management

### 2. Database Setup
Ensure PostgreSQL database is accessible and configured:
```bash
# Test database connection
npm run db:test

# Push schema changes
npm run db:push
```

### 3. Blockchain Configuration
1. Deploy smart contracts to BSC mainnet
2. Get contract addresses
3. Set up admin wallet with sufficient BNB for gas fees
4. Configure environment variables

### 4. Deploy Application
```bash
# Install dependencies
npm install

# Build application (if needed)
npm run build

# Start production server
npm start
```

## Graceful Degradation

The application is designed to handle missing environment variables gracefully:

### With Minimal Configuration (DATABASE_URL only)
- ✅ User authentication and basic functionality
- ✅ Transaction history (database-only)
- ❌ Blockchain operations
- ❌ Real wallet functionality
- ❌ Token purchases

### With Database + Blockchain Configuration
- ✅ Full wallet functionality
- ✅ Blockchain integration
- ✅ Token operations
- ❌ Payment processing

### With Full Configuration
- ✅ Complete functionality
- ✅ Payment processing
- ✅ All features enabled

## Health Checks

The application provides several endpoints for monitoring:

```bash
# Application health
GET /api/health

# Database connection
GET /api/v1/auth/check

# Blockchain connection
GET /api/v1/wallet/status
```

## Security Considerations

1. **Never commit secrets to version control**
2. **Use strong, unique SESSION_SECRET in production**
3. **Secure WALLET_PRIVATE_KEY with appropriate access controls**
4. **Regularly rotate WALLET_ENCRYPTION_KEY (requires data migration)**
5. **Monitor blockchain operations for suspicious activity**

## Troubleshooting

### "Internal Server Error"
- Check all required environment variables are set
- Verify DATABASE_URL connection
- Check application logs for specific errors

### Blockchain Connection Issues
- Verify BSC_RPC_URL is accessible
- Check NEPALIPAY_CONTRACT_ADDRESS is valid
- Ensure WALLET_PRIVATE_KEY has correct format
- Confirm admin wallet has sufficient BNB for gas

### Database Errors
- Verify DATABASE_URL format and credentials
- Ensure database server is accessible
- Check if database schema is up to date

## Production Monitoring

Monitor these key metrics:
- Database connection health
- Blockchain RPC response times
- Transaction success rates
- Error rates and types
- WebSocket connection stability

## Support

For deployment assistance:
- Check application logs first
- Verify all environment variables
- Test individual components (database, blockchain, etc.)
- Contact development team with specific error messages