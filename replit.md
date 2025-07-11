# NepaliPay - Blockchain Digital Wallet

## Project Overview
A culturally-sensitive blockchain-powered digital wallet application designed for the Nepali financial ecosystem. The platform enables users to manage NepaliPay tokens (NPT) which are stablecoins pegged to NPR (Nepalese Rupee), perform transfers, pay utilities, take loans, and track transaction history using blockchain technology.

## Current Status
- Frontend: React TypeScript with Tailwind CSS
- Backend: Express.js with PostgreSQL
- Blockchain: Smart contracts on Binance Smart Chain
- Authentication: Passport.js with sessions
- Payments: Stripe integration for token purchases

## User Preferences
- Use real-time live APIs - no mock data
- Production-ready implementation
- Glass morphic UI with Apple-inspired minimalist design
- Responsive across desktop and mobile

## Recent Changes
**January 11, 2025 - PRODUCTION-HARDENED WALLET SYSTEM COMPLETED**
- ✅ **Wallet Creation Flow**: Automatic Ethereum-compatible wallet generation during user registration
- 🔐 **Custodial Security**: Server-side wallet creation with encrypted private key storage
- 🔗 **Blockchain Integration**: Smart contract registration with NepaliPay contract using ethers.js
- 🌐 **Production Environment**: Environment-based configuration for testnet/mainnet deployment
- 📡 **API Integration**: Complete wallet REST API with balance updates and status endpoints
- 🎨 **Enhanced Theme**: New purple/magenta color scheme with improved visual design
- 🔒 **Security Hardened**: All 8 vulnerabilities resolved, production-ready validation
- 🏗️ **Architecture**: One-to-one user-wallet mapping with PostgreSQL storage integration
- 📊 **Real-time Updates**: Live balance synchronization from blockchain
- ⚡ **Performance**: Optimized middleware and error handling for production deployment

## Architecture
- **Frontend**: React with Wouter routing, TanStack Query for data fetching
- **Backend**: Express with Drizzle ORM and PostgreSQL
- **Blockchain**: ethers.js for smart contract interactions
- **Real-time**: WebSocket connections for live updates
- **Authentication**: Session-based auth with PostgreSQL store

## Security Implementation
- **🚨 API Key Security**: All hardcoded Stripe API keys removed from codebase
- **🔒 SQL Injection Protection**: Replaced raw SQL with Drizzle ORM parameterized queries
- **🛡️ Object Access Security**: Fixed bracket notation vulnerabilities with literal property access
- **📦 Dependency Security**: Updated Vite to patched version (CVE-2025-30208)
- **🔐 Session Security**: Environment variable-based session secrets
- **🗃️ Demo Account Security**: Configurable demo passwords via environment variables
- **🌍 Production Safeguards**: Prevents hardcoded credentials in production deployments
- **✅ Static Analysis Compliance**: All 8 detected vulnerabilities resolved

## Production Wallet System Features
1. **Automatic Wallet Creation**: Ethereum-compatible addresses generated during registration
2. **Secure Storage**: Private keys encrypted and stored server-side with AES-256 encryption
3. **Blockchain Registration**: Automatic user registration on NepaliPay smart contract
4. **Real-time Balances**: Live NPT and BNB balance synchronization from BSC network
5. **Production Configuration**: Environment-based setup for testnet/mainnet deployment
6. **Comprehensive API**: Full REST API with wallet status, validation, and balance updates
7. **Error Handling**: Production-grade error handling and logging for all wallet operations
8. **Security Validation**: Address format validation and transaction security measures

## Smart Contracts
- **NepaliPayToken**: NPT token contract with minting/burning
- **NepaliPay**: Main contract for payments, loans, collateral
- **FeeRelayer**: Gas fee management contract
- **Deployed on**: Binance Smart Chain mainnet

## Key Features
- Token management (buy, send, receive NPT)
- Collateral-based loans with real-time monitoring
- Stripe integration for fiat-to-crypto purchases
- Real-time transaction tracking
- Multi-currency price calculations
- Admin and superadmin portals