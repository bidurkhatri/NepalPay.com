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
- Blue-teal professional color theme (not purple)
- Glass morphic UI with Apple-inspired minimalist design
- Mobile-first responsive design with thumb-zone optimization
- Comprehensive accessibility compliance
- Purpose-driven animations with 200ms timing

## Recent Changes
**January 11, 2025 - ENHANCED UI/UX WITH BLUE-TEAL PROFESSIONAL THEME**
- 🎨 **New Color Theme**: Replaced purple with professional blue-teal color scheme (#1A73E8 primary, #009688 secondary)
- 📱 **Mobile-Optimized Navigation**: Thumb-zone bottom navigation with 44px minimum touch targets
- ✨ **Enhanced Components**: Glass morphism effects with proper backdrop blur limits
- 🔧 **Design System**: Centralized color tokens and semantic usage patterns
- ♿ **Accessibility**: WCAG-AA compliance with ARIA labels and keyboard navigation
- 📐 **Typography**: Standardized hierarchy with consistent font weights and spacing
- 🎯 **Microinteractions**: 200ms animations with purpose-driven motion design
- 📊 **Enhanced Tables**: Filtering, pagination, and improved transaction display
- 🧪 **Test Coverage**: Comprehensive UI test suite for quality assurance
- 🚀 **Production Ready**: All 20 design system requirements implemented

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

## Shipping-Ready Wallet System Features
1. **Complete Wallet Generation**: Ethereum-compatible addresses with AES-256-CBC encrypted private keys
2. **Smart Contract Integration**: Blockchain service with registration, balance queries, and transaction handling
3. **Production UI/UX**: QR codes, address copying, BscScan links, balance refresh, custodial indicators
4. **Comprehensive API**: All endpoints implemented with authentication, validation, and error handling
5. **Security Framework**: Encrypted storage, retry mechanisms, network monitoring, configuration validation
6. **Testing & Documentation**: Complete test suite, developer guide, API documentation, deployment instructions
7. **Real-time Features**: Live balance updates, blockchain event listeners, WebSocket integration
8. **Production Deployment**: Environment configuration, monitoring, error handling, and recovery procedures

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