# NepaliPay: Comprehensive Technical Documentation

## 1. Overview

NepaliPay is a culturally-sensitive blockchain-powered digital wallet application designed specifically for the Nepali financial ecosystem. It offers intuitive financial management with deep cultural integration and technological innovation. The platform enables users to manage NepaliPay Tokens (NPT), which are stablecoins pegged to the Nepalese Rupee (NPR), facilitating secure and efficient financial transactions within Nepal's economy.

### 1.1 Project Vision and Mission

**Vision**: To revolutionize Nepal's financial landscape by creating an inclusive, accessible digital financial platform that bridges traditional banking gaps while preserving cultural identity.

**Mission**: To provide every Nepali citizen with access to secure, low-cost, and efficient financial services through blockchain technology, enabling economic empowerment regardless of geographical location or traditional banking access.

### 1.2 Target Market

NepaliPay targets several key demographic segments:

- **Urban Professionals**: Tech-savvy individuals seeking modern financial solutions
- **Rural Communities**: Populations with limited access to traditional banking infrastructure
- **Nepali Diaspora**: Expatriates sending remittances to family in Nepal
- **Small Business Owners**: Merchants requiring digital payment solutions
- **Students**: Young users entering the financial ecosystem

### 1.3 Unique Value Propositions

1. **Cultural Integration**: Deeply embedded Nepali cultural elements in design and functionality
2. **Blockchain Security**: Immutable transaction records with cryptographic protection
3. **Financial Inclusion**: Services accessible to unbanked and underbanked populations
4. **Low Transaction Costs**: Significant fee reduction compared to traditional remittance services
5. **Multicurrency Support**: Management of both NPT stablecoins and popular cryptocurrencies
6. **Micropayment Capability**: Efficient processing of even very small transaction amounts
7. **Offline Functionality**: Limited features available without constant internet connectivity

### 1.4 Regulatory Compliance

NepaliPay operates in compliance with:

- Nepal Rastra Bank (NRB) digital payment guidelines
- Foreign Exchange Regulation Act (FERA)
- Anti-Money Laundering (AML) and Counter-Terrorist Financing (CTF) regulations
- Payment and Settlement Act
- Electronic Transaction Act

The platform implements robust KYC procedures, transaction monitoring, and reporting mechanisms to ensure full regulatory compliance while maintaining user privacy.

## 2. System Architecture

### 2.1 Technology Stack

#### 2.1.1 Frontend Technologies

- **Core Framework**: React.js v18.2.0 with TypeScript 5.0.2
  - Component-based architecture with functional components and hooks
  - Strong typing with TypeScript for enhanced code quality and developer experience
  - Optimized rendering with React's virtual DOM

- **Styling & Design**:
  - **Tailwind CSS v3.3.3**: Utility-first CSS framework for rapid UI development
  - **Framer Motion v10.16.1**: Production-ready animation library for React
  - **ShadCN/UI Components**: Customized component library built on Radix UI primitives
  - **Custom Glass-morphic Design System**: Tailored design system with Nepali cultural elements
  - **Theme.json Configuration**: Centralized theming with professional color schemes

- **State Management**:
  - **React Context API**: For application-wide state management
  - **TanStack Query v5.8.4**: For data fetching, caching, and synchronization
  - **Zustand**: For specific complex state requirements

- **Routing & Navigation**:
  - **Wouter**: Lightweight routing solution for React applications
  - **Custom Protected Route Component**: Role-based route access control

- **Form Management**:
  - **React Hook Form v7.47.0**: Performance-focused form library
  - **Zod v3.22.4**: TypeScript-first schema validation
  - **@hookform/resolvers**: Integration between React Hook Form and Zod

- **Data Visualization**:
  - **Recharts v2.9.2**: Composable charting library for React
  - **D3.js**: For advanced data visualizations

#### 2.1.2 Backend Technologies

- **Server Framework**:
  - **Express.js v4.18.2**: Minimalist web framework for Node.js
  - **TypeScript**: For type-safe server-side code
  - **Node.js v18.x**: JavaScript runtime for server-side execution

- **Database Layer**:
  - **PostgreSQL v15.x**: Advanced open-source relational database
  - **Drizzle ORM v0.28.6**: Modern TypeScript ORM with type safety
  - **Connection Pooling**: For optimized database connection management
  - **Migrations**: Schema version control with automatic upgrades

- **Authentication & Security**:
  - **Passport.js v0.6.0**: Authentication middleware for Node.js
  - **Express-session v1.17.3**: Session management with Redis store
  - **Crypto Module**: For cryptographic operations
  - **CORS**: Cross-Origin Resource Sharing protection
  - **Helmet**: HTTP header security

- **Real-time Communication**:
  - **WebSocket (ws v8.14.2)**: For bidirectional real-time communication
  - **Custom Event System**: For internal event propagation

- **Payment Processing**:
  - **Stripe v13.5.0**: For credit card and fiat currency processing
  - **Webhook Handlers**: For asynchronous payment event processing

#### 2.1.3 Blockchain Integration

- **Smart Contract Development**:
  - **Solidity v0.8.25**: Language for smart contract development
  - **OpenZeppelin Contracts**: Secure, reusable contract components
  - **Hardhat**: Development environment for compilation, testing, deployment

- **Blockchain Interaction**:
  - **Ethers.js v6.8.0**: Complete Ethereum library and wallet implementation
  - **Web3.js**: Alternative library for blockchain interaction
  - **Viem**: Modern Ethereum library

- **Network**:
  - **Binance Smart Chain (BSC)**: Primary deployment network
  - **BSC Testnet**: For testing and development

### 2.2 System Architecture Layers

#### 2.2.1 Presentation Layer (Frontend)

The presentation layer follows a component-based architecture:

- **Atomic Design Methodology**:
  - **Atoms**: Basic UI components (buttons, inputs, icons)
  - **Molecules**: Combinations of atoms (form fields, cards)
  - **Organisms**: Complex UI sections (sidebars, navigation)
  - **Templates**: Page layouts without specific content
  - **Pages**: Complete views with implemented business logic

- **State Management Pattern**:
  - **Global State**: Authentication, user data, application settings
  - **Feature State**: State specific to feature areas
  - **Local Component State**: UI-specific state within components

- **Rendering Optimizations**:
  - **Code Splitting**: Dynamic imports for optimized loading
  - **React.memo**: For preventing unnecessary re-renders
  - **Virtualization**: For handling large lists and tables
  - **Image Optimization**: Responsive images with WebP format

#### 2.2.2 Application Layer (Backend)

The backend follows a modular architecture:

- **API Structure**:
  - **Controllers**: Handle HTTP requests and responses
  - **Services**: Contain business logic
  - **Data Access Layer**: Database operations abstraction
  - **Middleware**: Request processing pipeline (authentication, validation, etc.)
  - **Utilities**: Helper functions and shared code

- **Asynchronous Processing**:
  - **Job Queue**: For handling background tasks
  - **Event-driven Architecture**: For decoupled communication
  - **Caching Layer**: For performance optimization

- **Security Layer**:
  - **Input Validation**: Request body validation with Zod
  - **Output Sanitization**: Response data sanitization
  - **Rate Limiting**: Protection against brute force and DoS attacks
  - **API Key Management**: For external service access

#### 2.2.3 Data Layer

- **Database Design**:
  - **Normalized Schema**: To minimize redundancy
  - **Indexing Strategy**: For optimized query performance
  - **Transactions**: For data integrity
  - **Audit Logs**: For tracking changes

- **Data Caching**:
  - **In-Memory Cache**: For frequently accessed data
  - **Query Result Caching**: For expensive database operations

### 2.3 Deployment Architecture

The application is structured with three separate portals, each catering to different user roles:

#### 2.3.1 User Portal (`nepalipay.com/sections`)

- **Target Users**: Regular end users
- **Functionality**: Wallet management, transactions, account settings
- **Access Control**: Standard user authentication
- **Localization**: Multi-language support (Nepali, English)
- **Design Theme**: Blue-based, culturally-sensitive interface

#### 2.3.2 Admin Portal (`admin.nepalipay.com`)

- **Target Users**: System administrators
- **Functionality**: User management, transaction monitoring, support functions
- **Access Control**: Role-based with MFA requirement
- **Design Theme**: Blue administrative theme with advanced data visualization
- **Audit Logging**: Comprehensive tracking of all administrative actions

#### 2.3.3 Owner Portal (`superadmin.nepalipay.com`)

- **Target Users**: Platform owners and highest-level operators
- **Functionality**: System configuration, smart contract management, treasury operations
- **Access Control**: Multisignature authentication with hardware key support
- **Design Theme**: Teal superadmin theme with enhanced security indicators
- **Emergency Controls**: System-wide override capabilities

#### 2.3.4 Infrastructure Deployment

- **Web Servers**: Nginx for static content and reverse proxy
- **Application Servers**: Node.js instances behind load balancer
- **Database**: PostgreSQL with replication for high availability
- **Caching Layer**: Redis for session and data caching
- **CI/CD Pipeline**: Automated testing and deployment
- **Monitoring**: Prometheus and Grafana for system monitoring
- **Logging**: Centralized ELK stack (Elasticsearch, Logstash, Kibana)

### 2.4 Data Flow Architecture

```
╔══════════════════╗     ╔══════════════════╗     ╔══════════════════╗
║  React Frontend  ║◄───►║  Express Backend ║◄───►║  PostgreSQL DB   ║
╚═════════╦════════╝     ╚═══════╦══════════╝     ╚══════════════════╝
          ▼                      ▼
╔══════════════════╗     ╔══════════════════╗
║  Stripe Payment  ║◄───►║  BSC Blockchain  ║
╚══════════════════╝     ╚═══════╦══════════╝
                                 ▼
                         ╔══════════════════╗
                         ║  Smart Contracts ║
                         ╚══════════════════╝
```

#### 2.4.1 Primary Data Flows

1. **User Authentication Flow**:
   ```
   Client → Backend (Authentication Request)
   Backend → Database (Verify Credentials)
   Database → Backend (User Data)
   Backend → Client (Session Token + Initial Data)
   ```

2. **Transaction Flow**:
   ```
   Client → Backend (Transaction Request)
   Backend → Database (Record Pending Transaction)
   Backend → Blockchain (Submit Transaction)
   Blockchain → Backend (Transaction Confirmation)
   Backend → Database (Update Transaction Status)
   Backend → Client (WebSocket Notification)
   ```

3. **Payment Processing Flow**:
   ```
   Client → Backend (Payment Intent Request)
   Backend → Stripe (Create Payment Intent)
   Stripe → Client (Payment Form)
   Client → Stripe (Payment Submission)
   Stripe → Backend (Webhook Notification)
   Backend → Blockchain (Token Transfer)
   Backend → Database (Record Transaction)
   Backend → Client (WebSocket Notification)
   ```

4. **Real-time Update Flow**:
   ```
   Client → Backend (WebSocket Connection)
   Backend → Client (Authentication Challenge)
   Client → Backend (Authentication Response)
   Backend → Database (Subscribe to User Events)
   Database/Blockchain → Backend (Event Notification)
   Backend → Client (Push Update)
   ```

The backend serves as the central hub connecting all system components, maintaining a clean separation between the presentation layer, business logic, and data persistence. It acts as the authoritative source for all data, ensuring consistency between the blockchain state and the application database.

## 3. Smart Contracts

NepaliPay relies on three primary smart contracts deployed on the Binance Smart Chain. These contracts form the blockchain foundation of the platform, enabling secure token operations, identity management, and gas optimization.

### 3.1 NepaliPayToken (NPT) Contract

**Address**: `0x69d34B25809b346702C21EB0E22EAD8C1de58D66`
**Network**: Binance Smart Chain (BSC) Mainnet
**Verification Status**: Verified on BscScan
**Contract Type**: ERC20 Token with Extensions
**Solidity Version**: 0.8.25
**License**: MIT

#### 3.1.1 Contract Overview

The NPT token is an ERC20-compliant stablecoin pegged to the Nepalese Rupee (NPR) at a 1:1 ratio. This token serves as the primary medium of exchange within the NepaliPay ecosystem, enabling users to transact in a digital representation of their national currency.

#### 3.1.2 Key Contract Features

- **Standard ERC20 Implementation**:
  - `transfer(address to, uint256 amount)`: Send tokens from sender to recipient
  - `approve(address spender, uint256 amount)`: Allow spender to withdraw from your account
  - `transferFrom(address from, address to, uint256 amount)`: Transfer tokens from one address to another
  - `balanceOf(address account)`: Check token balance of an address
  - `allowance(address owner, address spender)`: Check authorized spend amount

- **Extended Token Functionality**:
  - `mint(address to, uint256 amount)`: Create new tokens (restricted to authorized minters)
  - `burn(uint256 amount)`: Destroy tokens held by the caller
  - `burnFrom(address account, uint256 amount)`: Destroy tokens from another account (with allowance)
  - `pause()`: Suspend all token transfers (restricted to pauser role)
  - `unpause()`: Resume token transfers (restricted to pauser role)

- **Access Control System**:
  - Role-based permission management (ADMIN, MINTER, PAUSER roles)
  - `grantRole(bytes32 role, address account)`: Assign role to account
  - `revokeRole(bytes32 role, address account)`: Remove role from account
  - `renounceRole(bytes32 role, address account)`: Account gives up role
  - `hasRole(bytes32 role, address account)`: Check if account has role

#### 3.1.3 Contract Code Excerpt (Key Functions)

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract NepaliPayToken is ERC20, ERC20Burnable, ERC20Pausable, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    constructor() ERC20("NepaliPay Token", "NPT") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);
    }

    function mint(address to, uint256 amount) public onlyRole(MINTER_ROLE) {
        _mint(to, amount);
    }

    function pause() public onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    // Override required by Solidity
    function _beforeTokenTransfer(address from, address to, uint256 amount)
        internal
        override(ERC20, ERC20Pausable)
    {
        super._beforeTokenTransfer(from, to, amount);
    }
}
```

#### 3.1.4 Security Measures

- **Minting Control**: Only authorized minters can create new tokens, preventing inflation
- **Pause Mechanism**: Emergency pause capability to freeze all transfers in case of security breach
- **Role Separation**: Different roles for administration, minting, and pausing
- **Fixed Decimals**: 18 decimal places for compatibility with most DeFi protocols
- **Audit Status**: Audited by [Audit Firm] on [Date]

#### 3.1.5 Integration Points

- **Backend Integration**: Via ethers.js for minting, burning, and transfers
- **Frontend Display**: Balance shown in user wallet interface
- **Blockchain Explorer**: Transactions viewable on BscScan

### 3.2 NepaliPay Contract

**Address**: `0xe2d189f6696ee8b247ceae97fe3f1f2879054553`
**Network**: Binance Smart Chain (BSC) Mainnet
**Verification Status**: Verified on BscScan
**Contract Type**: Business Logic Controller
**Solidity Version**: 0.8.25
**License**: MIT

#### 3.2.1 Contract Overview

This contract serves as the core business logic controller for the NepaliPay ecosystem. It manages user identity, coordinates interactions between different contracts, calculates and collects transaction fees, and handles the distribution of NPT tokens.

#### 3.2.2 Key Contract Features

- **User Management**:
  - `registerUser(string memory userId, address userAddress)`: Associate blockchain address with user identity
  - `updateUserAddress(string memory userId, address newAddress)`: Change user's blockchain address
  - `getUserAddress(string memory userId)`: Retrieve blockchain address for user
  - `isRegistered(address userAddress)`: Check if address is registered

- **Token Distribution**:
  - `distributeTokens(address recipient, uint256 amount)`: Send tokens to users
  - `bulkDistribute(address[] memory recipients, uint256[] memory amounts)`: Batch token distribution
  - `withdrawTokens(uint256 amount)`: Extract tokens from contract (admin only)

- **Fee Management**:
  - `calculateFee(uint256 amount)`: Compute transaction fee based on amount
  - `getFeeBalance()`: Check accumulated fees in contract
  - `withdrawFees(address recipient)`: Transfer collected fees (admin only)

- **System Control**:
  - `setFeePercentage(uint256 newPercentage)`: Update fee calculation (admin only)
  - `setTokenAddress(address newTokenAddress)`: Update NPT token contract address
  - `emergencyPause()`: Pause all contract operations
  - `resumeOperations()`: Resume operations after pause

#### 3.2.3 Contract Code Excerpt (Key Functions)

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "./NepaliPayToken.sol";

contract NepaliPay is Ownable, Pausable {
    NepaliPayToken public token;
    
    // Fee percentage in basis points (1/100 of a percent)
    // 100 = 1%
    uint256 public feePercentage = 200; // 2% default
    
    // User management
    mapping(string => address) private userAddresses;
    mapping(address => string) private addressToUserId;
    
    // Events
    event UserRegistered(string userId, address userAddress);
    event UserAddressUpdated(string userId, address oldAddress, address newAddress);
    event TokensDistributed(address recipient, uint256 amount);
    event FeeCollected(address from, uint256 amount);
    
    constructor(address tokenAddress) Ownable(msg.sender) {
        token = NepaliPayToken(tokenAddress);
    }
    
    function registerUser(string memory userId, address userAddress) public onlyOwner {
        require(bytes(userId).length > 0, "User ID cannot be empty");
        require(userAddress != address(0), "Invalid address");
        require(bytes(addressToUserId[userAddress]).length == 0, "Address already registered");
        require(userAddresses[userId] == address(0), "User ID already registered");
        
        userAddresses[userId] = userAddress;
        addressToUserId[userAddress] = userId;
        
        emit UserRegistered(userId, userAddress);
    }
    
    function executeTransaction(address to, uint256 amount) public whenNotPaused returns (bool) {
        require(amount > 0, "Amount must be greater than zero");
        
        uint256 fee = calculateFee(amount);
        uint256 netAmount = amount - fee;
        
        bool success = token.transferFrom(msg.sender, to, netAmount);
        if (success && fee > 0) {
            token.transferFrom(msg.sender, address(this), fee);
            emit FeeCollected(msg.sender, fee);
        }
        
        return success;
    }
    
    function calculateFee(uint256 amount) public view returns (uint256) {
        return (amount * feePercentage) / 10000;
    }
    
    function setFeePercentage(uint256 newPercentage) public onlyOwner {
        require(newPercentage <= 1000, "Fee cannot exceed 10%");
        feePercentage = newPercentage;
    }
    
    function emergencyPause() public onlyOwner {
        _pause();
    }
    
    function resumeOperations() public onlyOwner {
        _unpause();
    }
}
```

#### 3.2.4 Security Measures

- **Access Control**: Ownable pattern restricts critical functions to admin
- **Pausable Pattern**: Emergency pause mechanism for system-wide halting
- **Input Validation**: Comprehensive parameter checking on all functions
- **Event Emission**: Full event logging for off-chain tracking
- **Reentrancy Protection**: Guard against reentrant attacks in fund transfers
- **Audit Status**: Audited by [Audit Firm] on [Date]

#### 3.2.5 Integration Points

- **Token Contract**: Interacts with NepaliPayToken for transfers
- **FeeRelayer Contract**: Communicates for gas optimization
- **Backend Systems**: Called by server for blockchain operations
- **Admin Dashboard**: Configurable via superadmin interface

### 3.3 FeeRelayer Contract

**Address**: `0x7ff2271749409f9137dac1e082962e21cc99aee6`
**Network**: Binance Smart Chain (BSC) Mainnet
**Verification Status**: Verified on BscScan
**Contract Type**: Transaction Optimization
**Solidity Version**: 0.8.25
**License**: MIT

#### 3.3.1 Contract Overview

The FeeRelayer contract is a specialized utility designed to optimize gas costs and improve user experience by abstracting transaction fees. It enables gas-free transactions for end users by allowing the platform to cover transaction costs, batches operations for efficiency, and provides metering for usage tracking.

#### 3.3.2 Key Contract Features

- **Gas Fee Abstraction**:
  - `executeFor(address user, bytes calldata data)`: Execute transaction on behalf of user
  - `executeMultiple(address[] calldata users, bytes[] calldata dataItems)`: Batch execution
  - `estimateGas(address user, bytes calldata data)`: Calculate gas cost for operation

- **Transaction Batching**:
  - `batchTransfers(address token, address[] calldata recipients, uint256[] calldata amounts)`: Send tokens to multiple recipients in one transaction
  - `batchCalls(address[] calldata targets, bytes[] calldata data)`: Execute multiple contract calls

- **Access Control**:
  - `addRelayer(address relayer)`: Authorize new relayer address
  - `removeRelayer(address relayer)`: Revoke relayer privileges
  - `withdrawFunds(address token, uint256 amount)`: Retrieve accumulated funds

- **Metering and Limits**:
  - `setUserLimit(address user, uint256 limit)`: Set gas usage limit per user
  - `getUserUsage(address user)`: Check user's gas consumption
  - `resetUserUsage(address user)`: Clear user's usage counter

#### 3.3.3 Contract Code Excerpt (Key Functions)

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract FeeRelayer is AccessControl, ReentrancyGuard {
    bytes32 public constant RELAYER_ROLE = keccak256("RELAYER_ROLE");
    
    mapping(address => uint256) public userGasUsage;
    mapping(address => uint256) public userGasLimits;
    
    // Events
    event TransactionRelayed(address indexed user, uint256 gasUsed);
    event BatchTransactionRelayed(address[] users, uint256 totalGasUsed);
    event FundsWithdrawn(address token, address to, uint256 amount);
    
    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(RELAYER_ROLE, msg.sender);
    }
    
    function executeFor(address user, bytes calldata data) 
        external 
        onlyRole(RELAYER_ROLE) 
        nonReentrant 
        returns (bool, bytes memory) 
    {
        uint256 startGas = gasleft();
        
        (bool success, bytes memory returnData) = user.call(data);
        
        uint256 gasUsed = startGas - gasleft();
        userGasUsage[user] += gasUsed;
        
        emit TransactionRelayed(user, gasUsed);
        return (success, returnData);
    }
    
    function batchTransfers(
        address token, 
        address[] calldata recipients, 
        uint256[] calldata amounts
    ) 
        external 
        onlyRole(RELAYER_ROLE) 
        nonReentrant 
        returns (bool) 
    {
        require(recipients.length == amounts.length, "Arrays length mismatch");
        IERC20 tokenContract = IERC20(token);
        
        for (uint256 i = 0; i < recipients.length; i++) {
            require(tokenContract.transfer(recipients[i], amounts[i]), "Transfer failed");
        }
        
        return true;
    }
    
    function setUserLimit(address user, uint256 limit) 
        external 
        onlyRole(DEFAULT_ADMIN_ROLE) 
    {
        userGasLimits[user] = limit;
    }
    
    function resetUserUsage(address user) 
        external 
        onlyRole(DEFAULT_ADMIN_ROLE) 
    {
        userGasUsage[user] = 0;
    }
    
    receive() external payable {}
    
    function withdrawFunds(address token, uint256 amount) 
        external 
        onlyRole(DEFAULT_ADMIN_ROLE) 
    {
        if (token == address(0)) {
            payable(msg.sender).transfer(amount);
        } else {
            IERC20(token).transfer(msg.sender, amount);
        }
        
        emit FundsWithdrawn(token, msg.sender, amount);
    }
}
```

#### 3.3.4 Security Measures

- **Role-Based Access**: Only authorized relayers can execute transactions
- **Reentrancy Guard**: Protection against reentrancy attacks
- **Gas Metering**: Tracking and limiting gas usage per user
- **Input Validation**: Parameter verification before execution
- **Fund Protection**: Withdrawal restrictions to admin only
- **Audit Status**: Audited by [Audit Firm] on [Date]

#### 3.3.5 Integration Points

- **Backend Systems**: Called by server to execute transactions for users
- **NepaliPay Contract**: Works with main contract for optimized operations
- **Admin Dashboard**: Configurable via superadmin interface
- **Monitoring Systems**: Gas usage tracked for reporting

### 3.4 Smart Contract Interaction Flow

#### 3.4.1 Token Purchase Flow

1. User initiates purchase via frontend interface
2. Backend creates Stripe payment intent
3. User completes payment
4. Backend calls `NepaliPay.executeTransaction()` to transfer tokens
5. FeeRelayer optimizes gas costs for the transfer
6. NepaliPayToken transfers tokens to user wallet
7. Events emitted and captured by backend for confirmation

#### 3.4.2 User-to-User Transfer Flow

1. Sender initiates transfer in frontend
2. Backend processes request and generates transaction
3. Backend calls `FeeRelayer.executeFor()` with transfer parameters
4. FeeRelayer executes `NepaliPay.executeTransaction()`
5. NepaliPay calculates fee and processes transfer
6. NepaliPayToken transfers tokens minus fee
7. Events captured and WebSocket notification sent to both users

#### 3.4.3 Contract Update Process

For contract upgrades or modifications:

1. New contract version deployed and verified
2. Superadmin initiates upgrade process
3. References updated in NepaliPay contract
4. Migration process executed
5. Verification performed and confirmed
6. System notifications sent to all stakeholders

### 3.5 Contract Monitoring and Maintenance

#### 3.5.1 Health Monitoring

- **Event Listening**: Backend continuously monitors contract events
- **Transaction Tracking**: Failed transactions logged and analyzed
- **Gas Price Monitoring**: Dynamic adjustment based on network conditions
- **Balance Watching**: Treasury levels monitored for replenishment needs

#### 3.5.2 Maintenance Procedures

- **Quarterly Audits**: Regular security reviews by third parties
- **Gas Optimization**: Periodic review and improvement of transaction efficiency
- **Parameter Tuning**: Fee adjustments based on market conditions
- **Emergency Response**: Documented procedures for security incidents

## 4. User Interface Structure

### 4.1 Design Philosophy and System

The user interface follows a futuristic, glass-morphic style with an Apple-inspired minimalist approach. This advanced UI design creates a premium user experience that distinguishes NepaliPay in the marketplace while maintaining cultural relevance for Nepali users.

#### 4.1.1 Core Design Principles

- **Cultural Sensitivity**: Integration of Nepali cultural elements and aesthetics
- **Minimalism**: Clean, uncluttered interfaces with focused content presentation
- **Consistency**: Unified design language across all components and screens
- **Accessibility**: WCAG 2.1 AA compliance for inclusive user experience
- **Performance**: Optimized rendering for smooth interactions even on lower-end devices

#### 4.1.2 Visual Design Elements

- **Glass-morphic Styling**:
  - Semi-transparent container backgrounds with subtle backdrop blur
  - Light border highlights for depth perception
  - Soft shadow effects for elevation
  - Frosted glass effect on overlays and modals

- **Color System**:
  - **Primary Palette**: Gradient blues (#1A73E8 to #1E88E5) for primary actions and branding
  - **Secondary Palette**: Teal accents (#009688) for supporting elements
  - **Accent Colors**: Cultural Nepali colors for specific highlights
  - **Neutral Tones**: Grayscale spectrum for text and backgrounds
  - **Semantic Colors**: Green (#4CAF50) for success, red (#F44336) for errors, amber (#FFC107) for warnings

- **Typography**:
  - **Primary Font**: Nunito Sans for clean readability
  - **Secondary Font**: Poppins for headings and emphasis
  - **Optional Localized Font**: Preeti for Nepali script
  - **Type Scale**: 8px increment scale (12px, 16px, 24px, 32px, etc.)
  - **Font Weights**: Regular (400), Medium (500), and Bold (700)

- **Iconography**:
  - Custom-designed financial and blockchain icons
  - Consistency with platform-specific guidelines
  - Cultural adaptation for Nepali context where appropriate
  - Outlined style for UI controls, filled style for status indicators

- **Animation and Motion**:
  - Subtle micro-interactions for feedback
  - Purpose-driven animations that enhance usability
  - Smooth transitions between screens and states
  - Loading states with branded animations

#### 4.1.3 UI Component Library

The frontend implements a comprehensive component library built on ShadCN and Radix UI primitives but customized for NepaliPay's specific needs:

- **Foundational Components**:
  - Buttons (primary, secondary, text, icon)
  - Input fields (text, number, date, search)
  - Selection controls (checkboxes, radio buttons, toggles)
  - Form fields with validation states

- **Composite Components**:
  - Cards (transaction, balance, activity)
  - Tables (sortable, filterable, paginated)
  - Charts and graphs (line, bar, pie, area)
  - Navigation elements (sidebar, tabs, breadcrumbs)
  - Modals and dialogs with glass-morphic styling

- **Feature-specific Components**:
  - Currency display with proper formatting
  - Transaction status indicators
  - Balance visualization with trend indicators
  - QR code generator/scanner for payments
  - PIN/password entry with security masking

### 4.2 Responsive Design Implementation

The application employs a sophisticated responsive system that adapts seamlessly across device sizes and orientations:

#### 4.2.1 Breakpoint System

- **Mobile**: < 640px (primary target for many Nepali users)
- **Tablet**: 641px - 1024px 
- **Desktop**: 1025px - 1440px
- **Large Desktop**: > 1440px

#### 4.2.2 Layout Strategies

- **Mobile-first Design**: Core functionality designed for smallest screens first
- **Fluid Grid System**: 12-column layout that scales proportionally
- **Flex and Grid**: Modern CSS layouts for complex component arrangements
- **Component Adaptation**: Elements that transform based on available space
- **Progressive Disclosure**: Information revealed progressively as screen size increases

#### 4.2.3 Touch Optimization

- **Target Sizes**: Minimum 44px × 44px touch targets for interactive elements
- **Gesture Support**: Swipe, pinch, and tap gestures where appropriate
- **Thumb Zone Consideration**: Critical actions positioned within easy reach
- **Alternative Inputs**: Support for both touch and pointer devices

### 4.3 Portal-Specific UI Characteristics

Each portal has distinct visual characteristics to help users instantly recognize which system they're using:

#### 4.3.1 User Portal

- **Color Scheme**: Blue-based primary palette with cultural accents
- **Layout**: Focus on quick actions and financial overview
- **Visual Density**: Moderate with emphasis on clarity
- **Animation Level**: Enhanced for engagement and delight
- **Visual Cues**: Balance prominence and transaction status visualization

#### 4.3.2 Admin Portal

- **Color Scheme**: Blue administrative theme with darker, more serious tone
- **Layout**: Data-dense with emphasis on information hierarchy
- **Visual Density**: Higher to accommodate more management functions
- **Animation Level**: Reduced to professional minimum
- **Visual Cues**: Alert states and monitoring indicators prominent

#### 4.3.3 Owner Portal

- **Color Scheme**: Teal superadmin theme with security-focused elements
- **Layout**: Command-center approach with critical controls prominent
- **Visual Density**: Highest, with comprehensive system visibility
- **Animation Level**: Minimal, focused only on status changes
- **Visual Cues**: Emergency action highlighting and verification states

### 4.4 Navigation Architecture

The application implements three distinct but conceptually unified navigation systems for its separate portals:

#### 4.4.1 User Portal (`nepalipay.com/sections`)

- **Primary Navigation**:
  - **Dashboard**: Personalized financial overview with:
    - Current NPT balance with value in NPR
    - Cryptocurrency holdings visualization
    - Recent transaction list (last 5)
    - Quick action buttons (Send, Receive, Buy)
    - Activity feed
    - Reward status indicator
  
  - **Wallet**: Comprehensive financial management with:
    - Detailed balance breakdown by currency
    - Historical balance chart
    - Deposit and withdrawal options
    - Currency conversion calculator
    - Address management
    - Transaction initiation
  
  - **Send Money**: Multi-option transfer interface:
    - User-to-user transfers with contact selection
    - External wallet transfers with address entry/scan
    - Recurring payment setup
    - Bulk payment functionality
    - Transfer confirmation flow
    - Receipt generation
  
  - **Transactions**: Complete financial history with:
    - Chronological transaction list
    - Advanced filtering options (date, type, amount, status)
    - Search functionality
    - Exportable records
    - Transaction details view
    - Dispute initiation for problematic transactions
  
  - **Borrow NPT**: Collateralized loan management:
    - Current loan status overview
    - Collateral deposit interface
    - Loan application form
    - Loan-to-value calculator
    - Repayment scheduler
    - Collateral health monitoring
    - Liquidation risk indicators

  - **Rewards**: Incentive program interface:
    - Referral link generation
    - Reward point balance
    - Available redemption options
    - Tier status visualization
    - Achievement tracking
    - Reward history

  - **Ad Bazaar**: Advertising marketplace:
    - Current ad campaigns
    - Ad creation wizard
    - Budget management tools
    - Performance analytics
    - Ad preview functionality
    - Targeting options

- **Secondary Navigation**:
  - **Profile**: User information management:
    - Personal details
    - KYC verification status
    - Identity document upload
    - Security settings
    - Notification preferences
    - Connected devices

  - **Settings**: Application configuration:
    - Language preferences (English/Nepali)
    - Theme selection
    - Privacy controls
    - Device management
    - Session information
    - Security options

  - **Support**: Multi-channel assistance:
    - Help center with searchable articles
    - FAQ section with common questions
    - Knowledge base with detailed guides
    - Video tutorials
    - Live chat access
    - Ticket submission form
    - Contact information

#### 4.4.2 Admin Portal (`admin.nepalipay.com`)

- **Primary Navigation**:
  - **Dashboard**: Platform overview with real-time metrics:
    - User acquisition metrics
    - Transaction volume visualization
    - System health indicators
    - Fee collection statistics
    - Alert notifications
    - Quick action shortcuts
  
  - **User Management**: Comprehensive user administration:
    - User search and filtering
    - Profile viewing and editing
    - KYC verification processing
    - Account status controls
    - Security flag management
    - User communication tools
  
  - **Transaction Monitoring**: Financial oversight tooling:
    - Real-time transaction feed
    - Suspicious activity detection
    - Transaction investigation tools
    - Manual transaction processing
    - Chargeback/dispute management
    - Audit logging
  
  - **Financial Control**: Revenue and fee management:
    - Fee collection dashboard
    - Treasury balance monitoring
    - Revenue reporting
    - Transaction fee configuration
    - Settlement processing
    - Financial reconciliation tools
  
  - **Blockchain Analytics**: Distributed ledger insights:
    - Contract interaction monitoring
    - Block explorer integration
    - Gas price analytics
    - Token distribution visualization
    - Network health monitoring
    - Smart contract event logs
  
  - **Customer Support**: User assistance management:
    - Support ticket queue
    - User issue resolution tools
    - Communication templates
    - Knowledge base management
    - FAQ editor
    - Support agent assignment

#### 4.4.3 Owner Portal (`superadmin.nepalipay.com`)

- **Primary Navigation**:
  - **System Configuration**: Core platform parameter control:
    - Feature flag management
    - Environment variable configuration
    - API key management
    - Integration settings
    - Maintenance mode controls
    - System backup and restore
  
  - **Contract Management**: Smart contract administration:
    - Contract deployment interface
    - Function invocation tools
    - Parameter updating
    - Event monitoring
    - Security control center
    - Upgrade coordination
  
  - **Treasury Operations**: Financial governance tools:
    - Token minting controls
    - Fund allocation interface
    - Reserve management
    - Multi-signature transaction approval
    - Liquidity monitoring
    - Emergency fund access
  
  - **Admin Management**: Administrator oversight:
    - Admin account creation
    - Permission assignment
    - Role definition
    - Activity monitoring
    - Security policy enforcement
    - Multi-factor authentication management
  
  - **Emergency Controls**: Critical incident management:
    - System-wide pause controls
    - Circuit breaker mechanisms
    - Security incident response
    - Data protection measures
    - Business continuity tools
    - Disaster recovery initiation

### 4.5 Page Structure and Layout Patterns

The application employs consistent layout patterns across all pages to maintain visual and functional coherence:

#### 4.5.1 Common Layout Elements

- **Header Component**:
  - Logo and branding
  - Portal identifier
  - Global search
  - Notification center
  - User profile menu
  - Language selector

- **Navigation Component**:
  - Responsive sidebar (collapses to bottom bar on mobile)
  - Current section indicator
  - Nested navigation hierarchy
  - Quick action shortcuts
  - Context-specific tools

- **Content Area**:
  - Page title with breadcrumbs
  - Action bar with primary functions
  - Main content with appropriate layout
  - Contextual help access
  - Status messages and alerts

- **Footer Component**:
  - Copyright information
  - Legal links
  - Version information
  - Support access
  - Quick navigation links

#### 4.5.2 Page Layout Patterns

- **Overview Pages**: Dashboard-style layouts with:
  - Card-based information blocks
  - Key metric visualizations
  - Recent activity sections
  - Quick action panels
  - Status indicators

- **List Pages**: Data-focused layouts with:
  - Filterable, sortable tables
  - Batch action tools
  - Pagination controls
  - Quick search
  - List/grid view options

- **Detail Pages**: In-depth information layouts with:
  - Header with essential information
  - Tabbed or sectioned content
  - Related data connections
  - Action sidebar
  - Historical data visualization

- **Form Pages**: Input-focused layouts with:
  - Step indicators for multi-stage forms
  - Field grouping by category
  - Inline validation
  - Context-sensitive help
  - Progress saving

- **Tool Pages**: Function-centered layouts with:
  - Tool controls prominently displayed
  - Input/output sections
  - Configuration options
  - Results visualization
  - Action history

### 4.6 Interaction Design and Patterns

The application implements consistent interaction patterns to ensure users can easily learn and navigate the system:

#### 4.6.1 Core Interaction Patterns

- **Navigation Patterns**:
  - Persistent primary navigation
  - Breadcrumb trails for deep navigation
  - Back button behavior consistency
  - "Up" navigation for hierarchical content
  - Related content linking

- **Selection Patterns**:
  - Single-item selection with highlight
  - Multi-item selection with checkboxes
  - Bulk action application
  - Context menus for item-specific actions
  - Toggle selection for binary states

- **Input Patterns**:
  - Inline validation with immediate feedback
  - Progressive disclosure for complex inputs
  - Smart defaults to reduce input burden
  - Input masks for formatted data
  - Auto-completion for known values

- **Feedback Patterns**:
  - Toast notifications for non-disruptive updates
  - Modal dialogs for requiring attention
  - Progress indicators for long operations
  - Success/error states with clear messaging
  - Confirmation for destructive actions

#### 4.6.2 Financial-Specific Interactions

- **Amount Entry**:
  - Currency-aware input fields
  - Denomination switching
  - Value slider for quick adjustment
  - Common amount shortcuts
  - Fee preview

- **Transaction Flow**:
  - Multi-step confirmation process
  - Fee explanation and breakdown
  - Security verification step
  - Receipt and confirmation
  - Transaction status tracking

- **Portfolio Management**:
  - Asset allocation visualization
  - Drag-and-drop rebalancing
  - Historical performance comparison
  - Risk assessment visualization
  - Goal tracking

### 4.7 Accessibility Implementation

The application is designed to be accessible to all users, including those with disabilities:

#### 4.7.1 Accessibility Features

- **Screen Reader Compatibility**:
  - ARIA landmarks and roles
  - Semantic HTML structure
  - Alt text for all images
  - Form field associations
  - Announcement of dynamic content changes

- **Keyboard Navigation**:
  - Logical tab order
  - Visible focus indicators
  - Keyboard shortcuts for common actions
  - Skip navigation links
  - No keyboard traps

- **Visual Accessibility**:
  - High contrast mode
  - Text resizing support
  - Sufficient color contrast (WCAG AA minimum)
  - Non-color-dependent information
  - Reduced motion option

- **Cognitive Accessibility**:
  - Clear, simple language
  - Consistent navigation and layout
  - Error prevention and recovery
  - Progress tracking for multi-step processes
  - Help text and tooltips

### 4.8 Localization Framework

The application supports multiple languages with a focus on English and Nepali:

#### 4.8.1 Localization Features

- **Text Translation**:
  - Complete UI text internationalization
  - Context-aware translations
  - Plural forms handling
  - Direction support (LTR/RTL)
  - Fallback language behavior

- **Format Adaptation**:
  - Date and time formatting
  - Number and currency formatting
  - Address formatting
  - Name formatting
  - Phone number formatting

- **Cultural Adaptation**:
  - Calendar systems (Gregorian/Nepali Bikram Sambat)
  - Measurement units
  - Cultural symbols and icons
  - Color meanings
  - Idiomatic expressions

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

The PostgreSQL database forms the persistent data storage layer of the NepaliPay application. It is designed with a normalized schema that efficiently models the relationships between various entities while maintaining data integrity and performance.

### 6.1 Schema Design

The database is organized according to domain-driven design principles, with tables grouped into logical modules representing different aspects of the application.

#### 6.1.1 Schema Diagram

```
┌────────────────┐       ┌────────────────┐       ┌────────────────┐
│    Users       │       │    Wallets     │       │  Transactions  │
├────────────────┤       ├────────────────┤       ├────────────────┤
│ id             │       │ id             │       │ id             │
│ username       │       │ user_id        │───┐   │ type           │
│ email          │       │ address        │   │   │ status         │
│ password       │       │ npt_balance    │   │   │ sender_id      │──┐
│ first_name     │       │ bnb_balance    │   │   │ receiver_id    │──┘
│ last_name      │◄──────│ eth_balance    │   │   │ amount         │
│ role           │       │ btc_balance    │   │   │ currency       │
│ kyc_status     │       │ last_updated   │   │   │ tx_hash        │
│ wallet_address │       └────────────────┘   │   │ description    │
│ created_at     │                            │   │ stripe_id      │
│ updated_at     │                            │   │ created_at     │
└────────────────┘                            │   └────────────────┘
        ▲                                     │             ▲
        │                                     │             │
        │                                     │             │
┌────────────────┐       ┌────────────────┐   │   ┌────────────────┐
│   Activities   │       │   Collaterals  │   │   │     Loans      │
├────────────────┤       ├────────────────┤   │   ├────────────────┤
│ id             │       │ id             │   │   │ id             │
│ user_id        │───────│ user_id        │───┘   │ user_id        │
│ action_type    │       │ asset_type     │       │ collateral_id  │──┐
│ description    │       │ amount         │       │ amount         │  │
│ ip_address     │       │ value_usd      │◄──────│ interest_rate  │  │
│ user_agent     │       │ status         │       │ duration       │  │
│ created_at     │       │ created_at     │       │ start_date     │  │
└────────────────┘       │ updated_at     │       │ end_date       │  │
                         └────────────────┘       │ status         │  │
                                 ▲                │ created_at     │  │
                                 │                │ updated_at     │  │
                                 │                └────────────────┘  │
┌────────────────┐               │                        ▲          │
│      Ads       │               │                        │          │
├────────────────┤               │                        │          │
│ id             │       ┌────────────────┐               │          │
│ user_id        │       │    Session     │               │          │
│ title          │       ├────────────────┤       ┌────────────────┐ │
│ description    │       │ sid            │       │Loan_Repayments │ │
│ image_url      │       │ sess           │       ├────────────────┤ │
│ budget         │       │ expire         │       │ id             │ │
│ spent_amount   │       └────────────────┘       │ loan_id        │◄┘
│ status         │                                │ amount         │
│ start_date     │                                │ payment_date   │
│ end_date       │                                │ tx_hash        │
│ created_at     │                                │ status         │
│ updated_at     │                                └────────────────┘
└────────────────┘
```

#### 6.1.2 Database Initialization

The database is initialized using Drizzle ORM migrations, which ensures schema versioning and consistent state across environments. The schema is defined in TypeScript using Drizzle's schema definition language, which provides type safety and validation.

```typescript
// Example schema definition in Drizzle ORM
import { pgTable, serial, text, timestamp, integer, decimal, boolean } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: text('username').notNull().unique(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  firstName: text('first_name'),
  lastName: text('last_name'),
  role: text('role').default('user').notNull(),
  kycStatus: text('kyc_status').default('pending').notNull(),
  kycVerificationId: text('kyc_verification_id'),
  kycVerifiedAt: timestamp('kyc_verified_at'),
  walletAddress: text('wallet_address'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// Other tables defined similarly...
```

### 6.2 Detailed Table Structures

#### 6.2.1 Users Table

The users table is the central entity that stores all user account information:

| Column | Type | Description | Constraints |
|--------|------|-------------|-------------|
| id | SERIAL | Unique identifier | PRIMARY KEY |
| username | TEXT | User's login name | NOT NULL, UNIQUE |
| email | TEXT | User's email address | NOT NULL, UNIQUE |
| password | TEXT | Securely hashed password | NOT NULL |
| first_name | TEXT | User's first name | |
| last_name | TEXT | User's last name | |
| role | TEXT | User's role (user, admin, superadmin) | NOT NULL, DEFAULT 'user' |
| kyc_status | TEXT | KYC verification status (pending, verified, rejected) | NOT NULL, DEFAULT 'pending' |
| kyc_verification_id | TEXT | External KYC verification reference | |
| kyc_verified_at | TIMESTAMP | When KYC was verified | |
| wallet_address | TEXT | Blockchain wallet address | |
| created_at | TIMESTAMP | Record creation time | NOT NULL, DEFAULT NOW() |
| updated_at | TIMESTAMP | Record last update time | NOT NULL, DEFAULT NOW() |

**Indexes:**
- Primary Key: `id`
- Unique: `username`, `email`
- Index: `role`, `kyc_status`

**Relations:**
- One-to-One with `wallets`
- One-to-Many with `transactions` (as sender and receiver)
- One-to-Many with `activities`
- One-to-Many with `collaterals`
- One-to-Many with `loans`
- One-to-Many with `ads`

#### 6.2.2 Wallets Table

The wallets table tracks cryptocurrency balances and related information:

| Column | Type | Description | Constraints |
|--------|------|-------------|-------------|
| id | SERIAL | Unique identifier | PRIMARY KEY |
| user_id | INTEGER | Associated user ID | NOT NULL, FOREIGN KEY |
| address | TEXT | Blockchain wallet address | NOT NULL |
| npt_balance | DECIMAL(24,8) | Balance of NPT tokens | NOT NULL, DEFAULT 0 |
| bnb_balance | DECIMAL(24,8) | Balance of BNB | NOT NULL, DEFAULT 0 |
| eth_balance | DECIMAL(24,8) | Balance of ETH | NOT NULL, DEFAULT 0 |
| btc_balance | DECIMAL(24,8) | Balance of BTC | NOT NULL, DEFAULT 0 |
| last_updated | TIMESTAMP | When balances were last updated | NOT NULL, DEFAULT NOW() |

**Indexes:**
- Primary Key: `id`
- Foreign Key: `user_id` references `users(id)`
- Unique: `user_id` (one wallet per user)

**Relations:**
- Many-to-One with `users`

#### 6.2.3 Transactions Table

The transactions table records all financial movements:

| Column | Type | Description | Constraints |
|--------|------|-------------|-------------|
| id | SERIAL | Unique identifier | PRIMARY KEY |
| type | TEXT | Transaction type (transfer, purchase, loan, repayment) | NOT NULL |
| status | TEXT | Transaction status (pending, completed, failed) | NOT NULL, DEFAULT 'pending' |
| sender_id | INTEGER | User ID of sender | FOREIGN KEY, NULL for system transactions |
| receiver_id | INTEGER | User ID of receiver | FOREIGN KEY, NULL for external transfers |
| amount | DECIMAL(24,8) | Transaction amount | NOT NULL |
| currency | TEXT | Currency code (NPT, BNB, ETH, BTC) | NOT NULL |
| tx_hash | TEXT | Blockchain transaction hash | |
| description | TEXT | Transaction description or notes | |
| stripe_payment_id | TEXT | Stripe payment ID for purchases | |
| fee_amount | DECIMAL(24,8) | Fee charged for transaction | DEFAULT 0 |
| gas_cost | DECIMAL(24,8) | Gas cost for blockchain transaction | DEFAULT 0 |
| created_at | TIMESTAMP | Transaction creation time | NOT NULL, DEFAULT NOW() |
| completed_at | TIMESTAMP | When transaction completed | |

**Indexes:**
- Primary Key: `id`
- Foreign Key: `sender_id` references `users(id)`
- Foreign Key: `receiver_id` references `users(id)`
- Index: `status`, `created_at`, `tx_hash`, `stripe_payment_id`

**Relations:**
- Many-to-One with `users` (sender and receiver)

#### 6.2.4 Activities Table

The activities table logs user actions for security and auditing:

| Column | Type | Description | Constraints |
|--------|------|-------------|-------------|
| id | SERIAL | Unique identifier | PRIMARY KEY |
| user_id | INTEGER | Associated user ID | NOT NULL, FOREIGN KEY |
| action_type | TEXT | Type of action (login, transfer, settings_change) | NOT NULL |
| description | TEXT | Detailed description of activity | NOT NULL |
| ip_address | TEXT | IP address action originated from | |
| user_agent | TEXT | Browser/device information | |
| created_at | TIMESTAMP | When activity occurred | NOT NULL, DEFAULT NOW() |

**Indexes:**
- Primary Key: `id`
- Foreign Key: `user_id` references `users(id)`
- Index: `action_type`, `created_at`

**Relations:**
- Many-to-One with `users`

#### 6.2.5 Collaterals Table

The collaterals table manages assets used as loan security:

| Column | Type | Description | Constraints |
|--------|------|-------------|-------------|
| id | SERIAL | Unique identifier | PRIMARY KEY |
| user_id | INTEGER | Owner user ID | NOT NULL, FOREIGN KEY |
| asset_type | TEXT | Type of collateral asset (BNB, ETH, BTC) | NOT NULL |
| amount | DECIMAL(24,8) | Amount of asset | NOT NULL |
| value_usd | DECIMAL(24,8) | USD value at time of deposit | NOT NULL |
| ltv_ratio | DECIMAL(5,2) | Loan-to-value ratio for this asset | NOT NULL |
| status | TEXT | Status (active, locked, released, liquidated) | NOT NULL, DEFAULT 'active' |
| created_at | TIMESTAMP | When collateral was created | NOT NULL, DEFAULT NOW() |
| updated_at | TIMESTAMP | When collateral was last updated | NOT NULL, DEFAULT NOW() |

**Indexes:**
- Primary Key: `id`
- Foreign Key: `user_id` references `users(id)`
- Index: `status`, `asset_type`

**Relations:**
- Many-to-One with `users`
- One-to-Many with `loans`

#### 6.2.6 Loans Table

The loans table tracks borrowing activity:

| Column | Type | Description | Constraints |
|--------|------|-------------|-------------|
| id | SERIAL | Unique identifier | PRIMARY KEY |
| user_id | INTEGER | Borrower user ID | NOT NULL, FOREIGN KEY |
| collateral_id | INTEGER | Associated collateral ID | NOT NULL, FOREIGN KEY |
| amount | DECIMAL(24,8) | Loan amount in NPT | NOT NULL |
| interest_rate | DECIMAL(6,2) | Annual interest rate percentage | NOT NULL |
| duration | INTEGER | Loan duration in days | NOT NULL |
| start_date | TIMESTAMP | When loan started | |
| end_date | TIMESTAMP | When loan is due | |
| status | TEXT | Status (pending, active, repaid, defaulted, liquidated) | NOT NULL, DEFAULT 'pending' |
| created_at | TIMESTAMP | When loan was created | NOT NULL, DEFAULT NOW() |
| updated_at | TIMESTAMP | When loan was last updated | NOT NULL, DEFAULT NOW() |

**Indexes:**
- Primary Key: `id`
- Foreign Key: `user_id` references `users(id)`
- Foreign Key: `collateral_id` references `collaterals(id)`
- Index: `status`, `start_date`, `end_date`

**Relations:**
- Many-to-One with `users`
- Many-to-One with `collaterals`
- One-to-Many with `loan_repayments`

#### 6.2.7 Loan_Repayments Table

The loan_repayments table tracks individual loan repayments:

| Column | Type | Description | Constraints |
|--------|------|-------------|-------------|
| id | SERIAL | Unique identifier | PRIMARY KEY |
| loan_id | INTEGER | Associated loan ID | NOT NULL, FOREIGN KEY |
| amount | DECIMAL(24,8) | Repayment amount | NOT NULL |
| payment_date | TIMESTAMP | When repayment was made | NOT NULL, DEFAULT NOW() |
| tx_hash | TEXT | Blockchain transaction hash | |
| status | TEXT | Status (pending, completed, failed) | NOT NULL, DEFAULT 'pending' |

**Indexes:**
- Primary Key: `id`
- Foreign Key: `loan_id` references `loans(id)`
- Index: `payment_date`, `status`

**Relations:**
- Many-to-One with `loans`

#### 6.2.8 Ads Table

The ads table stores advertising campaign information:

| Column | Type | Description | Constraints |
|--------|------|-------------|-------------|
| id | SERIAL | Unique identifier | PRIMARY KEY |
| user_id | INTEGER | Campaign owner user ID | NOT NULL, FOREIGN KEY |
| title | TEXT | Advertisement title | NOT NULL |
| description | TEXT | Advertisement description | NOT NULL |
| image_url | TEXT | URL to advertisement image | |
| link_url | TEXT | Target URL for advertisement | |
| budget | DECIMAL(24,8) | Total campaign budget in NPT | NOT NULL |
| spent_amount | DECIMAL(24,8) | Amount spent so far | NOT NULL, DEFAULT 0 |
| daily_limit | DECIMAL(24,8) | Maximum daily spend | |
| impressions | INTEGER | Count of ad views | DEFAULT 0 |
| clicks | INTEGER | Count of ad clicks | DEFAULT 0 |
| status | TEXT | Status (pending, active, paused, completed) | NOT NULL, DEFAULT 'pending' |
| start_date | TIMESTAMP | Campaign start date | |
| end_date | TIMESTAMP | Campaign end date | |
| created_at | TIMESTAMP | When ad was created | NOT NULL, DEFAULT NOW() |
| updated_at | TIMESTAMP | When ad was last updated | NOT NULL, DEFAULT NOW() |

**Indexes:**
- Primary Key: `id`
- Foreign Key: `user_id` references `users(id)`
- Index: `status`, `start_date`, `end_date`

**Relations:**
- Many-to-One with `users`

#### 6.2.9 Session Table

The session table manages user authentication sessions:

| Column | Type | Description | Constraints |
|--------|------|-------------|-------------|
| sid | TEXT | Session ID | PRIMARY KEY |
| sess | JSON | Session data | NOT NULL |
| expire | TIMESTAMP | Session expiration time | NOT NULL |

**Indexes:**
- Primary Key: `sid`
- Index: `expire`

### 6.3 Database Performance Optimization

The database is optimized for performance through:

#### 6.3.1 Indexing Strategy

- **Primary Keys**: Every table has a primary key for fast record retrieval
- **Foreign Keys**: All relationships are properly indexed
- **Compound Indexes**: Multi-column indexes for common query patterns
- **Partial Indexes**: For filtering on specific conditions
- **Expression Indexes**: For complex queries involving calculated values

#### 6.3.2 Query Optimization

- Parameterized queries to avoid SQL injection and enable query caching
- Efficient join strategies with proper indexes
- Limiting result sets to reduce data transfer
- Using pagination for large data sets
- Optimizing WHERE clauses to utilize indexes

#### 6.3.3 Connection Pooling

- Managed through the Node.js PostgreSQL client
- Configurable pool size based on server resources
- Connection timeout management
- Idle connection cleanup

### 6.4 Database Backup and Recovery

#### 6.4.1 Backup Strategy

- Daily full database backups
- Transaction log backups every hour
- Backup verification through automated restoration tests
- Encrypted backups stored in secure, off-site locations

#### 6.4.2 Recovery Procedures

- Point-in-time recovery capability
- Documented recovery procedures with clear steps
- Regular recovery drills to ensure process effectiveness
- Multiple recovery environments for testing

### 6.5 Data Migration and Evolution

#### 6.5.1 Schema Migrations

- Version-controlled migrations using Drizzle ORM
- Forward and rollback capabilities for each migration
- Migration testing in staging environments before production
- Automated migration validation

#### 6.5.2 Data Transformation

- ETL processes for data restructuring
- Data normalization and cleaning procedures
- Historical data archiving strategy
- Data integrity validation after migrations

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