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
**January 11, 2025 - CRITICAL SECURITY FIXES**
- ⚠️ REMOVED EXPOSED STRIPE API KEY: Deleted files containing live Stripe secret key
- 🔒 Fixed SQL injection vulnerability in pg-storage.ts using parameterized queries
- 🛡️ Fixed bracket notation object access vulnerability in auth.ts
- 📦 Updated Vite to version 5.4.15 to patch CVE-2025-30208
- 🔐 Removed hardcoded session secrets and demo passwords from codebase
- 🌍 Implemented environment variable-based authentication for production
- 🔑 Enhanced session secret management with production safeguards
- 🗃️ Secured demo data initialization with proper credential handling
- Fixed demo mode toggle functionality in blockchain context
- Enhanced error handling for contract connections
- Added demo mode activation button on loans page
- Removed duplicate code causing syntax errors
- Working on database connection and authentication fixes

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

## Current Issues to Resolve
1. Database connection failing with "endpoint is disabled" error
2. User authentication not working properly
3. Need to implement real-time API integrations
4. Remove all mock data and use live blockchain data

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