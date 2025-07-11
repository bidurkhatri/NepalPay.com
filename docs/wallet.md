# NepaliPay Wallet System Documentation

## Overview

The NepaliPay wallet system provides secure, custodial wallet management with automatic Ethereum-compatible address generation and smart contract integration on the Binance Smart Chain (BSC).

## Architecture

### Custodial vs Non-Custodial

**Current Implementation: Custodial**
- Private keys are encrypted and stored server-side using AES-256-CBC encryption
- Users receive wallet addresses but don't have direct access to private keys
- All transactions are handled through NepaliPay backend services
- Provides security and ease of use for users unfamiliar with blockchain technology

**Future Non-Custodial Option:**
- Users would receive mnemonic phrases during registration
- Private keys never stored on servers
- Users maintain full control over their wallets
- Requires user education on seed phrase security

## Wallet Creation Flow

### 1. User Registration
```typescript
// During user registration
POST /api/register
{
  "username": "user123",
  "email": "user@example.com",
  "password": "securepassword"
}

// Response includes wallet information
{
  "user": { ... },
  "wallet": {
    "address": "0x...",
    "nptBalance": "0",
    "bnbBalance": "0"
  }
}
```

### 2. Wallet Generation Process
1. **Address Generation**: Using `ethers.Wallet.createRandom()`
2. **Private Key Encryption**: AES-256-CBC with environment secret
3. **Database Storage**: Wallet record created with encrypted keys
4. **Blockchain Registration**: User registered on NepaliPay smart contract
5. **Balance Initialization**: Initial balances set to zero

### 3. Existing User Wallet Creation
```typescript
// For users without wallets
POST /api/v1/wallet/create
// Automatically creates wallet address for existing users
```

## Smart Contract Integration

### Registration Process
```typescript
// Blockchain service registers user on-chain
await NepaliPayContract.registerUser(userId, walletAddress);
```

### Contract Methods
- `registerUser(userId, walletAddress)`: Register user on blockchain
- `isRegistered(address)`: Check registration status
- `balanceOf(address)`: Get token balance
- `transfer(to, amount)`: Transfer tokens
- `mint(to, amount)`: Mint new tokens (admin only)
- `burn(from, amount)`: Burn tokens (admin only)

## API Endpoints

### Wallet Management

#### Get Wallet Information
```
GET /api/v1/wallet
Authorization: Session cookie required

Response:
{
  "wallet": {
    "id": 1,
    "userId": 1,
    "address": "0x...",
    "nptBalance": "100.5",
    "bnbBalance": "0.1",
    "lastUpdated": "2025-01-11T12:00:00Z"
  },
  "networkStatus": {
    "connected": true,
    "blockNumber": 53651287,
    "chainId": 56
  }
}
```

#### Create Wallet (Existing Users)
```
POST /api/v1/wallet/create
Authorization: Session cookie required

Response:
{
  "success": true,
  "message": "Wallet created successfully",
  "wallet": { ... }
}
```

#### Refresh Balances
```
POST /api/v1/wallet/refresh
Authorization: Session cookie required

Response:
{
  "success": true,
  "wallet": { ... }
}
```

#### Validate Address
```
POST /api/v1/wallet/validate-address
{
  "address": "0x..."
}

Response:
{
  "valid": true,
  "address": "0x..."
}
```

#### Get Network Status
```
GET /api/v1/wallet/status
Authorization: Session cookie required

Response:
{
  "connected": true,
  "blockNumber": 53651287,
  "chainId": 56
}
```

## Security Features

### Private Key Management
- **Encryption**: AES-256-CBC encryption using environment-based secret
- **Storage**: Encrypted keys stored in secure database fields
- **Access**: Private keys never exposed through API responses
- **Recovery**: Admin-only access for wallet recovery operations

### Environment Configuration
```bash
# Required environment variables
BSC_RPC_URL=https://bsc-dataseed1.binance.org/
NEPALIPAY_CONTRACT_ADDRESS=0x...
ADMIN_PRIVATE_KEY=0x...  # For blockchain transactions
WALLET_ENCRYPTION_SECRET=your-secret-key
```

### Database Security
- Unique constraints on wallet addresses
- Foreign key relationships between users and wallets
- One-to-one user-wallet mapping enforced

## Frontend Integration

### Wallet Display Components
- **Balance Display**: Real-time NPT and BNB balances
- **Address Management**: Copy, QR code generation, BscScan links
- **Transaction History**: Real-time transaction updates
- **Security Indicators**: Custodial wallet status display

### QR Code Integration
```tsx
import QRCode from 'qrcode.react';

<QRCode 
  value={wallet.address} 
  size={200}
  level="H"
  includeMargin={true}
/>
```

## Error Handling

### Blockchain Connection Issues
- Automatic retry with exponential backoff
- Graceful degradation when blockchain is unavailable
- Clear user messaging for connection status

### Transaction Failures
- Retry queue for failed blockchain operations
- Comprehensive error logging
- User-friendly error messages

## Testing Strategy

### Unit Tests
```bash
# Backend wallet tests
npm run test:wallet

# Frontend component tests  
npm run test:frontend
```

### Test Coverage
- Wallet creation and validation
- Balance updates and synchronization
- Smart contract interaction simulation
- Error handling scenarios

## Deployment Considerations

### Environment Setup
1. Configure BSC RPC endpoints
2. Deploy smart contracts to target network
3. Set up environment variables
4. Initialize database schema
5. Verify blockchain connectivity

### Production Checklist
- [ ] Smart contracts deployed and verified
- [ ] Environment variables configured
- [ ] Database constraints enforced
- [ ] Backup and recovery procedures tested
- [ ] Monitoring and alerting configured
- [ ] User education materials prepared

## Future Enhancements

### Multi-Wallet Support
- Allow users to link multiple external wallets
- Tag primary wallet for default operations
- Support for hardware wallet integration

### Non-Custodial Option
- Implement mnemonic phrase generation
- Add seed phrase backup and recovery flows
- Provide user education on wallet security

### Advanced Features
- Multi-signature wallet support
- Time-locked transactions
- Spending limits and controls
- Integration with external DeFi protocols

## Support and Recovery

### Wallet Recovery Process
1. User verification through support channels
2. Admin access to encrypted private keys
3. New wallet generation if necessary
4. Balance migration and transaction history preservation

### User Support
- Knowledge base articles on wallet security
- Step-by-step guides for common operations
- Contact information for technical support
- FAQ covering common wallet issues

---

For technical support or questions about wallet implementation, contact the development team or refer to the API documentation.