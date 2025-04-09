# NepaliPay: Comprehensive Technical Documentation

## 1. Overview

NepaliPay is a culturally-sensitive blockchain-powered digital wallet application designed specifically for the Nepali financial ecosystem. It offers intuitive financial management with deep cultural integration and technological innovation. The platform enables users to manage NepaliPay Tokens (NPT), which are stablecoins pegged to the Nepalese Rupee (NPR), facilitating secure and efficient financial transactions within Nepal's economy.

## 2. System Architecture

### 2.1 Technology Stack

- **Frontend**: React.js with TypeScript, styled using Tailwind CSS and enhanced with Framer Motion animations
- **Backend**: Express.js API server
- **Database**: PostgreSQL with Drizzle ORM
- **Blockchain Integration**: Solidity smart contracts on Binance Smart Chain (BSC)
- **Payment Processing**: Stripe integration for fiat-to-token purchases
- **Real-time Updates**: WebSocket (ws package) for live transaction and balance updates
- **Authentication**: Session-based with Passport.js
- **Form Handling**: React Hook Form with Zod validation

### 2.2 Deployment Structure

The application is structured with three separate portals, each catering to different user roles:

1. **User Portal** (`nepalipay.com/sections`) - For regular users to manage their wallets, transactions, and account
2. **Admin Portal** (`admin.nepalipay.com`) - For administrators to monitor and manage the platform
3. **Owner Portal** (`superadmin.nepalipay.com`) - For system owners/operators with highest level privileges

### 2.3 Data Flow Architecture

```
[User Interface] ⟷ [Express Backend API] ⟷ [PostgreSQL Database]
       ↕                    ↕
[Stripe Payment]      [BSC Blockchain]
                           ↕
                    [Smart Contracts]
```

The backend serves as the central hub connecting the user interface, payment processor, and blockchain network. It processes requests from the frontend, maintains data in the PostgreSQL database, and communicates with the blockchain when necessary.

## 3. Smart Contracts

NepaliPay relies on three primary smart contracts deployed on the Binance Smart Chain:

### 3.1 NepaliPayToken (NPT) Contract

**Address**: `0x69d34B25809b346702C21EB0E22EAD8C1de58D66`

The NPT token is an ERC20-compliant stablecoin pegged to the Nepalese Rupee (NPR). It implements:

- Standard ERC20 functionality (transfer, approval, etc.)
- Minting capability (restricted to authorized addresses)
- Burning capability
- Transfer pausing for emergency situations

### 3.2 NepaliPay Contract

**Address**: `0xe2d189f6696ee8b247ceae97fe3f1f2879054553`

This contract serves as the core business logic controller, facilitating:

- Token distribution
- User registration and identity management
- Transaction fee calculation and collection
- Interaction with other contracts in the ecosystem

### 3.3 FeeRelayer Contract

**Address**: `0x7ff2271749409f9137dac1e082962e21cc99aee6`

This specialized contract handles:

- Gas fee optimization
- Transaction batching
- Fee abstraction for improved user experience
- Relaying transactions to minimize user gas costs

## 4. User Interface Structure

The user interface follows a futuristic, glass-morphic style with an Apple-inspired minimalist approach. The design employs:

- Gradient accents for visual emphasis
- Translucent backgrounds with backdrop blur
- Clean typography with proper visual hierarchy
- Responsive design that adapts to all device sizes

### 4.1 Navigation Structure

#### 4.1.1 User Portal (`nepalipay.com/sections`)

- **Dashboard**: Overview of balances, recent transactions, and account status
- **Wallet**: Detailed view of NPT tokens and other cryptocurrency holdings
- **Send Money**: Interface for transferring funds to other users
- **Transactions**: Complete transaction history with filtering options
- **Borrow NPT**: Collateralized loan system using crypto assets
- **Rewards**: Referral program and other incentives
- **Ad Bazaar**: Marketplace for buying/selling ad space
- **Profile**: User information management
- **Settings**: Application preferences and security settings
- **Support**: Help center, FAQs, knowledge base, and contact forms

#### 4.1.2 Admin Portal (`admin.nepalipay.com`)

- **Dashboard**: Platform overview with key metrics
- **User Management**: Tools for managing user accounts
- **Transaction Monitoring**: System-wide transaction oversight
- **Financial Control**: Fee collection and treasury management
- **Blockchain Analytics**: Detailed blockchain statistics
- **Customer Support**: Issue management and resolution

#### 4.1.3 Owner Portal (`superadmin.nepalipay.com`)

- **System Configuration**: Core platform settings
- **Contract Management**: Smart contract interactions
- **Treasury Operations**: Fund allocation and management
- **Admin Management**: Control over administrator accounts
- **Emergency Controls**: System-wide pause capabilities

## 5. Core Features

### 5.1 User Management and Authentication

- **Registration**: User account creation with KYC information
- **Login**: Secure authentication with session management
- **Role-based Access**: Different capabilities for users, admins, and superadmins
- **Profile Management**: User information updates and verification

### 5.2 Wallet Functionality

- **Multiple Currency Support**: NPT tokens and select cryptocurrencies (BNB, ETH, BTC)
- **Balance Display**: Real-time balance information with visual representations
- **Transaction History**: Comprehensive record of all financial activities
- **Security Features**: PIN/password protection and transaction signing

### 5.3 NPT Token Purchase

Users can purchase NPT tokens through Stripe, which includes:

1. **Selection**: Choose NPT token amount to purchase
2. **Payment Processing**: Secure Stripe integration for credit/debit card payments
3. **Fee Structure**: Token cost + gas fees + 2% service fee
4. **Token Delivery**: Automatic transfer from treasury wallet after payment confirmation

### 5.4 Money Transfer System

- **User-to-User Transfers**: Send NPT tokens to other platform users
- **External Transfers**: Send to external blockchain wallets
- **Scheduled Payments**: Set up recurring or future-dated transfers
- **Transaction Confirmations**: Real-time updates on transaction status

### 5.5 Micro-loan System

The platform facilitates collateralized lending with the following features:

- **Collateral Assets**: Support for BNB, ETH, and BTC
- **Loan-to-Value Ratios**: Different ratios based on asset (BNB: 75%, ETH: 70%, BTC: 65-80%)
- **Loan Management**: Application, approval, repayment, and liquidation processes
- **Interest Calculation**: Dynamic rates based on market conditions and collateral

### 5.6 Utility Payments

- **Mobile Recharge**: Top up prepaid mobile balances
- **Bill Payments**: Electricity, water, and other utility bills
- **Merchant Payments**: Business payment processing
- **Receipt Generation**: Digital proof of payment

### 5.7 Ad Bazaar

A marketplace for advertising that allows:

- **Ad Creation**: Design and launch ad campaigns
- **Budget Management**: Set spending limits and track performance
- **Ad Placement**: Choose where ads appear within the ecosystem
- **Performance Analytics**: Track impressions, clicks, and conversions

### 5.8 Rewards Program

- **Referral System**: Earn rewards for bringing new users
- **Transaction Rewards**: Incentives for platform activity
- **Loyalty Benefits**: Tiered rewards based on usage
- **Special Promotions**: Limited-time bonus opportunities

## 6. Database Structure

The PostgreSQL database is organized with the following core tables:

### 6.1 Users Table

Stores user account information including:
- User ID, username, email, password (hashed)
- First name, last name, profile details
- KYC status, verification information
- Role (user, admin, superadmin)
- Wallet address (for blockchain interactions)
- Session information
- Created/updated timestamps

### 6.2 Wallets Table

Tracks user wallet information:
- Wallet ID and associated user ID
- NPT token balance
- Cryptocurrency balances (BNB, ETH, BTC)
- Last updated timestamp

### 6.3 Transactions Table

Records all financial transactions:
- Transaction ID, type, status
- Sender and receiver information
- Amount and currency
- Transaction hash (for blockchain transactions)
- Description/notes
- Stripe payment ID (for purchases)
- Timestamp information

### 6.4 Activities Table

Logs user activities for security and auditing:
- Activity ID and user ID
- Action type and description
- IP address and user agent information
- Timestamp

### 6.5 Collaterals Table

Manages loan collateral information:
- Collateral ID and user ID
- Asset type, amount, and value
- Status (active, locked, released)
- Timestamp information

### 6.6 Loans Table

Tracks loan information:
- Loan ID, user ID, and associated collateral ID
- Amount, interest rate, and duration
- Start and end dates
- Status (pending, active, repaid, defaulted)

### 6.7 Ads Table

Stores advertising campaign information:
- Ad ID and user ID
- Title, description, and image URL
- Budget, spent amount, performance metrics
- Duration and status information

## 7. API Endpoints

The backend API follows RESTful principles with the following key endpoints:

### 7.1 Authentication Endpoints

- `POST /api/register`: Create new user account
- `POST /api/login`: Authenticate user and create session
- `POST /api/logout`: End user session
- `GET /api/user`: Get current user information

### 7.2 Wallet Endpoints

- `GET /api/wallet`: Get user wallet information
- `GET /api/wallet/transactions`: Get wallet transaction history
- `POST /api/wallet/refresh`: Force refresh of blockchain balances

### 7.3 Transaction Endpoints

- `POST /api/transactions/send`: Transfer tokens to another user
- `GET /api/transactions`: Get user transaction history
- `GET /api/transactions/:id`: Get specific transaction details
- `POST /api/transactions/external`: Send tokens to external wallet

### 7.4 Token Purchase Endpoints

- `POST /api/create-payment-intent`: Initialize Stripe payment
- `POST /api/verify-payment`: Confirm payment and trigger token transfer
- `POST /api/webhook`: Stripe webhook for payment event handling

### 7.5 Loan Endpoints

- `GET /api/loans`: Get user loans
- `POST /api/loans`: Create loan request
- `POST /api/loans/:id/repay`: Make loan repayment
- `GET /api/collaterals`: Get user collaterals
- `POST /api/collaterals`: Create new collateral

### 7.6 Admin Endpoints

- `GET /api/admin/users`: List all users (admin only)
- `GET /api/admin/transactions`: View all transactions (admin only)
- `POST /api/admin/approve-loan`: Process loan application (admin only)
- `POST /api/admin/settings`: Update system settings (admin only)

### 7.7 SuperAdmin Endpoints

- `POST /api/superadmin/mint`: Mint new NPT tokens (superadmin only)
- `POST /api/superadmin/system`: Control system-wide settings (superadmin only)

## 8. Real-time Data Flow

NepaliPay implements WebSocket connections for real-time updates:

### 8.1 Connection Flow

1. **Initialization**: WebSocket connection established when user logs in
2. **Authentication**: User authenticates WebSocket connection
3. **Subscription**: Backend associates connection with user ID
4. **Data Flow**: Server pushes updates as they occur

### 8.2 Update Types

- **Wallet Updates**: Balance changes in real-time
- **Transaction Updates**: New transactions and status changes
- **Collateral Updates**: Status changes for collaterals
- **Loan Updates**: Loan application status and repayment information
- **Activity Updates**: Security and important account activities

## 9. Payment Processing

### 9.1 Stripe Integration

The application uses Stripe for fiat currency payments:

1. **Frontend**: Creates payment intent with token amount
2. **Backend**: Validates request and initializes Stripe payment
3. **User**: Completes payment through Stripe interface
4. **Webhook**: Stripe notifies application of successful payment
5. **Token Transfer**: System transfers NPT tokens to user's wallet

### 9.2 Fee Structure

Total payment includes:
- **Token Cost**: Base NPT token value
- **Gas Fees**: Blockchain transaction costs (calculated in USD)
- **Service Fee**: 2% transaction fee for platform operation

### 9.3 Transfer Security

After payment, tokens are transferred using the "Transfer From Treasury" method:
1. Admin wallet holds pre-minted NPT tokens
2. System triggers the transfer from treasury to user wallet
3. Transaction is recorded on blockchain with full transparency

## 10. Collateral and Loan System

### 10.1 Supported Collateral Assets

- **BNB**: 75% loan-to-value ratio
- **ETH**: 70% loan-to-value ratio
- **BTC**: 65-80% loan-to-value ratio (varies based on market conditions)

### 10.2 Loan Process

1. **Collateral Deposit**: User locks cryptocurrency as collateral
2. **Loan Request**: Specifies desired NPT amount within LTV limits
3. **Approval Process**: System validates collateral value and approves loan
4. **Token Issuance**: NPT tokens transferred to user wallet
5. **Repayment**: User repays loan amount plus interest
6. **Collateral Release**: Original collateral returned upon full repayment

### 10.3 Liquidation Process

If collateral value falls below threshold:
1. **Warning Notification**: User alerted of potential liquidation
2. **Grace Period**: Time allowed to add collateral or repay portion
3. **Liquidation**: System sells collateral to recover loan if necessary

## 11. Security Measures

### 11.1 Authentication Security

- Password hashing using scrypt with random salt
- Session management with secure cookies
- Rate limiting for login attempts
- Two-factor authentication for sensitive operations

### 11.2 Transaction Security

- Blockchain-level cryptographic security
- Transaction signing requirements
- Confirmation steps for large transfers
- Fraud detection algorithms

### 11.3 Smart Contract Security

- Audited contract code
- Emergency pause functionality
- Role-based access control
- Secure update mechanisms

### 11.4 Data Security

- Encrypted sensitive information
- Regular database backups
- Input validation and sanitization
- Protection against common web vulnerabilities

## 12. User Experience Design

### 12.1 Design Philosophy

- **Futuristic**: Modern glass-morphic style
- **Cultural Sensitivity**: Elements that resonate with Nepali users
- **Minimalist**: Clean, uncluttered interfaces inspired by Apple design
- **Intuitive**: Simple navigation and clear user flows

### 12.2 Responsive Design

- **Mobile-first**: Optimized for smartphone users
- **Tablet-friendly**: Adapted layouts for medium screens
- **Desktop experience**: Enhanced interfaces for larger displays
- **Consistent experience**: Core functionality preserved across all devices

### 12.3 Visual Elements

- **Color scheme**: Blue-based palette with regional cultural significance
- **Typography**: Clean, legible fonts with proper hierarchy
- **Animations**: Subtle motion design enhancing user experience
- **Iconography**: Consistent, intuitive icons throughout the platform

## 13. Support System

### 13.1 Help Center

- **FAQ**: Comprehensive frequently asked questions
- **Knowledge Base**: Detailed articles on platform features
- **Video Tutorials**: Visual guides for key functionality
- **Glossary**: Explanation of technical terms

### 13.2 Support Channels

- **Live Chat**: Real-time assistance for users
- **Ticket System**: Structured support request handling
- **Email Support**: Alternative communication channel
- **Contact Form**: Web-based support request submission

## 14. Blockchain Integration

### 14.1 Smart Contract Interaction

- **Web3.js/Ethers.js**: JavaScript libraries for blockchain interaction
- **Transaction Building**: Creation and signing of blockchain transactions
- **Event Listening**: Monitoring blockchain for relevant events
- **Gas Optimization**: Strategies to minimize transaction costs

### 14.2 Wallet Connectivity

- **User Wallets**: Support for external wallet connections
- **Treasury Wallet**: System-controlled wallet for token distribution
- **Admin Wallets**: Privileged wallets for management functions
- **Multi-signature**: Enhanced security for critical operations

## 15. Administration Tools

### 15.1 User Management

- **User Search**: Find accounts by various criteria
- **Account Actions**: Freeze, unfreeze, or limit accounts
- **KYC Verification**: Review and approve identity verification
- **Customer Support**: Tools for resolving user issues

### 15.2 Financial Management

- **Treasury Monitoring**: Track system-wide token balances
- **Fee Collection**: Track and manage service fees
- **Transaction Records**: Complete audit trail of all activities
- **Financial Reports**: Generate insights from platform data

### 15.3 System Configuration

- **Feature Toggles**: Enable/disable specific functionality
- **Parameter Settings**: Adjust system variables
- **Security Controls**: Manage platform-wide security settings
- **Emergency Tools**: Critical situation management features

## 16. Development and Deployment

### 16.1 Development Workflow

- **Version Control**: Git-based source code management
- **Environment Separation**: Development, staging, and production
- **Testing Framework**: Automated tests for critical components
- **CI/CD Pipeline**: Continuous integration and deployment

### 16.2 Monitoring and Maintenance

- **Error Tracking**: Capture and log system errors
- **Performance Monitoring**: Track application metrics
- **User Analytics**: Understand user behavior
- **Security Auditing**: Regular security assessments

## 17. Compliance and Regulation

### 17.1 KYC/AML Compliance

- **Identity Verification**: User identification procedures
- **Transaction Monitoring**: Detection of suspicious activities
- **Reporting Capabilities**: Tools for regulatory reporting
- **Data Retention**: Compliance with record-keeping requirements

### 17.2 Regulatory Considerations

- **Nepali Financial Regulations**: Compliance with local laws
- **Cryptocurrency Regulations**: Adherence to blockchain-related rules
- **Data Protection**: Privacy and data security measures
- **Consumer Protection**: Fair treatment and transaction transparency

## 18. Future Development Roadmap

### 18.1 Planned Features

- **Enhanced DeFi Integration**: Additional decentralized finance capabilities
- **Expanded Cryptocurrency Support**: More token options
- **Merchant Solutions**: Expanded business payment tools
- **Advanced Analytics**: More detailed financial insights
- **Mobile Application**: Dedicated native mobile apps

### 18.2 Scaling Strategy

- **Technical Scaling**: Infrastructure improvements for higher volume
- **Market Expansion**: Potential regional growth beyond Nepal
- **Feature Evolution**: Continuous improvement of existing functionality
- **Partnership Development**: Integration with complementary services

## 19. Conclusion

NepaliPay represents a sophisticated fusion of blockchain technology and traditional financial services, tailored specifically for the Nepali market. Its comprehensive feature set, robust security measures, and culturally sensitive design make it a powerful tool for digital financial management in Nepal's evolving economy.

The system's architecture balances the benefits of blockchain technology with practical user experience considerations, creating a platform that is both technologically advanced and accessible to users with varying levels of technical expertise.

As digital finance continues to evolve in Nepal, NepaliPay is positioned to play a significant role in the country's financial ecosystem, providing secure, efficient, and user-friendly financial services powered by blockchain technology.