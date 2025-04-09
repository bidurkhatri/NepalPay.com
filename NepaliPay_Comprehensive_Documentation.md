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

The NepaliPay backend implements a comprehensive RESTful API that serves as the communication layer between the frontend applications and the underlying business logic, database, and blockchain systems. The API is designed with versioning, authentication, validation, and performance optimizations.

### 7.1 API Architecture

#### 7.1.1 API Structure Overview

The API follows a structured resource-oriented architecture with:

- **Domain-based Grouping**: Endpoints organized by domain (auth, wallet, transactions, etc.)
- **Versioning Strategy**: URL-based versioning to ensure backward compatibility
- **Consistent Response Format**: Standardized JSON response structure across all endpoints
- **HTTP Status Codes**: Proper use of semantic HTTP status codes
- **Error Handling**: Detailed error responses with appropriate codes and messages

#### 7.1.2 Standard Request/Response Format

**Request Format:**

```
HTTP Method: GET|POST|PUT|DELETE
URL: https://api.nepalipay.com/v1/{resource}
Headers:
  - Content-Type: application/json
  - Authorization: Bearer {sessionToken}
  - Accept-Language: en|ne
Body: {
  "field1": "value1",
  "field2": "value2"
}
```

**Response Format:**

```json
{
  "success": true|false,
  "data": {
    // Response data object (when success is true)
  },
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": {
      // Additional error details (optional)
    }
  },
  "meta": {
    "timestamp": "2025-04-09T12:34:56Z",
    "requestId": "req_123456789"
  }
}
```

#### 7.1.3 Middleware Pipeline

All API requests flow through a carefully designed middleware pipeline:

1. **Request Logging**: Records incoming request details
2. **CORS Handling**: Manages cross-origin resource sharing
3. **Body Parsing**: Parses JSON request bodies
4. **Authentication**: Verifies user identity and session
5. **Authorization**: Checks permission for requested resource
6. **Rate Limiting**: Prevents abuse through request throttling
7. **Input Validation**: Validates request parameters using Zod schemas
8. **Route Handler**: Processes the actual request logic
9. **Response Formatting**: Standardizes response format
10. **Error Handling**: Catches and processes any errors

#### 7.1.4 Endpoint Versioning

Versioning is implemented through URL paths to ensure compatibility as the API evolves:

- `/v1/*`: Initial API version
- `/v2/*`: Second major version with breaking changes
- `/latest/*`: Alias for the most recent stable version

### 7.2 Authentication Endpoints

Authentication endpoints handle user registration, login, and session management:

#### 7.2.1 User Registration

**Endpoint:** `POST /api/v1/auth/register`

**Description:** Creates a new user account with basic profile information

**Request Parameters:**
```json
{
  "username": "string (3-20 characters, alphanumeric with underscores)",
  "email": "valid email format",
  "password": "string (min 8 characters, requires mix of characters)",
  "firstName": "string (optional)",
  "lastName": "string (optional)"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 123,
      "username": "johndoe",
      "email": "john@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "user",
      "kycStatus": "pending",
      "createdAt": "2025-04-09T10:30:00Z"
    }
  },
  "meta": {
    "timestamp": "2025-04-09T10:30:00Z"
  }
}
```

**Status Codes:**
- `201 Created`: User successfully registered
- `400 Bad Request`: Invalid input data
- `409 Conflict`: Username or email already exists

**Implementation Notes:**
- Password is hashed using scrypt with random salt before storage
- A wallet is automatically created for the new user
- Initial verification email is sent to the user's email address
- KYC status is initially set to "pending"

#### 7.2.2 User Login

**Endpoint:** `POST /api/v1/auth/login`

**Description:** Authenticates a user and creates a new session

**Request Parameters:**
```json
{
  "username": "string (username or email)",
  "password": "string"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 123,
      "username": "johndoe",
      "email": "john@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "user",
      "kycStatus": "verified",
      "createdAt": "2025-04-09T10:30:00Z"
    }
  },
  "meta": {
    "timestamp": "2025-04-09T11:45:00Z"
  }
}
```

**Status Codes:**
- `200 OK`: Login successful
- `400 Bad Request`: Invalid credentials
- `401 Unauthorized`: Account locked or suspended
- `429 Too Many Requests`: Rate limit exceeded for login attempts

**Implementation Notes:**
- Establishes a secure session cookie for authenticated requests
- Records login activity in the activities table
- Implements progressive delays for repeated failed login attempts
- Returns user data to initialize client state

#### 7.2.3 User Logout

**Endpoint:** `POST /api/v1/auth/logout`

**Description:** Ends the current user session

**Request Parameters:** None

**Response:**
```json
{
  "success": true,
  "data": null,
  "meta": {
    "timestamp": "2025-04-09T14:22:10Z"
  }
}
```

**Status Codes:**
- `200 OK`: Logout successful
- `401 Unauthorized`: No active session

**Implementation Notes:**
- Invalidates and clears session cookies
- Records logout activity in activities table
- Closes any active WebSocket connections

#### 7.2.4 Current User Info

**Endpoint:** `GET /api/v1/auth/user`

**Description:** Retrieves current authenticated user information

**Request Parameters:** None

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 123,
      "username": "johndoe",
      "email": "john@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "user",
      "kycStatus": "verified",
      "wallet": {
        "address": "0x1234567890abcdef1234567890abcdef12345678",
        "nptBalance": "1250.25"
      },
      "profileComplete": true,
      "createdAt": "2025-04-09T10:30:00Z"
    }
  },
  "meta": {
    "timestamp": "2025-04-09T15:10:32Z"
  }
}
```

**Status Codes:**
- `200 OK`: Request successful
- `401 Unauthorized`: Not authenticated

**Implementation Notes:**
- Includes basic wallet information for faster UI rendering
- Support for optional `include` query parameter to include related data
- Records session validation in activity logs for security auditing

#### 7.2.5 Password Reset Request

**Endpoint:** `POST /api/v1/auth/reset-password/request`

**Description:** Initiates a password reset process

**Request Parameters:**
```json
{
  "email": "valid email format"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "If an account exists with that email, a password reset link has been sent."
  },
  "meta": {
    "timestamp": "2025-04-09T16:45:22Z"
  }
}
```

**Status Codes:**
- `200 OK`: Request processed (always returns 200 regardless of whether email exists)
- `400 Bad Request`: Invalid email format
- `429 Too Many Requests`: Too many reset attempts

**Implementation Notes:**
- Always returns success response for security (even if email doesn't exist)
- Generates time-limited secure reset token
- Sends email with password reset link
- Rate limiting applied per IP address and per email

#### 7.2.6 Password Reset Completion

**Endpoint:** `POST /api/v1/auth/reset-password/complete`

**Description:** Completes the password reset process with a new password

**Request Parameters:**
```json
{
  "token": "reset token from email",
  "newPassword": "string (min 8 characters, requires mix of characters)"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Password has been reset successfully."
  },
  "meta": {
    "timestamp": "2025-04-09T17:15:45Z"
  }
}
```

**Status Codes:**
- `200 OK`: Password reset successful
- `400 Bad Request`: Invalid password format or token
- `401 Unauthorized`: Expired or invalid token

**Implementation Notes:**
- Verifies token validity and expiration
- Updates password with new hash
- Invalidates all existing sessions for security
- Notifies user via email about password change
- Records password change in activity logs

### 7.3 Wallet Endpoints

Wallet endpoints handle cryptocurrency balance information and management:

#### 7.3.1 Get Wallet Information

**Endpoint:** `GET /api/v1/wallet`

**Description:** Retrieves detailed wallet information for the authenticated user

**Request Parameters:** None

**Response:**
```json
{
  "success": true,
  "data": {
    "wallet": {
      "id": 456,
      "address": "0x1234567890abcdef1234567890abcdef12345678",
      "nptBalance": "1250.25",
      "bnbBalance": "0.5",
      "ethBalance": "0.25",
      "btcBalance": "0.01",
      "lastUpdated": "2025-04-09T16:30:00Z",
      "fiatValue": {
        "npt": {
          "amount": "1250.25",
          "currency": "NPR",
          "value": "1250.25"
        },
        "bnb": {
          "amount": "0.5",
          "currency": "USD",
          "value": "145.50"
        },
        "eth": {
          "amount": "0.25",
          "currency": "USD",
          "value": "750.25"
        },
        "btc": {
          "amount": "0.01",
          "currency": "USD",
          "value": "520.10"
        },
        "total": {
          "currency": "NPR",
          "value": "176523.75"
        }
      }
    }
  },
  "meta": {
    "timestamp": "2025-04-09T16:35:10Z"
  }
}
```

**Status Codes:**
- `200 OK`: Request successful
- `401 Unauthorized`: Not authenticated
- `404 Not Found`: Wallet not found (should never occur for valid user)

**Implementation Notes:**
- Calculates fiat values based on current exchange rates
- Includes conversion to NPR for total value
- Optimized to use cached blockchain data when fresh enough
- Updates cache if data is stale

#### 7.3.2 Wallet Transaction History

**Endpoint:** `GET /api/v1/wallet/transactions`

**Description:** Retrieves transaction history for the user's wallet

**Request Parameters:**
- `type` (query, optional): Filter by transaction type (transfer, purchase, loan, etc.)
- `currency` (query, optional): Filter by currency (NPT, BNB, ETH, BTC)
- `startDate` (query, optional): Filter transactions after this date
- `endDate` (query, optional): Filter transactions before this date
- `page` (query, optional): Page number (default: 1)
- `limit` (query, optional): Results per page (default: 20, max: 100)
- `sort` (query, optional): Sort field (default: createdAt)
- `order` (query, optional): Sort order (asc or desc, default: desc)

**Response:**
```json
{
  "success": true,
  "data": {
    "transactions": [
      {
        "id": 789,
        "type": "transfer",
        "status": "completed",
        "amount": "100.00",
        "currency": "NPT",
        "sender": {
          "id": 123,
          "username": "johndoe"
        },
        "receiver": {
          "id": 456,
          "username": "janedoe"
        },
        "description": "Payment for services",
        "txHash": "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
        "feeAmount": "2.00",
        "createdAt": "2025-04-09T14:25:10Z",
        "completedAt": "2025-04-09T14:25:30Z"
      },
      {
        "id": 788,
        "type": "purchase",
        "status": "completed",
        "amount": "500.00",
        "currency": "NPT",
        "sender": null,
        "receiver": {
          "id": 123,
          "username": "johndoe"
        },
        "description": "Token purchase via Stripe",
        "txHash": "0x0987654321fedcba0987654321fedcba0987654321fedcba0987654321fedcba",
        "stripePaymentId": "pi_1234567890",
        "feeAmount": "10.00",
        "createdAt": "2025-04-08T11:15:22Z",
        "completedAt": "2025-04-08T11:15:45Z"
      }
    ],
    "pagination": {
      "total": 24,
      "page": 1,
      "limit": 20,
      "pages": 2
    }
  },
  "meta": {
    "timestamp": "2025-04-09T16:40:15Z"
  }
}
```

**Status Codes:**
- `200 OK`: Request successful
- `400 Bad Request`: Invalid query parameters
- `401 Unauthorized`: Not authenticated

**Implementation Notes:**
- Implements pagination for performance with large transaction histories
- Supports rich filtering capabilities
- Includes both sent and received transactions
- Optimized database queries with proper indexing

#### 7.3.3 Refresh Wallet Balances

**Endpoint:** `POST /api/v1/wallet/refresh`

**Description:** Forces an immediate refresh of wallet balances from the blockchain

**Request Parameters:** None

**Response:**
```json
{
  "success": true,
  "data": {
    "wallet": {
      "id": 456,
      "address": "0x1234567890abcdef1234567890abcdef12345678",
      "nptBalance": "1250.25",
      "bnbBalance": "0.5",
      "ethBalance": "0.25",
      "btcBalance": "0.01",
      "lastUpdated": "2025-04-09T16:45:30Z"
    }
  },
  "meta": {
    "timestamp": "2025-04-09T16:45:30Z"
  }
}
```

**Status Codes:**
- `200 OK`: Refresh successful
- `401 Unauthorized`: Not authenticated
- `429 Too Many Requests`: Rate limit exceeded for refresh requests
- `503 Service Unavailable`: Blockchain service temporarily unavailable

**Implementation Notes:**
- Makes direct blockchain RPC calls to fetch current balances
- Updates database with new balance information
- Rate limited to prevent excessive blockchain queries
- Broadcasts update via WebSocket if connected

#### 7.3.4 Get Wallet Address QR Code

**Endpoint:** `GET /api/v1/wallet/qr-code`

**Description:** Generates a QR code for the user's wallet address

**Request Parameters:**
- `size` (query, optional): Size of QR code in pixels (default: 300)
- `format` (query, optional): Image format (png, svg, default: svg)

**Response:**
```
Content-Type: image/svg+xml
<svg><!-- QR code content --></svg>
```

**Status Codes:**
- `200 OK`: Request successful
- `400 Bad Request`: Invalid parameters
- `401 Unauthorized`: Not authenticated

**Implementation Notes:**
- Dynamically generates QR code with wallet address
- Caches generated QR codes for performance
- Includes wallet address in human-readable format below QR code
- High-quality vector format preferred for better scaling

### 7.4 Transaction Endpoints

Transaction endpoints handle the creation and management of financial transactions:

#### 7.4.1 Send Tokens (Internal)

**Endpoint:** `POST /api/v1/transactions/send`

**Description:** Transfers tokens to another NepaliPay user

**Request Parameters:**
```json
{
  "recipient": "username or email",
  "amount": "decimal string",
  "currency": "NPT",
  "description": "optional description"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "transaction": {
      "id": 790,
      "type": "transfer",
      "status": "pending",
      "amount": "50.00",
      "currency": "NPT",
      "sender": {
        "id": 123,
        "username": "johndoe"
      },
      "receiver": {
        "id": 456,
        "username": "janedoe"
      },
      "description": "Lunch payment",
      "feeAmount": "1.00",
      "txHash": null,
      "createdAt": "2025-04-09T16:55:00Z",
      "estimatedCompletion": "2025-04-09T17:00:00Z"
    }
  },
  "meta": {
    "timestamp": "2025-04-09T16:55:00Z"
  }
}
```

**Status Codes:**
- `201 Created`: Transaction created successfully
- `400 Bad Request`: Invalid input data
- `401 Unauthorized`: Not authenticated
- `402 Payment Required`: Insufficient funds
- `404 Not Found`: Recipient not found

**Implementation Notes:**
- Validates sufficient balance before creating transaction
- Creates pending transaction record in database
- Initiates blockchain transaction via FeeRelayer contract
- Calculates and applies transaction fee
- Records transaction in activity log
- Sends WebSocket notification to both parties
- Handles asynchronous confirmation from blockchain

#### 7.4.2 Send Tokens (External)

**Endpoint:** `POST /api/v1/transactions/external`

**Description:** Transfers tokens to an external blockchain wallet

**Request Parameters:**
```json
{
  "address": "valid blockchain address",
  "amount": "decimal string",
  "currency": "NPT|BNB|ETH|BTC",
  "description": "optional description",
  "gasPrice": "optional override for gas price"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "transaction": {
      "id": 791,
      "type": "external_transfer",
      "status": "pending",
      "amount": "75.00",
      "currency": "NPT",
      "sender": {
        "id": 123,
        "username": "johndoe"
      },
      "receiverAddress": "0xabcdef1234567890abcdef1234567890abcdef12",
      "description": "External transfer",
      "feeAmount": "1.50",
      "gasCost": "0.002",
      "txHash": null,
      "createdAt": "2025-04-09T17:05:00Z",
      "estimatedCompletion": "2025-04-09T17:15:00Z"
    }
  },
  "meta": {
    "timestamp": "2025-04-09T17:05:00Z"
  }
}
```

**Status Codes:**
- `201 Created`: Transaction created successfully
- `400 Bad Request`: Invalid input data
- `401 Unauthorized`: Not authenticated
- `402 Payment Required`: Insufficient funds
- `403 Forbidden`: External transfers disabled or restricted

**Implementation Notes:**
- Validates external address format and network compatibility
- Includes additional security validation for external transfers
- May require additional verification for high-value transactions
- Monitors transaction confirmation on blockchain
- Higher fees than internal transfers

#### 7.4.3 Get Transaction Details

**Endpoint:** `GET /api/v1/transactions/:id`

**Description:** Retrieves detailed information about a specific transaction

**Request Parameters:**
- `id` (path): Transaction ID

**Response:**
```json
{
  "success": true,
  "data": {
    "transaction": {
      "id": 789,
      "type": "transfer",
      "status": "completed",
      "amount": "100.00",
      "currency": "NPT",
      "sender": {
        "id": 123,
        "username": "johndoe"
      },
      "receiver": {
        "id": 456,
        "username": "janedoe"
      },
      "description": "Payment for services",
      "txHash": "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
      "feeAmount": "2.00",
      "blockConfirmations": 12,
      "blockExplorerUrl": "https://bscscan.com/tx/0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
      "createdAt": "2025-04-09T14:25:10Z",
      "completedAt": "2025-04-09T14:25:30Z"
    }
  },
  "meta": {
    "timestamp": "2025-04-09T17:10:00Z"
  }
}
```

**Status Codes:**
- `200 OK`: Request successful
- `401 Unauthorized`: Not authenticated
- `403 Forbidden`: Transaction belongs to another user
- `404 Not Found`: Transaction not found

**Implementation Notes:**
- Includes comprehensive transaction details
- Shows blockchain confirmation status
- Provides link to block explorer for verification
- Permission check ensures users only see their own transactions

#### 7.4.4 Get Transaction Receipt

**Endpoint:** `GET /api/v1/transactions/:id/receipt`

**Description:** Generates a downloadable receipt for a completed transaction

**Request Parameters:**
- `id` (path): Transaction ID
- `format` (query, optional): Receipt format (pdf, html, default: pdf)

**Response:**
```
Content-Type: application/pdf
Content-Disposition: attachment; filename="transaction_789_receipt.pdf"

[Binary PDF content]
```

**Status Codes:**
- `200 OK`: Request successful
- `401 Unauthorized`: Not authenticated
- `403 Forbidden`: Transaction belongs to another user
- `404 Not Found`: Transaction not found

**Implementation Notes:**
- Generates professional receipt with transaction details
- Includes NepaliPay branding and legal information
- Digital signature for verification
- PDF generation handled by PDFKit library

### 7.5 Token Purchase Endpoints

Token purchase endpoints handle the acquisition of NPT tokens through fiat currency payments:

#### 7.5.1 Create Payment Intent

**Endpoint:** `POST /api/v1/payments/create-intent`

**Description:** Initializes a Stripe payment intent for purchasing NPT tokens

**Request Parameters:**
```json
{
  "amount": "decimal string",
  "currency": "USD|EUR|GBP|INR|NPR",
  "paymentMethod": "card"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "clientSecret": "pi_1234_secret_5678",
    "amount": "100.00",
    "currency": "USD",
    "feeAmount": "2.00",
    "gasEstimate": "0.50",
    "totalAmount": "102.50",
    "tokenEstimate": "498.75",
    "exchangeRate": "4.9875",
    "paymentId": "pi_1234567890"
  },
  "meta": {
    "timestamp": "2025-04-09T17:20:00Z"
  }
}
```

**Status Codes:**
- `200 OK`: Intent created successfully
- `400 Bad Request`: Invalid input data
- `401 Unauthorized`: Not authenticated
- `429 Too Many Requests`: Rate limit exceeded
- `503 Service Unavailable`: Payment service unavailable

**Implementation Notes:**
- Calculates total amount including fees and gas costs
- Creates Stripe payment intent with appropriate metadata
- Returns client secret for Stripe.js integration
- Records pending purchase transaction in database
- Includes estimated token amount based on current exchange rate
- Implements idempotency to prevent duplicate payment intents

#### 7.5.2 Verify Payment

**Endpoint:** `POST /api/v1/payments/verify`

**Description:** Verifies a completed payment and initiates token transfer

**Request Parameters:**
```json
{
  "paymentId": "Stripe payment intent ID"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "transaction": {
      "id": 792,
      "type": "purchase",
      "status": "processing",
      "amount": "498.75",
      "currency": "NPT",
      "sender": null,
      "receiver": {
        "id": 123,
        "username": "johndoe"
      },
      "description": "Token purchase via Stripe",
      "stripePaymentId": "pi_1234567890",
      "txHash": null,
      "createdAt": "2025-04-09T17:25:00Z",
      "estimatedCompletion": "2025-04-09T17:30:00Z"
    }
  },
  "meta": {
    "timestamp": "2025-04-09T17:25:00Z"
  }
}
```

**Status Codes:**
- `200 OK`: Verification successful
- `400 Bad Request`: Invalid payment ID
- `401 Unauthorized`: Not authenticated
- `402 Payment Required`: Payment failed or incomplete
- `404 Not Found`: Payment not found
- `409 Conflict`: Payment already processed

**Implementation Notes:**
- Verifies payment status with Stripe API
- Updates local transaction record
- Initiates token transfer from treasury wallet
- Handles blockchain transaction with retry mechanism
- Sends confirmation email with receipt
- Updates user wallet balance
- Broadcasts update via WebSocket

#### 7.5.3 Payment Webhook

**Endpoint:** `POST /api/v1/payments/webhook`

**Description:** Handles asynchronous payment event notifications from Stripe

**Request Parameters:**
- Raw Stripe webhook event data
- Stripe signature in headers for validation

**Response:**
```json
{
  "received": true
}
```

**Status Codes:**
- `200 OK`: Webhook processed successfully
- `400 Bad Request`: Invalid webhook data or signature
- `500 Internal Server Error`: Processing error

**Implementation Notes:**
- Validates webhook signature for security
- Handles various event types (payment_intent.succeeded, payment_intent.failed, etc.)
- Processes payment completion asynchronously
- Updates transaction status based on payment events
- Implements idempotency to handle duplicate events
- Logs all webhook events for audit trail

#### 7.5.4 Get Exchange Rates

**Endpoint:** `GET /api/v1/payments/exchange-rates`

**Description:** Retrieves current exchange rates for NPT token purchases

**Request Parameters:**
- `currencies` (query, optional): Comma-separated list of currencies (default: all supported)

**Response:**
```json
{
  "success": true,
  "data": {
    "base": "NPT",
    "rates": {
      "USD": 0.2005,
      "EUR": 0.1845,
      "GBP": 0.1595,
      "INR": 16.75,
      "NPR": 27.10
    },
    "lastUpdated": "2025-04-09T17:00:00Z"
  },
  "meta": {
    "timestamp": "2025-04-09T17:35:00Z"
  }
}
```

**Status Codes:**
- `200 OK`: Request successful
- `400 Bad Request`: Invalid currency requested

**Implementation Notes:**
- Sources rates from reliable price oracles
- Updates rates on regular intervals
- Caches rates for performance
- Includes timestamp of last rate update
- Public endpoint accessible without authentication

### 7.6 Loan Endpoints

Loan endpoints handle the collateralized loan system:

#### 7.6.1 Get User Loans

**Endpoint:** `GET /api/v1/loans`

**Description:** Retrieves all loans for the authenticated user

**Request Parameters:**
- `status` (query, optional): Filter by loan status
- `page` (query, optional): Page number
- `limit` (query, optional): Results per page

**Response:**
```json
{
  "success": true,
  "data": {
    "loans": [
      {
        "id": 321,
        "amount": "500.00",
        "interestRate": "5.75",
        "duration": 30,
        "startDate": "2025-04-01T10:00:00Z",
        "endDate": "2025-05-01T10:00:00Z",
        "status": "active",
        "collateral": {
          "id": 654,
          "assetType": "BNB",
          "amount": "1.00",
          "valueUsd": "300.00",
          "ltvRatio": "75.00",
          "status": "locked"
        },
        "repaidAmount": "0.00",
        "remainingAmount": "523.96",
        "nextPaymentDue": "2025-05-01T10:00:00Z",
        "createdAt": "2025-04-01T09:45:00Z"
      }
    ],
    "pagination": {
      "total": 1,
      "page": 1,
      "limit": 20,
      "pages": 1
    }
  },
  "meta": {
    "timestamp": "2025-04-09T17:45:00Z"
  }
}
```

**Status Codes:**
- `200 OK`: Request successful
- `401 Unauthorized`: Not authenticated

**Implementation Notes:**
- Includes detailed loan information
- Calculates current loan status and remaining amounts
- Shows associated collateral information
- Implements pagination for scaling

#### 7.6.2 Get Loan Details

**Endpoint:** `GET /api/v1/loans/:id`

**Description:** Retrieves detailed information about a specific loan

**Request Parameters:**
- `id` (path): Loan ID

**Response:**
```json
{
  "success": true,
  "data": {
    "loan": {
      "id": 321,
      "amount": "500.00",
      "interestRate": "5.75",
      "duration": 30,
      "startDate": "2025-04-01T10:00:00Z",
      "endDate": "2025-05-01T10:00:00Z",
      "status": "active",
      "collateral": {
        "id": 654,
        "assetType": "BNB",
        "amount": "1.00",
        "valueUsd": "300.00",
        "ltvRatio": "75.00",
        "status": "locked",
        "currentValueUsd": "290.00",
        "liquidationThreshold": "225.00"
      },
      "interestAccrued": "2.40",
      "repaidAmount": "0.00",
      "remainingAmount": "523.96",
      "nextPaymentDue": "2025-05-01T10:00:00Z",
      "repayments": [],
      "loanToValue": "172.50",
      "healthFactor": "1.68",
      "liquidationRisk": "low",
      "txHash": "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
      "createdAt": "2025-04-01T09:45:00Z",
      "updatedAt": "2025-04-09T00:00:10Z"
    }
  },
  "meta": {
    "timestamp": "2025-04-09T17:50:00Z"
  }
}
```

**Status Codes:**
- `200 OK`: Request successful
- `401 Unauthorized`: Not authenticated
- `403 Forbidden`: Loan belongs to another user
- `404 Not Found`: Loan not found

**Implementation Notes:**
- Includes comprehensive loan details and metrics
- Calculates current loan health status based on collateral value
- Shows liquidation risk assessment
- Includes repayment history
- Provides real-time collateral value updates

#### 7.6.3 Create Loan Request

**Endpoint:** `POST /api/v1/loans`

**Description:** Creates a new loan request backed by collateral

**Request Parameters:**
```json
{
  "collateralAsset": "BNB|ETH|BTC",
  "collateralAmount": "decimal string",
  "loanAmount": "decimal string",
  "duration": "integer (days)"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "loan": {
      "id": 322,
      "amount": "375.00",
      "interestRate": "5.75",
      "duration": 30,
      "status": "pending",
      "collateral": {
        "id": 655,
        "assetType": "BNB",
        "amount": "1.00",
        "valueUsd": "300.00",
        "ltvRatio": "75.00",
        "status": "pending"
      },
      "estimatedRepayment": "394.06",
      "requiredCollateralTransfer": {
        "address": "0xabcdef1234567890abcdef1234567890abcdef12",
        "asset": "BNB",
        "amount": "1.00",
        "memo": "COLLATERAL-655-JOHNDOE"
      },
      "expiresAt": "2025-04-10T18:00:00Z",
      "createdAt": "2025-04-09T18:00:00Z"
    }
  },
  "meta": {
    "timestamp": "2025-04-09T18:00:00Z"
  }
}
```

**Status Codes:**
- `201 Created`: Loan request created successfully
- `400 Bad Request`: Invalid input data
- `401 Unauthorized`: Not authenticated
- `403 Forbidden`: User not eligible for loans
- `409 Conflict`: Exceeds maximum loan limit

**Implementation Notes:**
- Validates collateral asset and amount
- Calculates loan amount based on LTV ratio
- Creates pending loan and collateral records
- Generates collateral deposit instructions
- Sets expiration for pending loan request
- Implements loan limits based on user history and KYC status

#### 7.6.4 Confirm Collateral

**Endpoint:** `POST /api/v1/loans/:id/confirm-collateral`

**Description:** Confirms collateral receipt and activates the loan

**Request Parameters:**
- `id` (path): Loan ID
- `txHash` (body): Blockchain transaction hash for collateral transfer

**Response:**
```json
{
  "success": true,
  "data": {
    "loan": {
      "id": 322,
      "status": "processing",
      "collateral": {
        "id": 655,
        "status": "verifying"
      },
      "estimatedCompletion": "2025-04-09T18:15:00Z"
    }
  },
  "meta": {
    "timestamp": "2025-04-09T18:05:00Z"
  }
}
```

**Status Codes:**
- `200 OK`: Collateral confirmation initiated
- `400 Bad Request`: Invalid transaction hash
- `401 Unauthorized`: Not authenticated
- `403 Forbidden`: Loan belongs to another user
- `404 Not Found`: Loan not found
- `409 Conflict`: Loan not in pending state

**Implementation Notes:**
- Verifies transaction on blockchain
- Updates collateral and loan status
- Initiates automatic loan processing
- Handles blockchain transaction confirmation
- Sends notification when loan is processed

#### 7.6.5 Repay Loan

**Endpoint:** `POST /api/v1/loans/:id/repay`

**Description:** Makes a repayment on an active loan

**Request Parameters:**
- `id` (path): Loan ID
- `amount` (body): Repayment amount (decimal string)

**Response:**
```json
{
  "success": true,
  "data": {
    "repayment": {
      "id": 123,
      "loanId": 321,
      "amount": "100.00",
      "status": "pending",
      "remainingLoanBalance": "423.96",
      "txHash": null,
      "paymentDate": "2025-04-09T18:10:00Z"
    }
  },
  "meta": {
    "timestamp": "2025-04-09T18:10:00Z"
  }
}
```

**Status Codes:**
- `200 OK`: Repayment initiated successfully
- `400 Bad Request`: Invalid amount
- `401 Unauthorized`: Not authenticated
- `403 Forbidden`: Loan belongs to another user
- `404 Not Found`: Loan not found
- `409 Conflict`: Loan not in active state

**Implementation Notes:**
- Validates sufficient balance in wallet
- Creates repayment record
- Processes blockchain transaction
- Updates loan remaining balance
- Handles full repayment automatically
- Releases collateral when loan is fully repaid

### 7.7 Admin Endpoints

Admin endpoints provide platform management capabilities:

#### 7.7.1 Get All Users

**Endpoint:** `GET /api/v1/admin/users`

**Description:** Retrieves all users (admin only)

**Request Parameters:**
- Standard pagination and filtering parameters

**Response:**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": 123,
        "username": "johndoe",
        "email": "john@example.com",
        "firstName": "John",
        "lastName": "Doe",
        "role": "user",
        "kycStatus": "verified",
        "walletAddress": "0x1234567890abcdef1234567890abcdef12345678",
        "createdAt": "2025-04-01T10:00:00Z",
        "lastLogin": "2025-04-09T15:30:00Z"
      },
      // More users...
    ],
    "pagination": {
      "total": 150,
      "page": 1,
      "limit": 20,
      "pages": 8
    }
  },
  "meta": {
    "timestamp": "2025-04-09T18:20:00Z"
  }
}
```

**Status Codes:**
- `200 OK`: Request successful
- `401 Unauthorized`: Not authenticated
- `403 Forbidden`: Not an admin

**Implementation Notes:**
- Restricted to admin users only
- Implements comprehensive filtering options
- Includes user activity information
- Optimized for large dataset handling

#### 7.7.2 Get All Transactions

**Endpoint:** `GET /api/v1/admin/transactions`

**Description:** Retrieves all transactions (admin only)

**Request Parameters:**
- Standard pagination and filtering parameters

**Response:**
```json
{
  "success": true,
  "data": {
    "transactions": [
      // Transaction objects
    ],
    "pagination": {
      "total": 1250,
      "page": 1,
      "limit": 20,
      "pages": 63
    }
  },
  "meta": {
    "timestamp": "2025-04-09T18:30:00Z"
  }
}
```

**Status Codes:**
- `200 OK`: Request successful
- `401 Unauthorized`: Not authenticated
- `403 Forbidden`: Not an admin

**Implementation Notes:**
- Restricted to admin users only
- Includes comprehensive transaction details
- Advanced filtering capabilities
- Activity logging for audit purposes

#### 7.7.3 Process KYC Verification

**Endpoint:** `POST /api/v1/admin/users/:userId/kyc`

**Description:** Updates KYC verification status for a user

**Request Parameters:**
- `userId` (path): User ID
- `status` (body): New status (verified, rejected)
- `notes` (body): Optional notes about decision

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 124,
      "username": "sarahsmith",
      "kycStatus": "verified",
      "kycVerifiedAt": "2025-04-09T18:40:00Z"
    }
  },
  "meta": {
    "timestamp": "2025-04-09T18:40:00Z"
  }
}
```

**Status Codes:**
- `200 OK`: Request successful
- `400 Bad Request`: Invalid status
- `401 Unauthorized`: Not authenticated
- `403 Forbidden`: Not an admin
- `404 Not Found`: User not found

**Implementation Notes:**
- Restricted to admin users only
- Updates user's KYC status
- Sends notification email to user
- Records admin action in audit log
- Enables additional features for verified users

### 7.8 SuperAdmin Endpoints

SuperAdmin endpoints provide highest-level system control:

#### 7.8.1 Mint NPT Tokens

**Endpoint:** `POST /api/v1/superadmin/mint`

**Description:** Mints new NPT tokens (superadmin only)

**Request Parameters:**
```json
{
  "amount": "decimal string",
  "destinationAddress": "wallet address",
  "reason": "reason for minting"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "transaction": {
      "id": 800,
      "type": "mint",
      "amount": "10000.00",
      "currency": "NPT",
      "receiver": {
        "address": "0x1234567890abcdef1234567890abcdef12345678"
      },
      "reason": "Treasury replenishment",
      "txHash": null,
      "status": "pending",
      "createdAt": "2025-04-09T19:00:00Z"
    }
  },
  "meta": {
    "timestamp": "2025-04-09T19:00:00Z"
  }
}
```

**Status Codes:**
- `200 OK`: Minting initiated successfully
- `400 Bad Request`: Invalid parameters
- `401 Unauthorized`: Not authenticated
- `403 Forbidden`: Not a superadmin

**Implementation Notes:**
- Restricted to superadmin users only
- Calls NepaliPayToken contract's mint function
- Requires multi-signature approval for large amounts
- Records detailed audit trail of all minting operations
- Updates system metrics and treasury balances

#### 7.8.2 Platform Emergency Controls

**Endpoint:** `POST /api/v1/superadmin/emergency`

**Description:** Activates emergency controls for the platform

**Request Parameters:**
```json
{
  "action": "pause|resume",
  "systems": ["transfers", "purchases", "loans", "all"],
  "reason": "reason for emergency action"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "status": {
      "transfers": "paused",
      "purchases": "paused",
      "loans": "paused",
      "timestamp": "2025-04-09T19:10:00Z",
      "reason": "Security audit in progress"
    }
  },
  "meta": {
    "timestamp": "2025-04-09T19:10:00Z"
  }
}
```

**Status Codes:**
- `200 OK`: Action performed successfully
- `400 Bad Request`: Invalid parameters
- `401 Unauthorized`: Not authenticated
- `403 Forbidden`: Not a superadmin

**Implementation Notes:**
- Restricted to superadmin users only
- Can pause/resume specific platform functions
- Calls contract pause functions where appropriate
- Logs detailed audit trail of emergency actions
- Sends notifications to all administrators
- Creates system-wide alert for users

## 8. Real-time Data Flow

NepaliPay implements a sophisticated real-time data system using WebSockets to provide instant updates to users without requiring page refreshes or manual polling. This system ensures that users always have the most current information about their financial transactions, wallet balances, and other critical data.

### 8.1 Real-time Architecture

#### 8.1.1 Technology Stack

The real-time system is built on the following technologies:

- **WebSocket Protocol**: For bidirectional, persistent connections between client and server
- **ws Library**: Node.js WebSocket server implementation
- **Custom Event System**: Backend event management and distribution
- **Connection Pool**: Managed WebSocket connections with authentication state
- **Message Queuing**: For handling high-volume and offline scenarios
- **Reconnection Logic**: Client-side connection resilience

#### 8.1.2 System Design Principles

The real-time system follows several key design principles:

- **Authentication-First**: All connections must be authenticated before receiving data
- **Minimal Payload**: Data payloads are optimized for size and relevance
- **Selective Updates**: Users only receive updates relevant to their account
- **High Availability**: Designed for continuous operation with failover capabilities
- **Scalability**: Architecture supports horizontal scaling for growing user base
- **Fallback Mechanisms**: Graceful degradation to polling when WebSockets unavailable

### 8.2 Connection Lifecycle

#### 8.2.1 Connection Establishment

The connection lifecycle follows a defined sequence of steps:

1. **Client Initialization**:
   ```javascript
   // Frontend connection establishment
   const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
   const wsUrl = `${protocol}//${window.location.host}/ws`;
   const socket = new WebSocket(wsUrl);
   
   socket.onopen = () => {
     console.log('WebSocket connection established');
     authenticateConnection();
   };
   ```

2. **Connection Authentication**:
   ```javascript
   // Frontend authentication process
   function authenticateConnection() {
     const authMessage = {
       type: 'authenticate',
       sessionId: sessionStorage.getItem('sessionId')
     };
     socket.send(JSON.stringify(authMessage));
   }
   ```

3. **Server Validation**:
   ```typescript
   // Backend authentication handler
   wss.on('connection', (ws: WebSocket) => {
     let authenticated = false;
     let userId: number | null = null;
     
     ws.on('message', async (message: string) => {
       try {
         const data = JSON.parse(message);
         
         if (data.type === 'authenticate') {
           const session = await validateSession(data.sessionId);
           if (session) {
             authenticated = true;
             userId = session.userId;
             connectionPool.add(userId, ws);
             sendInitialState(userId, ws);
             ws.send(JSON.stringify({
               type: 'authentication_result',
               success: true
             }));
           } else {
             ws.send(JSON.stringify({
               type: 'authentication_result',
               success: false,
               error: 'Invalid session'
             }));
             ws.close();
           }
         } else if (!authenticated) {
           ws.send(JSON.stringify({
             type: 'error',
             message: 'Not authenticated'
           }));
           ws.close();
         } else {
           // Handle other message types
         }
       } catch (error) {
         console.error('WebSocket message error:', error);
       }
     });
     
     ws.on('close', () => {
       if (userId) {
         connectionPool.remove(userId, ws);
       }
     });
   });
   ```

4. **Connection Pool Management**:
   ```typescript
   // Backend connection pool implementation
   class ConnectionPool {
     private connections: Map<number, Set<WebSocket>> = new Map();
     
     add(userId: number, ws: WebSocket): void {
       if (!this.connections.has(userId)) {
         this.connections.set(userId, new Set());
       }
       this.connections.get(userId)!.add(ws);
     }
     
     remove(userId: number, ws: WebSocket): void {
       if (this.connections.has(userId)) {
         const userConnections = this.connections.get(userId)!;
         userConnections.delete(ws);
         if (userConnections.size === 0) {
           this.connections.delete(userId);
         }
       }
     }
     
     broadcast(userId: number, data: any): void {
       if (this.connections.has(userId)) {
         const message = JSON.stringify(data);
         for (const ws of this.connections.get(userId)!) {
           if (ws.readyState === WebSocket.OPEN) {
             ws.send(message);
           }
         }
       }
     }
     
     broadcastToAll(data: any): void {
       const message = JSON.stringify(data);
       for (const [_, connections] of this.connections) {
         for (const ws of connections) {
           if (ws.readyState === WebSocket.OPEN) {
             ws.send(message);
           }
         }
       }
     }
   }
   
   const connectionPool = new ConnectionPool();
   ```

5. **Initial State Synchronization**:
   ```typescript
   // Backend initial state function
   async function sendInitialState(userId: number, ws: WebSocket): Promise<void> {
     try {
       // Get user's wallet
       const wallet = await storage.getWalletByUserId(userId);
       
       // Get user's recent transactions
       const transactions = await storage.getUserTransactions(userId);
       const recentTransactions = transactions.slice(0, 5);
       
       // Get user's active loans
       const loans = await storage.getUserLoans(userId);
       const activeLoans = loans.filter(loan => loan.status === 'active');
       
       // Send initial state
       ws.send(JSON.stringify({
         type: 'initial_state',
         data: {
           wallet,
           recentTransactions,
           activeLoans
         }
       }));
     } catch (error) {
       console.error('Error sending initial state:', error);
       ws.send(JSON.stringify({
         type: 'error',
         message: 'Failed to load initial state'
       }));
     }
   }
   ```

6. **Connection Maintenance**:
   ```javascript
   // Frontend connection management
   let reconnectAttempts = 0;
   const maxReconnectAttempts = 10;
   const baseReconnectDelay = 1000; // 1 second
   
   socket.onclose = (event) => {
     if (!event.wasClean && reconnectAttempts < maxReconnectAttempts) {
       const delay = Math.min(30000, baseReconnectDelay * Math.pow(1.5, reconnectAttempts));
       console.log(`Connection closed. Reconnecting in ${delay}ms...`);
       setTimeout(() => {
         reconnectAttempts++;
         initializeWebSocket();
       }, delay);
     }
   };
   
   // Heartbeat to keep connection alive
   setInterval(() => {
     if (socket.readyState === WebSocket.OPEN) {
       socket.send(JSON.stringify({ type: 'ping' }));
     }
   }, 30000);
   ```

#### 8.2.2 Connection Termination

Connections can terminate in several ways:

1. **Graceful Closure**:
   - User logs out explicitly
   - Application calls `socket.close()`
   - Clean session termination with code 1000

2. **Error Scenarios**:
   - Network interruption
   - Server restarts
   - Authentication timeout or failure
   - Inactivity timeout (30 minutes)

3. **Reconnection Strategy**:
   - Exponential backoff for retry attempts
   - Maximum retry limit
   - User notification of connection issues
   - Fallback to AJAX polling if WebSockets unavailable

### 8.3 Real-time Event Types

#### 8.3.1 Message Format

All WebSocket messages follow a standardized JSON format:

```json
{
  "type": "event_type",
  "id": "unique_message_id",
  "timestamp": "2025-04-09T12:34:56Z",
  "data": {
    // Event-specific payload
  }
}
```

#### 8.3.2 Wallet Update Events

**Event Type:** `wallet_update`

**Description:** Sent when a user's wallet balance changes

**Payload Example:**
```json
{
  "type": "wallet_update",
  "id": "wu_1234567890",
  "timestamp": "2025-04-09T12:34:56Z",
  "data": {
    "wallet": {
      "id": 456,
      "nptBalance": "1350.25",
      "bnbBalance": "0.5",
      "ethBalance": "0.25",
      "btcBalance": "0.01",
      "lastUpdated": "2025-04-09T12:34:50Z"
    },
    "changeSource": {
      "type": "transaction",
      "id": 789
    }
  }
}
```

**Implementation Notes:**
- Triggered by deposit, withdrawal, transfer, purchase or other balance-changing events
- Includes reference to the source of the balance change
- May include fiat value calculations for immediate UI updates
- Optimized to avoid unnecessary updates for minor blockchain confirmations

#### 8.3.3 Transaction Update Events

**Event Type:** `transaction_update`

**Description:** Sent when a transaction status changes or a new transaction is created

**Payload Example:**
```json
{
  "type": "transaction_update",
  "id": "tu_1234567890",
  "timestamp": "2025-04-09T12:40:22Z",
  "data": {
    "transaction": {
      "id": 789,
      "type": "transfer",
      "status": "completed",
      "amount": "100.00",
      "currency": "NPT",
      "sender": {
        "id": 123,
        "username": "johndoe"
      },
      "receiver": {
        "id": 456,
        "username": "janedoe"
      },
      "description": "Payment for services",
      "txHash": "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
      "blockConfirmations": 3,
      "createdAt": "2025-04-09T12:35:10Z",
      "completedAt": "2025-04-09T12:40:20Z"
    },
    "previousStatus": "pending"
  }
}
```

**Implementation Notes:**
- Sent to both sender and receiver for user-to-user transactions
- For purchases, only sent to the buyer
- Contains complete transaction data for immediate UI updates
- Provides blockchain confirmation count for relevant transaction types
- May trigger additional system notifications for important status changes

#### 8.3.4 Collateral Update Events

**Event Type:** `collateral_update`

**Description:** Sent when a collateral's status or value changes

**Payload Example:**
```json
{
  "type": "collateral_update",
  "id": "cu_1234567890",
  "timestamp": "2025-04-09T13:15:45Z",
  "data": {
    "collateral": {
      "id": 654,
      "assetType": "BNB",
      "amount": "1.00",
      "valueUsd": "290.00",
      "previousValueUsd": "300.00",
      "ltvRatio": "75.00",
      "status": "locked",
      "liquidationThreshold": "225.00",
      "healthFactor": "1.68",
      "warningLevel": "none"
    },
    "relatedLoanId": 321
  }
}
```

**Implementation Notes:**
- Triggered by price changes that affect collateral value
- Includes health indicators and warning levels
- Critical for user awareness of liquidation risks
- May trigger additional system notifications for warning status changes

#### 8.3.5 Loan Update Events

**Event Type:** `loan_update`

**Description:** Sent when a loan's status changes

**Payload Example:**
```json
{
  "type": "loan_update",
  "id": "lu_1234567890",
  "timestamp": "2025-04-09T14:22:10Z",
  "data": {
    "loan": {
      "id": 321,
      "status": "active",
      "amount": "500.00",
      "remainingAmount": "423.96",
      "repaidAmount": "100.00",
      "interestAccrued": "23.96",
      "nextPaymentDue": "2025-05-01T10:00:00Z",
      "healthFactor": "1.68"
    },
    "previousStatus": "active",
    "updateReason": "repayment_received"
  }
}
```

**Implementation Notes:**
- Sent for status changes, repayments, interest accrual, etc.
- Includes loan health information for risk assessment
- Contains all data needed for UI updates without additional API calls
- Prioritized for delivery even in high-load scenarios

#### 8.3.6 Activity Update Events

**Event Type:** `activity_update`

**Description:** Sent when a notable security or account activity occurs

**Payload Example:**
```json
{
  "type": "activity_update",
  "id": "au_1234567890",
  "timestamp": "2025-04-09T15:05:30Z",
  "data": {
    "activity": {
      "id": 987,
      "type": "login",
      "description": "New login from Chrome on Windows",
      "ipAddress": "192.168.1.1",
      "location": "Kathmandu, Nepal",
      "createdAt": "2025-04-09T15:05:20Z"
    },
    "requiresAction": false,
    "securityLevel": "info"
  }
}
```

**Implementation Notes:**
- Security-focused events for account protection
- May require user action for suspicious activities
- Classified by severity level (info, warning, critical)
- May trigger system notifications for important security events

#### 8.3.7 System Notification Events

**Event Type:** `system_notification`

**Description:** System-wide announcements and alerts

**Payload Example:**
```json
{
  "type": "system_notification",
  "id": "sn_1234567890",
  "timestamp": "2025-04-09T16:00:00Z",
  "data": {
    "title": "Scheduled Maintenance",
    "message": "NepaliPay will undergo scheduled maintenance on April 15th from 02:00-04:00 UTC. Some services may be temporarily unavailable.",
    "level": "info",
    "action": {
      "type": "link",
      "label": "Learn More",
      "url": "/announcements/maintenance-april-15"
    },
    "expiresAt": "2025-04-15T04:00:00Z"
  }
}
```

**Implementation Notes:**
- Used for platform-wide announcements
- Can contain interactive elements (links, buttons)
- Support for temporary and persistent notifications
- Prioritized for display based on importance level

### 8.4 Backend Implementation

#### 8.4.1 Event Generation

Events are generated from various sources in the backend:

1. **Database Triggers**:
   ```sql
   CREATE OR REPLACE FUNCTION notify_transaction_update()
   RETURNS TRIGGER AS $$
   BEGIN
     PERFORM pg_notify(
       'transaction_channel',
       json_build_object(
         'table', 'transactions',
         'action', TG_OP,
         'id', NEW.id,
         'data', row_to_json(NEW)
       )::text
     );
     RETURN NEW;
   END;
   $$ LANGUAGE plpgsql;

   CREATE TRIGGER transaction_notify_trigger
   AFTER INSERT OR UPDATE ON transactions
   FOR EACH ROW EXECUTE PROCEDURE notify_transaction_update();
   ```

2. **API Action Hooks**:
   ```typescript
   // After creating a transaction
   async function createTransaction(data: InsertTransaction): Promise<Transaction> {
     const transaction = await storage.createTransaction(data);
     eventEmitter.emit('transaction.created', transaction);
     return transaction;
   }
   ```

3. **Blockchain Event Listeners**:
   ```typescript
   // Listen for token transfer events
   const tokenContract = new ethers.Contract(
     tokenAddress,
     tokenAbi,
     provider
   );

   tokenContract.on('Transfer', async (from, to, amount, event) => {
     const amountFormatted = ethers.formatUnits(amount, 18);
     // Check if this concerns any of our users
     const fromUser = await storage.getUserByWalletAddress(from);
     const toUser = await storage.getUserByWalletAddress(to);
     
     if (fromUser) {
       await updateUserWallet(fromUser.id);
       eventEmitter.emit('wallet.updated', {
         userId: fromUser.id,
         changeType: 'token_sent',
         eventId: event.transactionHash
       });
     }
     
     if (toUser) {
       await updateUserWallet(toUser.id);
       eventEmitter.emit('wallet.updated', {
         userId: toUser.id,
         changeType: 'token_received',
         eventId: event.transactionHash
       });
     }
   });
   ```

4. **Scheduled Jobs**:
   ```typescript
   // Periodic price update job
   cron.schedule('*/5 * * * *', async () => {
     try {
       const updatedPrices = await fetchLatestPrices();
       
       // Update collateral values and check for liquidation risks
       const collaterals = await storage.getActiveCollaterals();
       for (const collateral of collaterals) {
         const previousValue = collateral.valueUsd;
         const newValue = calculateCollateralValue(
           collateral.assetType,
           collateral.amount,
           updatedPrices
         );
         
         if (Math.abs(previousValue - newValue) / previousValue > 0.01) {
           // Value changed by more than 1%
           await storage.updateCollateral(collateral.id, {
             valueUsd: newValue
           });
           
           // Check if this affects loan health
           const loan = await storage.getLoanByCollateralId(collateral.id);
           if (loan) {
             const healthFactor = calculateHealthFactor(loan, newValue);
             eventEmitter.emit('collateral.updated', {
               userId: collateral.userId,
               collateralId: collateral.id,
               loanId: loan.id,
               previousValue,
               newValue,
               healthFactor
             });
           }
         }
       }
     } catch (error) {
       console.error('Price update job failed:', error);
     }
   });
   ```

#### 8.4.2 Event Processing

The system processes events through a central event bus:

```typescript
import { EventEmitter } from 'events';

class EnhancedEventEmitter extends EventEmitter {
  emitAsync(event: string, ...args: any[]): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const result = this.emit(event, ...args);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }
}

const eventEmitter = new EnhancedEventEmitter();

// Register WebSocket broadcast handler
eventEmitter.on('wallet.updated', async (data) => {
  try {
    const { userId } = data;
    const wallet = await storage.getWalletByUserId(userId);
    
    connectionPool.broadcast(userId, {
      type: 'wallet_update',
      id: `wu_${Date.now()}`,
      timestamp: new Date().toISOString(),
      data: {
        wallet,
        changeSource: {
          type: data.changeType,
          id: data.eventId
        }
      }
    });
  } catch (error) {
    console.error('Error broadcasting wallet update:', error);
  }
});

// Similar handlers for other event types...
```

#### 8.4.3 WebSocket Server Integration

The WebSocket server is integrated with the HTTP server:

```typescript
import { Server as WebSocketServer } from 'ws';
import { createServer } from 'http';
import express from 'express';

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ 
  server, 
  path: '/ws'
});

// Set up WebSocket handlers as described in Connection Establishment section

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### 8.5 Frontend Implementation

#### 8.5.1 WebSocket Client

The frontend implements a WebSocket client with reconnection capabilities:

```typescript
// src/contexts/real-time-context.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './auth-context';

interface RealTimeContextType {
  connected: boolean;
  lastMessage: any;
}

const RealTimeContext = createContext<RealTimeContextType>({
  connected: false,
  lastMessage: null
});

export const RealTimeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<any>(null);
  const { user } = useAuth();
  
  useEffect(() => {
    let ws: WebSocket | null = null;
    let reconnectTimer: NodeJS.Timeout | null = null;
    let reconnectAttempts = 0;
    
    const connectWebSocket = () => {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws`;
      
      ws = new WebSocket(wsUrl);
      
      ws.onopen = () => {
        console.log('WebSocket connected');
        setConnected(true);
        reconnectAttempts = 0;
        
        // Authenticate the connection if user is logged in
        if (user) {
          ws.send(JSON.stringify({
            type: 'authenticate',
            sessionId: sessionStorage.getItem('sessionId')
          }));
        }
      };
      
      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          setLastMessage(message);
          
          // Process different message types
          handleWebSocketMessage(message);
        } catch (error) {
          console.error('Error processing WebSocket message:', error);
        }
      };
      
      ws.onclose = () => {
        setConnected(false);
        console.log('WebSocket disconnected');
        
        // Implement reconnection with exponential backoff
        if (user && reconnectAttempts < 10) {
          const delay = Math.min(30000, 1000 * Math.pow(1.5, reconnectAttempts));
          console.log(`Reconnecting in ${delay}ms...`);
          
          reconnectTimer = setTimeout(() => {
            reconnectAttempts++;
            connectWebSocket();
          }, delay);
        }
      };
      
      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
      
      setSocket(ws);
    };
    
    // Only connect if user is logged in
    if (user) {
      connectWebSocket();
    }
    
    // Cleanup function
    return () => {
      if (ws) {
        ws.close();
      }
      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
      }
    };
  }, [user]);
  
  // Function to handle different message types
  const handleWebSocketMessage = (message: any) => {
    switch (message.type) {
      case 'wallet_update':
        // Update wallet state
        break;
      case 'transaction_update':
        // Update transaction state
        break;
      case 'system_notification':
        // Show notification
        break;
      // Handle other message types...
    }
  };
  
  return (
    <RealTimeContext.Provider value={{ connected, lastMessage }}>
      {children}
    </RealTimeContext.Provider>
  );
};

export const useRealTime = () => useContext(RealTimeContext);
```

#### 8.5.2 Integration with State Management

WebSocket updates are integrated with the application's state management:

```typescript
// Example: Integration with wallet component
import { useEffect, useState } from 'react';
import { useRealTime } from '@/contexts/real-time-context';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

export const WalletBalance = () => {
  const { lastMessage } = useRealTime();
  const queryClient = useQueryClient();
  
  const { data: wallet, isLoading } = useQuery({
    queryKey: ['/api/wallet'],
    queryFn: async () => {
      const res = await apiRequest('GET', '/api/wallet');
      return res.json();
    }
  });
  
  // Process real-time wallet updates
  useEffect(() => {
    if (lastMessage && lastMessage.type === 'wallet_update') {
      // Update wallet data in the query cache
      queryClient.setQueryData(['/api/wallet'], {
        ...wallet,
        ...lastMessage.data.wallet
      });
      
      // Play a subtle sound effect for balance changes
      if (lastMessage.data.changeSource.type === 'transaction') {
        playBalanceChangeSound();
      }
    }
  }, [lastMessage, queryClient, wallet]);
  
  if (isLoading) {
    return <div>Loading wallet information...</div>;
  }
  
  return (
    <div className="wallet-balance">
      <h2>Your Balance</h2>
      <div className="balance-card">
        <div className="balance-amount">{wallet.nptBalance} NPT</div>
        <div className="balance-fiat">≈ {wallet.fiatValue.npt.value} NPR</div>
      </div>
      {/* Other wallet details */}
    </div>
  );
};
```

#### 8.5.3 User Interface Updates

The UI provides visual feedback for real-time events:

```typescript
// Example: Transaction notification component
import { useEffect } from 'react';
import { useRealTime } from '@/contexts/real-time-context';
import { useToast } from '@/hooks/use-toast';

export const TransactionNotifier = () => {
  const { lastMessage } = useRealTime();
  const { toast } = useToast();
  
  useEffect(() => {
    if (lastMessage && lastMessage.type === 'transaction_update') {
      const { transaction, previousStatus } = lastMessage.data;
      
      // Only show toast for status changes, not new transactions
      if (previousStatus && transaction.status !== previousStatus) {
        if (transaction.status === 'completed') {
          toast({
            title: 'Transaction Completed',
            description: `Your ${transaction.type} of ${transaction.amount} ${transaction.currency} has been confirmed.`,
            variant: 'success',
            duration: 5000
          });
        } else if (transaction.status === 'failed') {
          toast({
            title: 'Transaction Failed',
            description: `Your ${transaction.type} of ${transaction.amount} ${transaction.currency} has failed.`,
            variant: 'destructive',
            duration: 10000
          });
        }
      }
    }
  }, [lastMessage, toast]);
  
  // This component doesn't render anything
  return null;
};
```

### 8.6 Performance and Scalability

#### 8.6.1 Connection Management

The system implements efficient connection management:

- **Connection Limits**: Maximum 5 concurrent connections per user
- **Idle Timeout**: Connections inactive for 30 minutes are automatically closed
- **Load Balancing**: WebSocket connections are distributed across server instances
- **Graceful Degradation**: System falls back to polling when WebSockets unavailable

#### 8.6.2 Message Optimization

Messages are optimized for efficiency:

- **Payload Compression**: GZIP compression for large payloads
- **Batching**: Multiple events may be batched in high-volume scenarios
- **Selective Updates**: Smart filtering to avoid redundant messages
- **Throttling**: Rate limiting for high-frequency events (e.g., price updates)
- **Priority Queuing**: Critical messages (security, liquidation risks) prioritized

#### 8.6.3 Scaling Strategy

The real-time system is designed for horizontal scaling:

- **Redis Pub/Sub**: For distributing events across server instances
- **Session Affinity**: Ensures consistent connection routing
- **Monitoring**: Comprehensive metrics on connection count, message volume
- **Circuit Breakers**: Automatic protection against system overload
- **Graceful Shutdown**: Proper connection termination during deployments

### 8.7 Testing and Monitoring

#### 8.7.1 Connection Testing

WebSocket connections can be tested with the built-in diagnostic tool:

```
GET /api/v1/diagnostics/websocket
```

Which returns a testing page that verifies:
- WebSocket protocol support
- Connection establishment
- Authentication flow
- Message reception
- Reconnection behavior

#### 8.7.2 Performance Monitoring

The real-time system includes comprehensive monitoring:

- **Active Connections**: Count of currently active WebSocket connections
- **Message Rate**: Messages per second (inbound and outbound)
- **Latency**: Time from event generation to client delivery
- **Error Rate**: Failed connections and message deliveries
- **Reconnection Rate**: Frequency of connection drops and recoveries

#### 8.7.3 Health Checks

The system provides health check endpoints:

```
GET /api/v1/health/websocket
```

Returns:
```json
{
  "status": "healthy",
  "connections": {
    "current": 1250,
    "limit": 10000
  },
  "messageRate": {
    "inbound": 45.2,
    "outbound": 128.7
  },
  "averageLatency": 42,
  "uptime": "5d 12h 37m"
}
```

## 9. Payment Processing

NepaliPay implements a sophisticated payment processing system that bridges traditional fiat payment methods with blockchain-based cryptocurrency transactions. This system enables users to purchase NPT tokens using credit/debit cards and other fiat payment methods, with seamless conversion and delivery.

### 9.1 Payment Flow Architecture

#### 9.1.1 System Overview

The payment processing system follows a carefully designed flow:

```
[Frontend (React)] ──> [Backend API] ──> [Stripe API]
       ↑                    ↓               ↓
       └────────────────── [Backend] <─── [Webhook]
                               ↓
                        [Blockchain TX]
                               ↓
                        [User's Wallet]
```

This architecture ensures:

- **Security**: Sensitive payment details never touch NepaliPay servers
- **Compliance**: Full adherence to payment industry standards
- **Reliability**: Multi-step verification process
- **Transparency**: Complete traceability of funds

#### 9.1.2 Component Interaction

1. **Frontend Payment UI**: React components with Stripe Elements integration
2. **Backend Payment API**: Express routes for payment intent creation and verification
3. **Stripe Service**: External payment processing and card handling
4. **Webhook Handler**: Asynchronous payment event processing
5. **Blockchain Service**: Treasury management and token transfer
6. **Database Layer**: Transaction recording and state management

### 9.2 Stripe Integration

The application leverages Stripe's secure payment infrastructure for handling fiat currency transactions. This integration follows industry best practices and security standards.

#### 9.2.1 Integration Components

- **Stripe.js and Elements**: Client-side libraries for secure payment form rendering
- **Stripe API**: Server-side integration for payment processing
- **Stripe Dashboard**: Administrative interface for payment monitoring
- **Stripe Connect**: For marketplace functionality (if applicable)
- **Stripe Webhooks**: For asynchronous payment notifications

#### 9.2.2 Implementation Details

**Frontend Integration:**

```typescript
// src/pages/purchase.tsx
import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

// Initialize Stripe outside component to avoid recreation on renders
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CheckoutForm = ({ amount, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }
    
    setIsProcessing(true);
    setPaymentError(null);
    
    try {
      // Create payment intent on server
      const createIntentResponse = await apiRequest('POST', '/api/payments/create-intent', {
        amount: amount.toString(),
        currency: 'USD'
      });
      
      if (!createIntentResponse.ok) {
        throw new Error('Failed to create payment intent');
      }
      
      const { clientSecret } = await createIntentResponse.json();
      
      // Confirm payment with Stripe
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: 'NepaliPay User' // Ideally use actual user name
          }
        }
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      if (paymentIntent.status === 'succeeded') {
        // Verify payment on server and initiate token transfer
        const verifyResponse = await apiRequest('POST', '/api/payments/verify', {
          paymentId: paymentIntent.id
        });
        
        if (!verifyResponse.ok) {
          throw new Error('Payment verification failed');
        }
        
        const result = await verifyResponse.json();
        onSuccess(result.data.transaction);
      }
    } catch (error) {
      console.error('Payment error:', error);
      setPaymentError(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Card Details</label>
        <CardElement className="p-3 border rounded-md" />
      </div>
      
      {paymentError && (
        <div className="mb-4 p-2 bg-red-50 text-red-700 rounded-md text-sm">
          {paymentError}
        </div>
      )}
      
      <Button 
        type="submit" 
        disabled={!stripe || isProcessing}
        className="w-full"
      >
        {isProcessing ? 'Processing...' : `Pay $${amount.toFixed(2)}`}
      </Button>
    </form>
  );
};

const PurchasePage = () => {
  const [amount, setAmount] = useState(100);
  const [tokenEstimate, setTokenEstimate] = useState(0);
  const [rates, setRates] = useState(null);
  const [successTransaction, setSuccessTransaction] = useState(null);
  
  useEffect(() => {
    // Fetch current exchange rates
    apiRequest('GET', '/api/payments/exchange-rates')
      .then(res => res.json())
      .then(data => {
        setRates(data.data.rates);
        if (data.data.rates.USD) {
          setTokenEstimate(amount / data.data.rates.USD);
        }
      });
  }, []);
  
  const handleAmountChange = (e) => {
    const value = parseFloat(e.target.value);
    setAmount(value);
    if (rates?.USD) {
      setTokenEstimate(value / rates.USD);
    }
  };
  
  const handleSuccess = (transaction) => {
    setSuccessTransaction(transaction);
  };
  
  if (successTransaction) {
    return (
      <Card className="w-full max-w-md mx-auto mt-8">
        <CardHeader>
          <CardTitle>Purchase Successful!</CardTitle>
          <CardDescription>
            Your transaction has been processed. Your tokens will be transferred shortly.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Amount:</span>
              <span>{successTransaction.amount} NPT</span>
            </div>
            <div className="flex justify-between">
              <span>Status:</span>
              <span>{successTransaction.status}</span>
            </div>
            <div className="flex justify-between">
              <span>Transaction ID:</span>
              <span className="text-xs">{successTransaction.id}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={() => window.location.href = '/wallet'} className="w-full">
            Go to Wallet
          </Button>
        </CardFooter>
      </Card>
    );
  }
  
  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle>Purchase NPT Tokens</CardTitle>
        <CardDescription>
          Buy NPT tokens using your credit or debit card
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Amount (USD)</label>
          <input
            type="number"
            min="10"
            max="10000"
            value={amount}
            onChange={handleAmountChange}
            className="w-full p-2 border rounded-md"
          />
          <p className="mt-2 text-sm text-gray-600">
            You will receive approximately {tokenEstimate.toFixed(2)} NPT
          </p>
        </div>
        
        <Elements stripe={stripePromise}>
          <CheckoutForm amount={amount} onSuccess={handleSuccess} />
        </Elements>
      </CardContent>
    </Card>
  );
};

export default PurchasePage;
```

**Backend Implementation:**

```typescript
// server/services/stripe-service.ts
import Stripe from 'stripe';
import { storage } from '../storage';

// Initialize Stripe with API key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export class StripeService {
  /**
   * Create a payment intent for token purchase
   */
  async createPaymentIntent(amount: number, currency: string): Promise<Stripe.PaymentIntent> {
    // Calculate fees
    const baseFee = 0.02; // 2% service fee
    const gasEstimate = 0.5; // Estimated gas cost in USD
    
    // Calculate total amount in smallest currency unit (cents)
    const totalAmount = Math.round((amount * (1 + baseFee) + gasEstimate) * 100);
    
    // Create payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount,
      currency: currency.toLowerCase(),
      payment_method_types: ['card'],
      metadata: {
        tokenAmount: amount.toString(),
        serviceFee: (amount * baseFee).toString(),
        gasEstimate: gasEstimate.toString()
      }
    });
    
    return paymentIntent;
  }
  
  /**
   * Verify a payment was successful
   */
  async verifyPayment(paymentId: string): Promise<Stripe.PaymentIntent> {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentId);
    
    if (paymentIntent.status !== 'succeeded') {
      throw new Error(`Payment not successful. Status: ${paymentIntent.status}`);
    }
    
    return paymentIntent;
  }
  
  /**
   * Handle Stripe webhook events
   */
  async handleWebhook(
    signature: string,
    rawBody: Buffer
  ): Promise<{ type: string; data: any }> {
    try {
      // Verify webhook signature
      const event = stripe.webhooks.constructEvent(
        rawBody,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
      
      // Process the event
      switch (event.type) {
        case 'payment_intent.succeeded':
          await this.handlePaymentSuccess(event.data.object as Stripe.PaymentIntent);
          break;
          
        case 'payment_intent.payment_failed':
          await this.handlePaymentFailure(event.data.object as Stripe.PaymentIntent);
          break;
          
        // Handle other event types as needed
      }
      
      return { type: event.type, data: event.data.object };
    } catch (err) {
      console.error('Webhook error:', err);
      throw err;
    }
  }
  
  /**
   * Process successful payment
   */
  private async handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent): Promise<void> {
    // Find existing transaction by payment ID
    const transaction = await storage.getTransactionByStripePaymentId(paymentIntent.id);
    
    if (transaction) {
      // Update transaction if it exists
      if (transaction.status !== 'completed') {
        await storage.updateTransaction(transaction.id, {
          status: 'processing',
          // Additional fields as needed
        });
        
        // Trigger token transfer process
        // This would be implemented in a blockchain service
      }
    } else {
      // Create new transaction if it doesn't exist yet
      // This is a fallback in case the initial API process failed
      console.log('Creating transaction from webhook for payment:', paymentIntent.id);
      
      // Extract the original token amount from metadata
      const tokenAmount = parseFloat(paymentIntent.metadata.tokenAmount || '0');
      
      if (tokenAmount > 0) {
        // Create transaction record
        // This would need the user ID, which could be stored in the metadata
        // or retrieved through a customer lookup
      }
    }
  }
  
  /**
   * Process failed payment
   */
  private async handlePaymentFailure(paymentIntent: Stripe.PaymentIntent): Promise<void> {
    // Find and update transaction
    const transaction = await storage.getTransactionByStripePaymentId(paymentIntent.id);
    
    if (transaction) {
      await storage.updateTransaction(transaction.id, {
        status: 'failed',
        // Include failure reason if available
      });
    }
  }
}

export const stripeService = new StripeService();
```

**Webhook Handler:**

```typescript
// server/routes/payment-routes.ts (excerpt)
// Stripe webhook handler
app.post('/api/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const signature = req.headers['stripe-signature'] as string;
    
    if (!signature) {
      return res.status(400).send('Missing stripe-signature header');
    }
    
    // Process the webhook
    const result = await stripeService.handleWebhook(signature, req.body);
    
    res.json({ received: true, type: result.type });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
});
```

#### 9.2.3 Payment Flow Sequence

1. **Initiation**:
   - User selects token amount to purchase
   - Frontend calculates estimated NPT tokens based on current exchange rate
   - UI displays total cost including fees

2. **Payment Intent Creation**:
   - Backend creates Stripe PaymentIntent with appropriate metadata
   - Client secret returned to frontend
   - Exchange rate and fee information calculated and returned

3. **Card Processing**:
   - User enters card details in Stripe Elements form
   - Frontend submits payment confirmation to Stripe directly
   - Stripe processes payment with card issuer

4. **Payment Confirmation**:
   - Stripe returns payment result to frontend
   - Frontend verifies with backend
   - Backend records pending transaction

5. **Token Delivery**:
   - Backend initiates blockchain transaction from treasury wallet
   - Transaction status tracked and updated
   - User notified via UI and WebSocket updates

6. **Receipt Generation**:
   - Detailed receipt generated with transaction information
   - Receipt available for download or sent via email
   - Transaction recorded in user's history

### 9.3 Fee Structure

The payment system implements a transparent fee structure to cover operational costs and blockchain transaction fees.

#### 9.3.1 Fee Components

```
Total Payment = Token Cost + Service Fee + Gas Fee
```

Where:

- **Token Cost**: Base NPT token value based on current exchange rate
- **Service Fee**: 2% platform fee for operating costs
- **Gas Fee**: Estimated blockchain transaction costs (calculated in USD)

#### 9.3.2 Fee Calculation Example

```typescript
function calculateFees(tokenAmount: number, tokenUsdPrice: number) {
  // Get current gas price
  const currentGasPrice = 5; // Gwei (example value)
  const estimatedGas = 100000; // Gas units for token transfer
  
  // Convert gas price to USD (example calculation)
  const ethUsdPrice = 3000; // USD per ETH (example value)
  const gweiToEth = 1e-9; // Conversion factor
  const gasCostEth = currentGasPrice * estimatedGas * gweiToEth;
  const gasCostUsd = gasCostEth * ethUsdPrice;
  
  // Calculate token cost in USD
  const tokenCostUsd = tokenAmount * tokenUsdPrice;
  
  // Calculate service fee (2%)
  const serviceFeeUsd = tokenCostUsd * 0.02;
  
  // Calculate total
  const totalCostUsd = tokenCostUsd + serviceFeeUsd + gasCostUsd;
  
  return {
    tokenCost: tokenCostUsd,
    serviceFee: serviceFeeUsd,
    gasCost: gasCostUsd,
    totalCost: totalCostUsd
  };
}
```

#### 9.3.3 Dynamic Fee Adjustment

The system implements dynamic fee adjustment based on:

- **Network Congestion**: Gas price monitoring for blockchain networks
- **Transaction Volume**: Volume-based discounts for larger purchases
- **User Loyalty**: Reduced fees for users with high activity
- **Promotional Periods**: Special fee rates during marketing campaigns

### 9.4 Transfer Security

After a successful payment, the system securely transfers NPT tokens to the user's wallet using a controlled, transparent process.

#### 9.4.1 Treasury Management

The platform maintains a secure treasury system:

- **Treasury Wallet**: Secure multisig wallet holding pre-minted NPT tokens
- **Cold Storage**: Majority of funds held in cold storage for security
- **Hot Wallet**: Limited funds in hot wallet for automatic transfers
- **Balance Monitoring**: Automated alerts for low balance conditions
- **Audit Trail**: Comprehensive logging of all treasury movements

#### 9.4.2 Token Transfer Process

The "Transfer From Treasury" method follows these steps:

1. **Payment Verification**:
   - Payment confirmed by Stripe webhook
   - Transaction record created in database
   - User eligibility verified (KYC status, limits, etc.)

2. **Security Checks**:
   - Transaction validated against fraud detection rules
   - Treasury balance verified
   - Rate limits enforced to prevent abuse

3. **Blockchain Transaction**:
   ```typescript
   // Pseudo-code for token transfer process
   async function transferTokensFromTreasury(
     userWalletAddress: string,
     tokenAmount: number,
     paymentId: string
   ) {
     try {
       // Prepare transaction params
       const treasuryWallet = await loadTreasuryWallet();
       const tokenContract = new ethers.Contract(
         tokenContractAddress,
         tokenAbi,
         treasuryWallet
       );
       
       // Execute the transfer
       const tx = await tokenContract.transfer(userWalletAddress, 
         ethers.parseUnits(tokenAmount.toString(), 18)
       );
       
       // Wait for confirmation
       const receipt = await tx.wait(3); // Wait for 3 confirmations
       
       // Update database record with blockchain transaction hash
       await storage.updateTransaction(
         { stripePaymentId: paymentId },
         { 
           txHash: receipt.transactionHash,
           status: 'completed',
           completedAt: new Date()
         }
       );
       
       // Notify user through WebSocket
       notifyUser(userWalletAddress, {
         type: 'token_purchase_completed',
         amount: tokenAmount,
         txHash: receipt.transactionHash
       });
       
       return receipt.transactionHash;
     } catch (error) {
       console.error('Treasury transfer failed:', error);
       
       // Update transaction status
       await storage.updateTransaction(
         { stripePaymentId: paymentId },
         { 
           status: 'failed',
           failureReason: error.message
         }
       );
       
       // Initiate manual review process
       triggerManualReview(paymentId, error);
       
       throw error;
     }
   }
   ```

4. **Record Keeping**:
   - Blockchain transaction hash stored in database
   - Transaction receipt generated
   - Activity logged in user's history

5. **Error Handling**:
   - Automatic retry for failed transactions (up to 3 attempts)
   - Manual review process for persistent failures
   - User notification for delayed transactions
   - Refund process if delivery impossible

#### 9.4.3 Security Measures

The token transfer process incorporates several security features:

- **Multisignature Authorization**: Treasury transactions require multiple signatures for large amounts
- **Rate Limiting**: Maximum transaction frequency and volume limits
- **Anomaly Detection**: AI-based detection of unusual transfer patterns
- **Transaction Monitoring**: Real-time monitoring of all blockchain transactions
- **Address Verification**: Validation of recipient address format and history

### 9.5 Payment Analytics

The platform collects and analyzes payment data to optimize operations and detect issues:

#### 9.5.1 Key Metrics

- **Conversion Rate**: Percentage of initiated payments that complete successfully
- **Average Purchase Amount**: Mean token purchase value
- **Fee Revenue**: Income from service fees
- **Geographic Distribution**: Payment origins by country/region
- **Payment Method Usage**: Distribution across different card types
- **Failure Analysis**: Categorized reasons for payment failures

#### 9.5.2 Reporting Dashboard

The payment analytics dashboard provides:

- **Real-time Monitoring**: Live view of payment activity
- **Trend Analysis**: Historical patterns and projections
- **Anomaly Detection**: Highlighting unusual payment activity
- **User Segmentation**: Analysis by user characteristics
- **Performance Optimization**: Insights for improving conversion

### 9.6 Compliance and Regulation

The payment processing system is designed to comply with relevant financial regulations:

#### 9.6.1 Regulatory Frameworks

- **PCI DSS**: Payment Card Industry Data Security Standard compliance
- **AML**: Anti-Money Laundering procedures
- **KYC**: Know Your Customer verification process
- **GDPR/CCPA**: Data privacy compliance
- **Local Regulations**: Country-specific financial rules

#### 9.6.2 Compliance Measures

- **Transaction Limits**: Enforced maximum purchase amounts
- **Suspicious Activity Reporting**: Detection and reporting of unusual patterns
- **Records Retention**: Secure storage of transaction history
- **Audit Trail**: Comprehensive logging for compliance verification
- **User Verification**: Tiered KYC requirements based on transaction volume

## 10. Collateral and Loan System

NepaliPay's collateralized lending system enables users to access liquidity while maintaining exposure to their cryptocurrency assets. This feature allows users to borrow NPT tokens by using their cryptocurrency holdings as collateral, without needing to sell their digital assets.

### 10.1 System Architecture

#### 10.1.1 Component Overview

The collateral and loan system consists of several integrated components:

- **Collateral Management**: Handles the locking and monitoring of collateral assets
- **Loan Calculation Engine**: Determines loan eligibility, amounts, and terms
- **Price Oracle**: Provides real-time cryptocurrency price data
- **Risk Management System**: Monitors health of loans and triggers liquidations
- **Smart Contract Integration**: Manages on-chain collateral locking and releases
- **User Interface**: Provides intuitive controls for loan application and management

#### 10.1.2 System Flow

```
                  ┌───────────────┐
                  │  User Wallet  │
                  └───────┬───────┘
                          │ 
                          ▼
┌──────────────┐   ┌───────────────┐   ┌───────────────┐
│  Collateral  │◄──┤  Loan Portal  │──►│ Price Oracle  │
│  Management  │   └───────┬───────┘   └───────────────┘
└──────┬───────┘           │                    ▲
       │                   ▼                    │
       │          ┌───────────────┐             │
       └─────────►│  Risk Monitor │─────────────┘
                  └───────┬───────┘
                          │
                          ▼
                  ┌───────────────┐
                  │ Loan Database │
                  └───────────────┘
```

### 10.2 Supported Collateral Assets

The system accepts multiple cryptocurrency assets as collateral, each with specific parameters based on liquidity, volatility, and market conditions.

#### 10.2.1 Asset Parameters

| Asset | Base LTV | Liquidation Threshold | Min. Collateral | Max. Loan Duration | Interest Rate Range |
|-------|----------|----------------------|-----------------|-------------------|-------------------|
| BNB   | 75%      | 82.5%                | 0.5 BNB         | 90 days           | 5-8% APR          |
| ETH   | 70%      | 77.5%                | 0.1 ETH         | 90 days           | 5-8% APR          |
| BTC   | 65-80%*  | 72.5-87.5%*          | 0.01 BTC        | 90 days           | 5-8% APR          |

*Varies based on market conditions and volatility

#### 10.2.2 Dynamic LTV Adjustment

The system implements a dynamic Loan-to-Value (LTV) adjustment mechanism that responds to market conditions:

```typescript
// Dynamic LTV calculation
function calculateDynamicLTV(
  assetType: 'BNB' | 'ETH' | 'BTC',
  baseVolatility: number
): number {
  // Current market volatility index (higher = more volatile)
  const currentVolatility = getCurrentMarketVolatility(assetType);
  
  // Base LTV for the asset
  const baseLTV = getBaseLTV(assetType);
  
  // Volatility adjustment factor (reduces LTV as volatility increases)
  const volatilityFactor = Math.max(0, 1 - (currentVolatility / baseVolatility - 1) * 2);
  
  // Apply adjustment (limited to a maximum reduction of 15%)
  const adjustedLTV = baseLTV * Math.max(0.85, volatilityFactor);
  
  // Round to nearest 0.5%
  return Math.round(adjustedLTV * 200) / 200;
}
```

#### 10.2.3 Asset Risk Profiles

Each supported asset has a comprehensive risk profile that influences its loan parameters:

- **BNB (Binance Coin)**:
  - **Risk Category**: Medium
  - **Market Capitalization**: Top 5 cryptocurrency
  - **Liquidity**: High on BSC, moderate on other chains
  - **Advantages**: Native token of BSC with high utility
  - **Risk Factors**: Regulatory concerns, exchange-related risk

- **ETH (Ethereum)**:
  - **Risk Category**: Low-Medium
  - **Market Capitalization**: Top 2 cryptocurrency
  - **Liquidity**: Very high across most platforms
  - **Advantages**: Industry standard with broad adoption
  - **Risk Factors**: Network congestion, transition risks (PoW to PoS)

- **BTC (Bitcoin)**:
  - **Risk Category**: Low
  - **Market Capitalization**: Largest cryptocurrency
  - **Liquidity**: Extremely high globally
  - **Advantages**: "Digital gold" status, strongest brand recognition
  - **Risk Factors**: Regulatory pressure, slower technological evolution

### 10.3 Loan Process

The loan process follows a clearly defined sequence of steps, designed to ensure security, transparency, and usability.

#### 10.3.1 Loan Application Flow

1. **Asset Selection and Deposit**:
   - User selects asset type (BNB, ETH, BTC) to use as collateral
   - System generates a unique collateral deposit address
   - User transfers crypto to the designated deposit address
   - System monitors blockchain for confirmation
   - Upon confirmation, collateral status updates to "received"

2. **Loan Configuration**:
   - System calculates maximum loan amount based on current asset value and LTV ratio
   - User specifies desired loan amount (must be below maximum)
   - User selects loan duration (7, 14, 30, 60, or 90 days)
   - System calculates interest based on amount, duration, and current rates
   - Complete loan terms are displayed for user review

3. **Loan Application Review**:
   ```typescript
   // Loan application validation
   function validateLoanApplication(application: LoanApplication): ValidationResult {
     // Validate user is eligible for loans
     if (!isUserEligible(application.userId)) {
       return { valid: false, reason: 'USER_NOT_ELIGIBLE' };
     }
     
     // Validate KYC status
     const user = await getUserById(application.userId);
     if (user.kycStatus !== 'verified') {
       return { valid: false, reason: 'KYC_REQUIRED' };
     }
     
     // Get collateral current value
     const collateral = await getCollateral(application.collateralId);
     const currentValue = await getPriceOracle().getUsdValue(
       collateral.assetType,
       collateral.amount
     );
     
     // Validate collateral value is sufficient
     const ltv = getLoanToValue(collateral.assetType);
     const maxLoanAmount = currentValue * ltv;
     
     if (application.loanAmount > maxLoanAmount) {
       return { 
         valid: false, 
         reason: 'LOAN_EXCEEDS_MAX',
         maxAmount: maxLoanAmount
       };
     }
     
     // Validate against user limits
     const userActiveLoans = await getUserActiveLoans(application.userId);
     const totalBorrowed = userActiveLoans.reduce(
       (sum, loan) => sum + loan.amount, 
       0
     );
     
     const userBorrowLimit = getUserBorrowLimit(user);
     if (totalBorrowed + application.loanAmount > userBorrowLimit) {
       return {
         valid: false,
         reason: 'USER_LIMIT_EXCEEDED',
         remainingLimit: Math.max(0, userBorrowLimit - totalBorrowed)
       };
     }
     
     return { valid: true };
   }
   ```

4. **Loan Approval and Issuance**:
   - Automated approval for loans meeting all criteria
   - NPT tokens transferred to user's wallet from platform treasury
   - Loan status updated to "active"
   - Loan details recorded on blockchain for transparency
   - Confirmation notification sent to user via app and email

#### 10.3.2 Loan Terms and Conditions

- **Interest Calculation**: Simple interest calculated up-front based on full term
  ```
  Interest = Principal × Rate × (Term / 365)
  ```

- **Early Repayment**: Partial interest rebate for early full repayment
  ```
  Rebate = Interest × (1 - DaysElapsed / TotalDays) × 0.5
  ```

- **Extension Options**: Loans can be extended once by up to 50% of the original term with additional interest

- **Minimum/Maximum Amounts**:
  - Minimum loan: 100 NPT
  - Maximum loan: 100,000 NPT (or equivalent to $20,000 USD, whichever is lower)

#### 10.3.3 Loan Management Features

- **Loan Dashboard**: Unified view of all active loans with health metrics
- **Repayment Options**: Full or partial repayments with clear instructions
- **Collateral Management**: Option to add additional collateral to improve loan health
- **Notification System**: Automated alerts for important loan events
- **Historical View**: Complete loan history with all associated transactions

### 10.4 Repayment Process

The repayment system is designed to be flexible and user-friendly, allowing various repayment options.

#### 10.4.1 Repayment Methods

1. **Full Repayment**:
   - User initiates full repayment from loan management screen
   - System calculates total repayment amount (principal + interest)
   - User approves the transfer of NPT tokens
   - System processes repayment and updates loan status to "repaid"
   - Collateral release process is initiated automatically

2. **Partial Repayment**:
   - User specifies amount to repay (must be at least 10% of outstanding balance)
   - System applies payment first to interest, then to principal
   - Loan health metrics are updated to reflect new balance
   - Partial collateral release is not available for partial repayments

3. **Automatic Repayment**:
   - Users can opt-in to automatic repayment scheduling
   - System automatically deducts repayment amount on schedule
   - Email confirmation sent for each automatic payment
   - Automatic repayments can be paused or canceled at any time

#### 10.4.2 Collateral Release

Upon full repayment, the system automatically processes the collateral release:

1. **Release Initiation**:
   - System confirms loan is fully repaid
   - Collateral status updated to "releasing"

2. **Blockchain Transaction**:
   - System prepares transaction to return collateral to user's wallet
   - Transaction signed by platform's multisig wallet
   - Transaction submitted to blockchain with appropriate gas price

3. **Confirmation Process**:
   - System monitors blockchain for transaction confirmation
   - Upon confirmation, collateral status updated to "released"
   - User notified of successful collateral return

4. **Failed Release Handling**:
   - Automated retry for failed transactions (up to 3 attempts)
   - If all automated attempts fail, case escalated to manual review
   - Support team contacts user to resolve the issue

### 10.5 Liquidation Process

The liquidation process protects the platform from losses when collateral value falls below critical thresholds.

#### 10.5.1 Health Factor Calculation

Every loan has a real-time health factor calculated as:

```
Health Factor = Collateral Value × Liquidation Threshold ÷ Loan Value
```

Where:
- Health Factor > 1.0: Loan is healthy
- Health Factor = 1.0: Liquidation threshold exactly reached
- Health Factor < 1.0: Loan is eligible for liquidation

```typescript
// Health factor calculation
function calculateHealthFactor(loan: Loan, collateral: Collateral): number {
  // Get current USD value of collateral
  const collateralValue = getPriceOracle().getUsdValue(
    collateral.assetType,
    collateral.amount
  );
  
  // Get liquidation threshold percentage for this asset
  const liquidationThreshold = getLiquidationThreshold(collateral.assetType);
  
  // Calculate maximum loan value before liquidation
  const maxLoanValue = collateralValue * liquidationThreshold;
  
  // Calculate health factor
  const healthFactor = maxLoanValue / loan.outstandingAmount;
  
  return healthFactor;
}
```

#### 10.5.2 Risk Monitoring

The risk monitoring system continuously tracks all active loans:

1. **Regular Health Checks**:
   - All loans evaluated every 15 minutes
   - Price updates from multiple oracles with outlier detection
   - Health factors updated and stored in database

2. **Warning System**:
   - Health Factor < 1.3: "Low Health" warning
   - Health Factor < 1.15: "Critical Health" warning
   - Notifications sent via app, email, and SMS

3. **Market Volatility Response**:
   - Monitoring frequency increases during high market volatility
   - Checks every 5 minutes when market moves >5% in 1 hour
   - Management alerts for unusual market conditions

#### 10.5.3 Liquidation Execution

When a loan becomes eligible for liquidation:

1. **Pre-Liquidation Grace Period**:
   - 12-hour grace period for loans with Health Factor between 0.95 and 1.0
   - Urgent notifications sent to user with clear instructions
   - Option to add collateral or make partial repayment
   - No grace period for Health Factor < 0.95 or during extreme market volatility

2. **Liquidation Process**:
   ```typescript
   // Liquidation process
   async function processLiquidation(loanId: number): Promise<LiquidationResult> {
     // Get loan and collateral details
     const loan = await getLoanById(loanId);
     const collateral = await getCollateralById(loan.collateralId);
     
     // Verify liquidation is necessary
     const healthFactor = await calculateHealthFactor(loan, collateral);
     if (healthFactor >= 1.0) {
       return { success: false, reason: 'LOAN_HEALTHY' };
     }
     
     // Update loan and collateral status
     await updateLoanStatus(loanId, 'liquidating');
     await updateCollateralStatus(collateral.id, 'liquidating');
     
     try {
       // Transfer collateral to liquidation wallet
       const txHash = await transferCollateralToLiquidationWallet(
         collateral.assetType,
         collateral.amount
       );
       
       // Record liquidation transaction
       await createLiquidationRecord({
         loanId,
         collateralId: collateral.id,
         healthFactor,
         outstandingAmount: loan.outstandingAmount,
         collateralValue: collateral.valueUsd,
         liquidationTxHash: txHash,
         timestamp: new Date()
       });
       
       // Update loan status to liquidated
       await updateLoanStatus(loanId, 'liquidated');
       await updateCollateralStatus(collateral.id, 'liquidated');
       
       // Notify user of liquidation
       await notifyUser(loan.userId, 'loan_liquidated', {
         loanId,
         collateralType: collateral.assetType,
         collateralAmount: collateral.amount
       });
       
       return { success: true, txHash };
     } catch (error) {
       // Handle failure
       console.error('Liquidation failed:', error);
       await updateLoanStatus(loanId, 'liquidation_failed');
       
       // Escalate to manual handling
       await createManualLiquidationTask(loanId);
       
       return { success: false, reason: 'LIQUIDATION_FAILED', error };
     }
   }
   ```

3. **Collateral Sale**:
   - Liquidated collateral sold through partner exchanges
   - Market orders executed in tranches to minimize slippage
   - Sale proceeds used to repay loan principal and liquidation fees
   - Any surplus returned to user's wallet
   - Transaction records maintained for transparency

4. **Post-Liquidation**:
   - Detailed liquidation report provided to user
   - Loan marked as "liquidated" in system
   - User remains eligible for future loans unless fraudulent activity detected

#### 10.5.4 Liquidation Fee Structure

Liquidation includes the following fees:

| Component | Percentage | Description |
|-----------|------------|-------------|
| Base Liquidation Fee | 5% | Platform fee for processing liquidation |
| Exchange Fee | 0.1-0.5% | Fee charged by exchange partners |
| Market Impact | Variable | Cost of executing market sale |
| Gas Costs | Variable | Blockchain transaction fees |

### 10.6 Risk Management

The platform implements a comprehensive risk management strategy to ensure the stability and security of the lending system.

#### 10.6.1 Collateral Risk Parameters

Each collateral asset has defined risk parameters that are regularly reviewed and updated:

- **Base LTV Ratio**: Starting point for loan calculations
- **Liquidation Threshold**: Value that triggers liquidation process
- **Liquidation Penalty**: Additional fee applied during liquidation
- **Utilization Cap**: Maximum percentage of treasury that can be loaned against each asset
- **Minimum Collateral Size**: Smallest acceptable collateral amount

#### 10.6.2 Oracle Security

To prevent price manipulation attacks:

- **Multi-Oracle Architecture**: Prices aggregated from at least 3 independent sources
- **Time-Weighted Average Price (TWAP)**: Used for particularly volatile assets
- **Deviation Thresholds**: Large price movements trigger additional verification
- **Fallback Mechanisms**: Alternative data sources when primary oracles fail
- **Oracle Guard**: Monitoring system to detect and respond to oracle attacks

#### 10.6.3 Treasury Risk Management

The loan system's treasury implements safeguards:

- **Diversification**: Maximum 30% of treasury allocated to lending
- **Asset Caps**: Limits on total loans for each collateral type
- **Circuit Breakers**: Automatic lending pause during extreme market events
- **Reserve Ratio**: Minimum 20% of tokens held in reserve for loan redemptions
- **Stress Testing**: Regular simulations of market crashes and liquidity crises

#### 10.6.4 Smart Contract Safeguards

Smart contracts include multiple safety mechanisms:

- **Emergency Pause**: Ability to halt all lending functions
- **Upgradability**: Proxy pattern allowing contract improvements
- **Access Control**: Multi-level authorization for administrative functions
- **Global Parameters**: Adjustable risk parameters with time-locked changes
- **Event Monitoring**: Comprehensive logging for off-chain monitoring

### 10.7 Analytics and Reporting

The collateral and loan system includes robust analytics capabilities to monitor performance and identify trends.

#### 10.7.1 Key Performance Indicators

- **Total Value Locked (TVL)**: Sum of all collateral value
- **Outstanding Loan Value**: Total value of active loans
- **Utilization Rate**: Percentage of maximum lending capacity currently used
- **Average Loan Size**: Mean value of active loans
- **Liquidation Rate**: Percentage of loans ending in liquidation
- **Profit Metrics**: Interest income, liquidation fee income, etc.

#### 10.7.2 Reporting System

- **Daily Reports**: Automated summary of lending activity
- **Weekly Risk Analysis**: Detailed review of portfolio health
- **Monthly Performance Review**: Comprehensive analysis with recommendations
- **Custom Reports**: On-demand reporting for specific analysis needs

#### 10.7.3 Borrower Analytics

- **Borrower Segments**: Classification based on behavior and patterns
- **Retention Analysis**: Study of repeat borrowing patterns
- **Risk Scoring**: Proprietary algorithm to assess borrower reliability
- **Default Prediction**: Machine learning models to identify high-risk loans

### 10.8 User Experience Design

The loan system is designed to be intuitive and accessible, even for users new to collateralized lending.

#### 10.8.1 Key Interface Elements

- **Loan Calculator**: Interactive tool to explore different loan scenarios
- **Health Indicator**: Visual representation of loan health status
- **Collateral Value Chart**: Historical value of collateral assets
- **Repayment Planner**: Tool to schedule and optimize repayments
- **Notification Center**: Centralized hub for all loan-related alerts

#### 10.8.2 User Education

- **Guided First Loan**: Step-by-step assistance for first-time borrowers
- **Risk Explanation**: Clear descriptions of liquidation risks
- **Video Tutorials**: Visual guides for each loan process
- **Knowledge Base**: Comprehensive articles on lending concepts
- **Loan Simulator**: Practice tool without actual financial risk

## 11. Security Measures

Security is a foundational priority for NepaliPay, with comprehensive measures implemented across all components of the system. The platform employs a defense-in-depth approach, ensuring multiple layers of protection for user funds, data, and transactions.

### 11.1 Security Architecture Overview

#### 11.1.1 Security Principles

NepaliPay's security architecture is guided by the following core principles:

1. **Defense in Depth**: Multiple security layers to prevent single points of failure
2. **Principle of Least Privilege**: Entities have only the access rights necessary for their function
3. **Secure by Default**: Security enabled from the start; insecure options require explicit activation
4. **Security by Design**: Security integrated into system architecture from the beginning
5. **Continuous Improvement**: Regular assessment and enhancement of security measures
6. **Privacy by Design**: Data protection built into system functionality

#### 11.1.2 Security Framework

The platform implements a comprehensive security framework addressing all aspects of the application:

```
┌───────────────────────────────────────────────────────────────┐
│                      External Security Layer                   │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │   Network and   │  │ Infrastructure  │  │   Operational   │ │
│  │ Perimeter Sec.  │  │    Security     │  │    Security     │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
├───────────────────────────────────────────────────────────────┤
│                 Application Security Layer                     │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │  Authentication │  │   Application   │  │      Data       │ │
│  │   & Identity    │  │     Logic       │  │    Security     │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
├───────────────────────────────────────────────────────────────┤
│                    Blockchain Security Layer                   │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │ Smart Contract  │  │    Wallet &     │  │  Transaction    │ │
│  │    Security     │  │   Key Security  │  │    Security     │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
└───────────────────────────────────────────────────────────────┘
```

#### 11.1.3 Security Team Structure

NepaliPay maintains a dedicated security team with specialized roles:

- **Security Architect**: Designs and maintains security architecture
- **Security Engineers**: Implement and maintain security controls
- **Security Analysts**: Monitor threats and respond to incidents
- **Penetration Testers**: Regularly test system for vulnerabilities
- **Security Compliance Officer**: Ensures regulatory compliance
- **Blockchain Security Specialist**: Focuses on blockchain-specific security

### 11.2 Authentication and Identity Security

#### 11.2.1 Password Security

NepaliPay implements state-of-the-art password security practices:

- **Hashing Algorithm**: Scrypt with unique salt per user
  ```typescript
  // Password hashing implementation
  async function hashPassword(password: string): Promise<string> {
    // Generate a random salt (16 bytes converted to hex = 32 characters)
    const salt = randomBytes(16).toString('hex');
    
    // Use scrypt with:
    // - N=32768 (CPU/memory cost)
    // - r=8 (block size)
    // - p=1 (parallelization)
    // - keylen=64 (output bytes)
    const derivedKey = await scryptAsync(
      password, 
      salt, 
      64, 
      { N: 32768, r: 8, p: 1 }
    ) as Buffer;
    
    // Return the hex-encoded derived key concatenated with the salt
    return `${derivedKey.toString('hex')}.${salt}`;
  }
  
  // Password verification
  async function verifyPassword(
    inputPassword: string, 
    storedPassword: string
  ): Promise<boolean> {
    // Split stored password into hash and salt
    const [storedHash, salt] = storedPassword.split('.');
    
    if (!storedHash || !salt) {
      // Invalid stored password format
      return false;
    }
    
    // Hash the input password with the same salt
    const derivedKey = await scryptAsync(
      inputPassword, 
      salt, 
      64, 
      { N: 32768, r: 8, p: 1 }
    ) as Buffer;
    
    // Compare hashes using constant-time comparison
    return timingSafeEqual(
      Buffer.from(storedHash, 'hex'),
      derivedKey
    );
  }
  ```

- **Password Policy**:
  - Minimum 10 characters
  - Required combination of uppercase, lowercase, numbers, and symbols
  - Password strength estimation with zxcvbn
  - Password history verification (no reuse of last 5 passwords)
  - Maximum password age of 90 days
  - Compromised password check against breach databases

- **Storage Security**:
  - Hashed passwords only, never plaintext
  - Separate credential database with additional security
  - Monitoring for suspicious credential access

#### 11.2.2 Multi-Factor Authentication

The platform offers multiple MFA options:

- **Time-based One-Time Password (TOTP)**:
  - Google Authenticator, Authy compatibility
  - Secure key provisioning with QR codes
  - Backup codes for account recovery

- **SMS Verification**:
  - Secondary authentication channel
  - Rate limiting to prevent SMS flooding
  - Fraud monitoring for suspicious verification attempts

- **Email Verification**:
  - Secure, unique links for verification
  - Limited validity period (10 minutes)
  - Single-use verification tokens

- **Risk-based Authentication**:
  - Adaptive MFA based on risk factors
  - Additional verification for unusual login patterns
  - Device fingerprinting for consistency checking

- **WebAuthn / FIDO2 Support**:
  - Support for hardware security keys
  - Biometric authentication options
  - Phishing-resistant authentication

#### 11.2.3 Session Management

Secure session handling with the following features:

- **Session Identifiers**:
  - Cryptographically secure random generation
  - Sufficient length (128 bits minimum)
  - Secure storage in HTTP-only cookies
  - Secure and SameSite cookie flags

- **Session Security**:
  ```typescript
  // Session configuration
  const sessionConfig: session.SessionOptions = {
    secret: process.env.SESSION_SECRET!,
    name: 'nepalipay_sid',
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
    store: new SessionStore({
      // Database connection for session storage
      // Automatic cleanup of expired sessions
    }),
    resave: false,
    saveUninitialized: false,
    unset: 'destroy',
  };
  ```

- **Session Lifecycle**:
  - Maximum session duration of 24 hours
  - Automatic extension with activity
  - Idle timeout after 30 minutes of inactivity
  - Complete session termination on logout

- **Session Compromise Protection**:
  - IP binding for high-value operations
  - User agent consistency checking
  - Session regeneration after privileged actions
  - Concurrent session detection and management

#### 11.2.4 Access Control System

Comprehensive role-based access control (RBAC) system:

- **Role Hierarchy**:
  - User: Base access to personal account features
  - Admin: System management capabilities
  - SuperAdmin: Complete system control
  - Custom roles for specific needs

- **Permission Framework**:
  ```typescript
  // Permission check middleware
  function requirePermission(permission: string) {
    return (req: Request, res: Response, next: NextFunction) => {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: 'Unauthenticated' });
      }
      
      const user = req.user as UserWithRoles;
      
      // Get all permissions for user's roles
      const userPermissions = getRolePermissions(user.roles);
      
      if (userPermissions.includes(permission)) {
        return next();
      }
      
      // Log unauthorized access attempt
      logger.warn('Unauthorized access attempt', {
        userId: user.id,
        permission,
        path: req.path,
      });
      
      return res.status(403).json({ error: 'Unauthorized' });
    };
  }
  ```

- **Least Privilege Implementation**:
  - Granular permissions for specific actions
  - Regular privilege auditing
  - Just-in-time access for sensitive operations
  - Automatic privilege expiration

- **Administrative Access**:
  - Separate authentication flow for admin portal
  - Multi-factor authentication requirement
  - Comprehensive action logging
  - Four-eyes principle for critical operations

#### 11.2.5 Authentication API Security

The authentication API endpoints implement additional security measures:

- **Rate Limiting**:
  ```typescript
  // Rate limiting middleware for login attempts
  const loginRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts per IP per 15 minutes
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true,
    keyGenerator: (req) => {
      // Use username + IP as the key to prevent username enumeration
      return `${req.body.username}_${req.ip}`;
    },
    handler: (req, res) => {
      logger.warn('Rate limit exceeded for login', {
        ip: req.ip,
        username: req.body.username,
      });
      
      res.status(429).json({
        error: 'Too many login attempts. Please try again later.',
        retryAfter: Math.ceil(15 * 60 / 60), // minutes
      });
    },
  });
  ```

- **Brute Force Protection**:
  - Progressive delays after failed attempts
  - Account lockout after multiple failures
  - Notification to user on suspicious activity
  - CAPTCHA for unrecognized devices

- **Login Anomaly Detection**:
  - Location-based anomaly detection
  - Time-pattern analysis
  - Device fingerprinting for consistency
  - Behavioral biometrics (typing patterns, mouse movements)

### 11.3 Transaction Security

#### 11.3.1 Blockchain Transaction Security

The platform implements multiple layers of security for blockchain transactions:

- **Transaction Signing**:
  - Multiple signature requirements for high-value transactions
  - Hardware security module (HSM) for treasury wallet
  - Threshold signature scheme for critical operations
  - Air-gapped signing for system wallets

- **Transaction Verification**:
  ```typescript
  // Transaction verification process
  async function verifyTransaction(tx: Transaction): Promise<VerificationResult> {
    // Validate transaction parameters
    if (!isValidAddress(tx.receiverAddress)) {
      return { valid: false, reason: 'INVALID_ADDRESS' };
    }
    
    if (tx.amount <= 0) {
      return { valid: false, reason: 'INVALID_AMOUNT' };
    }
    
    // Check user balance
    const userBalance = await getWalletBalance(tx.userId, tx.currency);
    if (userBalance < tx.amount) {
      return { valid: false, reason: 'INSUFFICIENT_BALANCE' };
    }
    
    // Check transaction limits
    const dailyLimit = getUserDailyLimit(tx.userId, tx.currency);
    const dailyUsed = await getUserDailyTransactionTotal(tx.userId, tx.currency);
    
    if (dailyUsed + tx.amount > dailyLimit) {
      return { 
        valid: false, 
        reason: 'DAILY_LIMIT_EXCEEDED',
        remaining: Math.max(0, dailyLimit - dailyUsed)
      };
    }
    
    // Check recipient address blacklist
    if (await isBlacklistedAddress(tx.receiverAddress)) {
      return { valid: false, reason: 'BLACKLISTED_ADDRESS' };
    }
    
    // Check additional risk factors
    const riskScore = await calculateTransactionRisk(tx);
    if (riskScore > HIGH_RISK_THRESHOLD) {
      return { 
        valid: false, 
        reason: 'HIGH_RISK_TRANSACTION',
        requiresApproval: true
      };
    }
    
    return { valid: true };
  }
  ```

- **Transaction Monitoring**:
  - Real-time transaction surveillance
  - Pattern matching against known fraud schemes
  - Unusual transaction detection
  - Machine learning anomaly detection
  - Blockchain analytics integration

- **Approval Workflows**:
  - Progressive authorization levels based on amount
  - Multi-party approval for large transactions
  - Time-locks for settlement of high-value transfers
  - Whitelisted recipient addresses

#### 11.3.2 Fraud Prevention

Advanced fraud detection and prevention mechanisms:

- **Risk Scoring System**:
  - User behavioral baseline establishment
  - Transaction velocity monitoring
  - Pattern recognition for fraud indicators
  - IP geolocation analysis
  - Device consistency checking

- **Anti-Money Laundering (AML) Controls**:
  - Transaction amount monitoring
  - Suspicious activity reporting
  - Customer due diligence processes
  - Ongoing transaction monitoring
  - Integration with AML databases

- **Behavioral Analysis**:
  - User interaction patterns
  - Transaction timing and frequency
  - Typical transaction amounts
  - Common recipients
  - Device and location consistency

- **Real-time Prevention**:
  - Transaction blocking for high-risk activities
  - Step-up authentication for suspicious transactions
  - Temporary account restrictions for unusual activity
  - Manual review process for flagged transactions

### 11.4 Smart Contract Security

#### 11.4.1 Contract Development Security

Rigorous security practices in contract development:

- **Secure Development Lifecycle**:
  - Security requirements definition
  - Threat modeling
  - Secure coding standards
  - Static analysis tools integration
  - Manual code review
  - Security testing

- **Code Quality Standards**:
  - Comprehensive test coverage (>95%)
  - Solidity style guide conformance
  - Modular design with clear separation of concerns
  - Minimal external dependencies
  - Extensive documentation

- **Security Tools Integration**:
  - Slither
  - MythX
  - Echidna
  - Manticore
  - Securify

#### 11.4.2 Contract Auditing

Multiple layers of contract verification:

- **Internal Audit Process**:
  - Initial developer review
  - Secondary team review
  - Full system integration testing
  - Economic attack vector analysis

- **External Audits**:
  - Comprehensive audit by established security firms
  - Published audit reports with findings
  - Public bug bounty program
  - Time-locked deployment after audit

- **Ongoing Security Assessment**:
  - Continuous monitoring for new vulnerability types
  - Regular re-auditing with updated tools
  - External security researcher engagement
  - Formal verification for critical components

#### 11.4.3 Contract Security Features

Smart contracts incorporate multiple security mechanisms:

- **Access Control Systems**:
  ```solidity
  // OpenZeppelin AccessControl integration
  import "@openzeppelin/contracts/access/AccessControl.sol";
  
  contract SecureContract is AccessControl {
      bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
      bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");
      bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");
      
      constructor() {
          _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
          _setupRole(ADMIN_ROLE, msg.sender);
      }
      
      modifier onlyAdmin() {
          require(hasRole(ADMIN_ROLE, msg.sender), "Restricted to admins");
          _;
      }
      
      modifier onlyOperator() {
          require(hasRole(OPERATOR_ROLE, msg.sender), "Restricted to operators");
          _;
      }
      
      // Function to grant roles securely
      function grantOperatorRole(address account) external onlyAdmin {
          grantRole(OPERATOR_ROLE, account);
      }
  }
  ```

- **Emergency Controls**:
  - Circuit breaker pattern for critical functions
  - Time-locked execution for significant changes
  - Fallback mechanisms for emergency situations
  - Tiered control system for different risk levels

- **Secure Update Mechanisms**:
  - Proxy pattern for upgradeable contracts
  - Time-locked upgrades
  - Multi-signature upgrade authorization
  - Transparent upgrade process

#### 11.4.4 Contract Monitoring

Continuous monitoring of deployed contracts:

- **Event Monitoring**:
  - Real-time tracking of contract events
  - Anomaly detection for unusual activity
  - Integration with alert systems
  - Automated response for specific events

- **On-chain Metrics**:
  - Gas usage tracking
  - Function call frequency analysis
  - Value flow monitoring
  - Error rate tracking

- **Health Checks**:
  - Regular contract state validation
  - Balance reconciliation
  - Permission integrity verification
  - External oracle data validation

### 11.5 Data Security

#### 11.5.1 Data Protection Architecture

Comprehensive protection of user and system data:

- **Data Classification**:
  - Public: General information (token prices, network status)
  - Internal: System operational data (logs, metrics)
  - Confidential: User account information (email, activity)
  - Restricted: Sensitive financial data (balances, transactions)
  - Critical: Authentication and encryption keys

- **Encryption Strategy**:
  - Data-at-rest encryption for databases
  - End-to-end encryption for sensitive communications
  - Transport layer security for all connections
  - Field-level encryption for PII and financial data

- **Key Management**:
  - Hardware security modules for critical keys
  - Key rotation schedules
  - Split-knowledge procedures
  - Secure key derivation for user-based encryption

#### 11.5.2 Database Security

Multiple layers of database protection:

- **Access Controls**:
  - Principle of least privilege for database accounts
  - Role-based access with fine-grained permissions
  - Connection encryption requirements
  - Database activity monitoring

- **Query Security**:
  ```typescript
  // Secure database query with parameterization
  async function getUserByEmail(email: string): Promise<User | null> {
    try {
      // Use parameterized query to prevent SQL injection
      const result = await db.query(
        `SELECT * FROM users WHERE email = $1 LIMIT 1`,
        [email.toLowerCase()]
      );
      
      return result.rows[0] || null;
    } catch (error) {
      logger.error('Database error in getUserByEmail', { error });
      throw new Error('Database error occurred');
    }
  }
  ```

- **Sensitive Data Handling**:
  - Personally identifiable information (PII) encryption
  - Financial data encryption
  - Data masking for logs and reports
  - Tokenization for payment information

- **Audit and Logging**:
  - Comprehensive database action logging
  - Privileged user activity monitoring
  - Anomalous access detection
  - Automated log review

#### 11.5.3 Application Data Security

Protection of data within the application:

- **Input Validation and Sanitization**:
  ```typescript
  // Input validation with Zod
  const createUserSchema = z.object({
    username: z.string()
      .min(3, "Username must be at least 3 characters")
      .max(20, "Username cannot exceed 20 characters")
      .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
    email: z.string()
      .email("Invalid email format")
      .transform(val => val.toLowerCase()),
    password: z.string()
      .min(10, "Password must be at least 10 characters")
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, 
             "Password must include uppercase, lowercase, number, and special character"),
  });
  
  // Validate and sanitize user input
  function validateUserInput(input: unknown): CreateUserData {
    try {
      return createUserSchema.parse(input);
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Extract and format validation errors
        const validationErrors = error.errors.map(err => ({
          path: err.path.join('.'),
          message: err.message
        }));
        
        throw new ValidationError('Invalid input data', validationErrors);
      }
      throw error;
    }
  }
  ```

- **Output Encoding**:
  - Context-specific output encoding
  - HTML entity encoding for web output
  - JSON serialization security
  - Safe rendering in frontend frameworks

- **Content Security Policy**:
  ```
  Content-Security-Policy: default-src 'self'; 
    script-src 'self' https://js.stripe.com; 
    style-src 'self' 'unsafe-inline'; 
    img-src 'self' data: https://secure.gravatar.com;
    connect-src 'self' https://api.nepalipay.com wss://api.nepalipay.com;
    frame-src https://js.stripe.com;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
  ```

- **Cross-Site Scripting (XSS) Prevention**:
  - Content Security Policy implementation
  - Framework-level XSS protection
  - Input sanitization before storage
  - Output encoding during rendering
  - HTTP security headers

#### 11.5.4 API Security

Protection of application programming interfaces:

- **Authentication and Authorization**:
  - API key management for external access
  - OAuth 2.0 / OpenID Connect for user context
  - JWT validation with appropriate algorithms
  - Scope-based authorization

- **Request Validation**:
  - Schema validation for all input
  - Content type verification
  - Size limits for payloads
  - Rate limiting for all endpoints

- **Response Security**:
  - Minimal information disclosure
  - Consistent error formats
  - No sensitive data in responses
  - Response verification before sending

### 11.6 Infrastructure Security

#### 11.6.1 Network Security

Multiple layers of network protection:

- **Perimeter Security**:
  - Web application firewall (WAF)
  - DDoS protection
  - Network intrusion detection/prevention
  - Advanced bot detection

- **Traffic Encryption**:
  - TLS 1.3 for all connections
  - Certificate validation
  - Perfect forward secrecy
  - HSTS implementation

- **Internal Network Security**:
  - Network segmentation
  - Zero-trust network architecture
  - Microsegmentation for services
  - Private service networking

#### 11.6.2 Host and Container Security

Security for servers and containers:

- **Server Hardening**:
  - Minimal base images
  - Unnecessary service removal
  - Regular security updates
  - Endpoint protection

- **Container Security**:
  - Image vulnerability scanning
  - Runtime security monitoring
  - Read-only file systems
  - Privilege limitations

- **Secrets Management**:
  - Secure vault for sensitive credentials
  - Dynamic secret generation
  - Limited secret lifetime
  - Access auditing

#### 11.6.3 Cloud Security

Security for cloud-based infrastructure:

- **Identity and Access Management**:
  - Principle of least privilege
  - Just-in-time access
  - Multi-factor authentication
  - Service account limitations

- **Resource Protection**:
  - Resource-level access controls
  - Private networking
  - Encryption for storage
  - Secure service endpoints

- **Compliance and Governance**:
  - Infrastructure as code
  - Policy as code
  - Automated compliance checking
  - Comprehensive resource tagging

### 11.7 Security Monitoring and Incident Response

#### 11.7.1 Security Monitoring

Comprehensive security monitoring system:

- **Log Management**:
  - Centralized log collection
  - Log integrity protection
  - Retention policies
  - Advanced search capabilities

- **Security Information and Event Management (SIEM)**:
  - Real-time event correlation
  - Threat intelligence integration
  - Behavioral analytics
  - Anomaly detection

- **Continuous Monitoring**:
  - 24/7 security operations
  - Automated alerting
  - Escalation procedures
  - Trend analysis

#### 11.7.2 Incident Response

Structured process for security incidents:

- **Incident Response Plan**:
  - Defined roles and responsibilities
  - Communication procedures
  - Containment strategies
  - Recovery processes

- **Response Process**:
  1. Detection and Analysis
  2. Containment
  3. Eradication
  4. Recovery
  5. Post-Incident Analysis

- **Business Continuity**:
  - Disaster recovery planning
  - Critical function identification
  - Recovery time objectives
  - Regular testing

### 11.8 Compliance and Risk Management

#### 11.8.1 Regulatory Compliance

Adherence to relevant regulations:

- **Financial Regulations**:
  - Anti-Money Laundering (AML)
  - Know Your Customer (KYC)
  - Counter-Terrorist Financing (CTF)
  - Financial reporting requirements

- **Data Protection**:
  - GDPR compliance
  - CCPA compliance
  - Data subject rights
  - Privacy impact assessments

- **Industry Standards**:
  - PCI DSS for payment processing
  - ISO 27001 information security
  - NIST Cybersecurity Framework
  - CIS Critical Security Controls

#### 11.8.2 Security Testing

Regular testing of security controls:

- **Penetration Testing**:
  - Annual full-scope tests
  - Quarterly focused tests
  - Post-major-change tests
  - Red team exercises

- **Vulnerability Assessment**:
  - Weekly automated scans
  - Monthly manual assessment
  - Dependency analysis
  - Configuration review

- **Code Security Review**:
  - Static application security testing
  - Dynamic application security testing
  - Interactive application security testing
  - Manual code review

#### 11.8.3 Security Awareness

Human security element:

- **Employee Training**:
  - Security awareness program
  - Role-specific security training
  - Phishing simulations
  - Secure coding practices

- **User Education**:
  - Security best practices
  - Account protection guidance
  - Social engineering awareness
  - Safe transaction habits

### 11.9 Security Roadmap

Ongoing security enhancement plan:

- **Short-term Initiatives** (0-6 months):
  - Security automation improvements
  - Enhanced anomaly detection
  - Additional MFA options
  - Advanced logging capabilities

- **Medium-term Projects** (6-12 months):
  - Zero-knowledge proof implementations
  - Enhanced privacy features
  - Formal verification expansion
  - Advanced threat hunting

- **Long-term Vision** (1-2 years):
  - Quantum-resistant cryptography
  - Decentralized identity integration
  - Advanced secure multiparty computation
  - AI-enhanced security monitoring

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

## 19. Internationalization and Localization

NepaliPay is designed with a strong focus on cultural sensitivity and international accessibility. This section details how the platform handles language, cultural considerations, and regional requirements to provide a seamless experience for users across different regions and languages.

### 19.1 Language Support Framework

#### 19.1.1 Supported Languages

NepaliPay currently supports the following languages:

| Language | Code | Support Level | Coverage |
|----------|------|---------------|----------|
| English  | en   | Primary       | 100%     |
| Nepali   | ne   | Primary       | 100%     |
| Hindi    | hi   | Secondary     | 85%      |
| Chinese  | zh   | Secondary     | 70%      |
| Japanese | ja   | Secondary     | 70%      |
| Korean   | ko   | Secondary     | 70%      |

Primary languages are fully supported throughout the application, including all error messages, help content, and legal documents. Secondary languages cover all main user interface elements but may fall back to English for some specialized content.

#### 19.1.2 Translation Management System

NepaliPay employs a sophisticated translation management system:

```typescript
// client/src/lib/i18n.ts
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

// Initialize i18next with advanced configuration
i18next
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    supportedLngs: ['en', 'ne', 'hi', 'zh', 'ja', 'ko'],
    ns: ['common', 'auth', 'wallet', 'transaction', 'loan', 'settings', 'legal'],
    defaultNS: 'common',
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false, // React already safes from XSS
    },
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    detection: {
      order: ['localStorage', 'cookie', 'navigator'],
      caches: ['localStorage', 'cookie'],
    },
    react: {
      useSuspense: true,
    },
    saveMissing: process.env.NODE_ENV === 'development',
    missingKeyHandler: (lng, ns, key) => {
      // In development, log missing translations
      if (process.env.NODE_ENV === 'development') {
        console.warn(`Missing translation: ${key} (${lng}/${ns})`);
      }
      
      // Report to translation management system
      if (process.env.NODE_ENV === 'production') {
        reportMissingKey(lng, ns, key);
      }
    }
  });

export default i18next;
```

#### 19.1.3 Translation Workflow

The translation process follows a structured workflow:

1. **String Extraction**: Automated extraction of translatable strings from the codebase
2. **Translation Management**: Professional translation through a dedicated Translation Management System (TMS)
3. **Review Process**: Native speaker review for contextual and cultural accuracy
4. **Integration**: Automated integration of approved translations into the application
5. **Quality Assurance**: Visual verification in context to ensure proper rendering

#### 19.1.4 Dynamic Content Translation

For dynamic content like transaction descriptions and notifications:

```typescript
// Example of handling dynamic content translation
function getTransactionDescription(
  transaction: Transaction, 
  t: TFunction
): string {
  switch (transaction.type) {
    case 'transfer':
      return t('transaction:description.transfer', {
        amount: formatCurrency(transaction.amount, transaction.currency),
        recipient: transaction.recipientName || shortenAddress(transaction.recipientAddress),
        context: transaction.isInternal ? 'internal' : 'external'
      });
    
    case 'purchase':
      return t('transaction:description.purchase', {
        amount: formatCurrency(transaction.amount, transaction.currency),
        method: t(`payment:method.${transaction.paymentMethod}`)
      });
    
    case 'loan':
      return t('transaction:description.loan', {
        amount: formatCurrency(transaction.amount, transaction.currency),
        collateralType: t(`collateral:type.${transaction.collateralType}`)
      });
    
    default:
      return t('transaction:description.unknown');
  }
}
```

### 19.2 Cultural Adaptation

#### 19.2.1 Design Localization

The application's visual design adapts to different cultural contexts:

- **Color Schemes**: Culturally appropriate color palettes for different regions
- **Imagery**: Region-specific imagery and illustrations
- **Iconography**: Culturally relevant icons and symbols
- **Layouts**: Directional adjustments for right-to-left languages
- **Typography**: Font selection optimized for each language's characteristics

#### 19.2.2 Date and Time Formatting

Comprehensive localization of temporal elements:

```typescript
// Time formatting utility
export function formatDateTime(
  date: Date | string | number,
  options: {
    format?: 'short' | 'medium' | 'long' | 'full',
    type?: 'date' | 'time' | 'dateTime',
    calendar?: 'gregorian' | 'buddhist' | 'nepali'
  } = {}
): string {
  const {
    format = 'medium',
    type = 'dateTime',
    calendar = 'gregorian'
  } = options;
  
  const timestamp = typeof date === 'object' ? date.getTime() : new Date(date).getTime();
  
  // Get user's locale and preferences
  const locale = i18next.language;
  const userPrefs = getUserPreferences();
  const userCalendar = userPrefs.calendar || calendar;
  
  // Format according to locale and calendar system
  if (userCalendar === 'nepali') {
    return formatNepaliDate(timestamp, { format, type, locale });
  } else if (userCalendar === 'buddhist') {
    return formatBuddhistDate(timestamp, { format, type, locale });
  } else {
    return formatGregorianDate(timestamp, { format, type, locale });
  }
}
```

#### 19.2.3 Number and Currency Formatting

Localized number handling with cultural sensitivity:

```typescript
// Currency formatting utility
export function formatCurrency(
  amount: number | string,
  currency: string,
  options: {
    style?: 'symbol' | 'code' | 'name',
    digitGrouping?: boolean,
    showZeroPadding?: boolean,
    significantDigits?: number
  } = {}
): string {
  const {
    style = 'symbol',
    digitGrouping = true,
    showZeroPadding = true,
    significantDigits = 2
  } = options;
  
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  const locale = i18next.language;
  
  // Special handling for NPT tokens
  if (currency === 'NPT') {
    // For NPT, always use Nepali formatting when in Nepali locale
    if (locale === 'ne') {
      return formatNepaliCurrency(numericAmount, options);
    }
    
    // Otherwise format as regular number with NPT symbol
    return `${formatNumber(numericAmount, locale, {
      maximumFractionDigits: significantDigits,
      minimumFractionDigits: showZeroPadding ? significantDigits : 0,
      useGrouping: digitGrouping
    })} NPT`;
  }
  
  // Handle standard currencies
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    currencyDisplay: style,
    maximumFractionDigits: significantDigits,
    minimumFractionDigits: showZeroPadding ? significantDigits : 0,
    useGrouping: digitGrouping
  }).format(numericAmount);
}
```

#### 19.2.4 Cultural Content Adaptation

Content is adapted based on cultural norms and preferences:

- **Marketing Messages**: Culturally tailored promotional content
- **Imagery Selection**: Region-appropriate visual elements
- **Feature Emphasis**: Prioritizing features valued in specific regions
- **Communication Style**: Adapting tone and formality levels
- **Tutorials**: Culture-specific examples and scenarios

### 19.3 Regional Compliance

#### 19.3.1 Regulatory Adaptation

The platform adapts to different regulatory environments:

- **KYC Requirements**: Region-specific identity verification processes
- **Transaction Limits**: Adjusted limits based on local regulations
- **Tax Reporting**: Compliance with local tax requirements
- **Data Retention**: Adherence to regional data protection laws
- **Terms of Service**: Regionally adapted legal documents

#### 19.3.2 Regional Document Requirements

Support for different document types for verification:

| Region | Supported ID Types | Address Proof Types | Additional Requirements |
|--------|-------------------|---------------------|-------------------------|
| Nepal | Citizenship Certificate, Passport, Driver's License | Utility Bill, Bank Statement | Mobile Number Verification |
| India | Aadhaar Card, PAN Card, Passport | Utility Bill, Bank Statement | PAN Verification |
| China | National ID Card, Passport | Household Registration Book | Chinese Phone Number |
| Japan | My Number Card, Passport, Driver's License | Utility Bill, Residence Card | - |
| Singapore | NRIC, Passport, Employment Pass | Utility Bill, Bank Statement | - |

#### 19.3.3 Region-Specific Features

Certain features are tailored to specific regional needs:

- **Nepal**: Integration with local utility payment systems, remittance-focused features
- **India**: UPI payment integration, INR-NPR corridor optimization
- **Southeast Asia**: Region-specific payment methods, local banking integration
- **Global**: International remittance corridors with optimized fee structures

### 19.4 Technical Implementation

#### 19.4.1 Frontend Localization

The frontend implements localization through:

```jsx
// Example of a localized component
import { useTranslation } from 'react-i18next';
import { useUserSettings } from '@/hooks/use-user-settings';

export function TransactionHistoryHeader() {
  const { t } = useTranslation('transaction');
  const { settings } = useUserSettings();
  const isRTL = ['ar', 'he', 'fa', 'ur'].includes(settings.language);
  
  return (
    <div className={`transaction-header ${isRTL ? 'rtl' : 'ltr'}`}>
      <h2>{t('history.title')}</h2>
      <p className="text-muted">
        {t('history.subtitle')}
      </p>
      <div className="filter-controls" dir={isRTL ? 'rtl' : 'ltr'}>
        <label htmlFor="tx-type">{t('filter.type')}</label>
        <select id="tx-type">
          <option value="all">{t('filter.all_types')}</option>
          <option value="send">{t('filter.type_send')}</option>
          <option value="receive">{t('filter.type_receive')}</option>
          <option value="exchange">{t('filter.type_exchange')}</option>
        </select>
      </div>
    </div>
  );
}
```

#### 19.4.2 Backend Localization

Server-side localization handling:

```typescript
// Middleware for processing localization on requests
export function localizationMiddleware(req: Request, res: Response, next: NextFunction) {
  // Extract locale from request (header, query param, or cookie)
  const locale = 
    req.query.locale as string || 
    req.cookies.locale || 
    req.headers['accept-language']?.split(',')[0]?.split('-')[0] || 
    'en';
    
  // Validate locale against supported languages
  const validLocale = SUPPORTED_LOCALES.includes(locale) ? locale : 'en';
  
  // Attach locale to request for use in handlers
  req.locale = validLocale;
  
  // Set up i18n for this request
  req.t = createServerTranslator(validLocale);
  
  // Setup response headers
  res.set('Content-Language', validLocale);
  
  // Continue to next middleware
  next();
}
```

#### 19.4.3 Database Considerations

The database schema supports internationalization:

- **Unicode Support**: UTF-8 encoding for all text fields
- **Collation Settings**: Language-specific sorting and comparison
- **Translation Tables**: Storage for dynamic content translations
- **User Preferences**: Storage for language and regional preferences
- **Multi-currency Support**: Comprehensive handling of different currencies

#### 19.4.4 Testing and Quality Assurance

Comprehensive testing approaches for localization:

- **Automated Tests**: Validation of UI rendering in different languages
- **Pseudo-localization**: Testing with artificially expanded text
- **RTL Testing**: Validation of right-to-left language layouts
- **Cultural Review**: Native-speaker verification of content
- **Performance Testing**: Evaluation of load times with different language packs
- **Character Encoding Tests**: Verification of proper handling of non-Latin characters

### 19.5 Future Language Expansion

#### 19.5.1 Prioritized Languages

Planned language additions based on market expansion priorities:

1. **Thai**: For the Thailand market (Q3 2025)
2. **Burmese**: For the Myanmar market (Q4 2025)
3. **Bengali**: For the Bangladesh market (Q1 2026)
4. **Arabic**: For Middle Eastern markets (Q2 2026)
5. **Vietnamese**: For the Vietnam market (Q3 2026)

#### 19.5.2 Implementation Roadmap

The language expansion follows a structured approach:

1. **Market Analysis**: Evaluation of user needs and regulatory requirements
2. **Translation Preparation**: String extraction and glossary development
3. **Professional Translation**: Engagement with region-specific linguists
4. **Technical Implementation**: Language pack integration and testing
5. **Soft Launch**: Limited release with intensive feedback collection
6. **Full Deployment**: Complete rollout with post-launch monitoring

#### 19.5.3 Adaptation Strategy

Each new language includes comprehensive adaptation:

- **Content Review**: Cultural appropriateness evaluation
- **Legal Document Translation**: Legally verified translation of terms and policies
- **Customer Support Training**: Language-specific support preparation
- **Marketing Localization**: Culturally adapted promotional materials
- **User Testing**: Region-specific user experience validation

## 20. Frequently Asked Questions (FAQ)

This section addresses common questions about the NepaliPay platform, providing concise answers for users, developers, and administrators.

### 20.1 General Questions

#### 19.1.1 What is NepaliPay?

NepaliPay is a blockchain-powered digital wallet application designed specifically for the Nepali financial ecosystem. It enables users to manage NPT tokens (stablecoins pegged to the Nepalese Rupee), perform transfers, make payments, take loans, and track transaction history using blockchain technology.

#### 19.1.2 How does NepaliPay work?

NepaliPay uses blockchain technology to provide secure, transparent, and efficient financial services. Users can purchase NPT tokens using traditional payment methods, send and receive tokens, use collateralized loans, and perform various financial transactions. All transactions are recorded on the blockchain, ensuring transparency and security.

#### 19.1.3 What cryptocurrencies does NepaliPay support?

NepaliPay primarily focuses on NPT tokens, which are stablecoins pegged to the Nepalese Rupee (NPR). Additionally, the platform supports BNB, ETH, and BTC for collateral purposes in the loan system.

#### 19.1.4 Is NepaliPay regulated?

NepaliPay operates in compliance with relevant financial and cryptocurrency regulations. The platform implements comprehensive KYC (Know Your Customer) and AML (Anti-Money Laundering) procedures to ensure regulatory compliance.

#### 19.1.5 How secure is NepaliPay?

NepaliPay employs multiple layers of security, including:
- Multi-factor authentication
- Advanced encryption for sensitive data
- Smart contract audits
- Regular security testing
- Transaction monitoring
- Fraud detection systems

The platform uses industry best practices and a defense-in-depth approach to protect user funds and data.

### 19.2 User Account Questions

#### 19.2.1 How do I create a NepaliPay account?

To create a NepaliPay account:
1. Visit the NepaliPay website or download the app
2. Click on "Sign Up" or "Register"
3. Enter your email address and create a strong password
4. Verify your email address
5. Complete the KYC process by providing required identification
6. Set up two-factor authentication for additional security

#### 19.2.2 What is KYC and why is it required?

KYC (Know Your Customer) is a process that verifies the identity of users. NepaliPay requires KYC to:
- Comply with financial regulations
- Prevent fraud and identity theft
- Ensure platform security
- Protect legitimate users

The KYC process typically involves providing identification documents and proof of address.

#### 19.2.3 How can I reset my password?

To reset your password:
1. Click "Forgot Password" on the login page
2. Enter your registered email address
3. Check your email for a password reset link
4. Click the link and follow instructions to create a new password
5. Log in with your new password

For security reasons, password reset links expire after 10 minutes.

#### 19.2.4 What should I do if I suspect unauthorized access to my account?

If you suspect unauthorized access:
1. Change your password immediately
2. Enable or reset two-factor authentication
3. Check your transaction history for unauthorized activities
4. Contact NepaliPay support immediately through the app or website
5. Report any unauthorized transactions

### 19.3 NPT Token Questions

#### 19.3.1 What is NPT token?

NPT (NepaliPay Token) is a stablecoin pegged to the Nepalese Rupee (NPR). Each NPT token is designed to maintain a value equivalent to 1 NPR, providing a stable digital currency for transactions within the NepaliPay ecosystem.

#### 19.3.2 How can I purchase NPT tokens?

You can purchase NPT tokens through the following methods:
1. Credit/debit card payment through the NepaliPay app
2. Bank transfer to NepaliPay's designated account
3. Conversion from other supported cryptocurrencies
4. Receiving NPT tokens from other NepaliPay users

#### 19.3.3 How is the value of NPT maintained?

The value of NPT is maintained through:
- Treasury reserves of NPR and other stable assets
- Smart contract mechanisms that regulate supply
- Regular audits of reserve assets
- Algorithmic stabilization mechanisms

This ensures that 1 NPT consistently represents 1 NPR in value.

#### 19.3.4 Where can I use NPT tokens?

NPT tokens can be used:
- For peer-to-peer transfers within the NepaliPay ecosystem
- At partnered merchants who accept NPT payments
- For utility bill payments and mobile recharges
- As collateral for loans within the platform
- For international remittances

### 19.4 Wallet Questions

#### 19.4.1 How do I access my NepaliPay wallet?

Your NepaliPay wallet is automatically created when you register and complete the KYC process. You can access it by:
1. Logging into your NepaliPay account
2. Navigating to the "Wallet" section in the app or website
3. Using the appropriate authentication methods (password, 2FA)

#### 19.4.2 Is there a limit to how much I can store in my wallet?

Basic accounts have the following limits:
- Maximum balance: 500,000 NPT
- Daily transaction limit: 100,000 NPT
- Monthly transaction limit: 1,000,000 NPT

These limits can be increased through additional verification or by upgrading to premium account tiers.

#### 19.4.3 What happens if I lose access to my wallet?

If you lose access to your wallet:
1. Use the account recovery process via email
2. Verify your identity through the KYC information you provided
3. Use backup codes if you previously enabled 2FA
4. Contact customer support with proof of identity

Note that wallet recovery is only possible if you completed KYC verification.

#### 19.4.4 How do I check my transaction history?

To check your transaction history:
1. Log in to your NepaliPay account
2. Navigate to the "Transactions" or "Activity" section
3. View all past transactions with details including:
   - Transaction type
   - Amount
   - Date and time
   - Status
   - Transaction ID

You can filter transactions by type, date range, and status.

### 19.5 Transaction Questions

#### 19.5.1 How do I send NPT to another user?

To send NPT to another user:
1. Log in to your NepaliPay account
2. Navigate to the "Send" or "Transfer" section
3. Enter the recipient's username, email, or wallet address
4. Enter the amount to send
5. Add a description (optional)
6. Review the transaction details and confirm
7. Complete any required security verifications

#### 19.5.2 What fees are charged for transactions?

NepaliPay implements the following fee structure:
- Internal transfers (between NepaliPay users): 0-0.5%
- External transfers (to external blockchain addresses): 0.5-1% plus gas fees
- Token purchases: 2% service fee plus payment processing fees
- Loan origination: 1-2% based on loan terms
- Currency conversion: 0.5-1% spread

Exact fees are displayed before confirming any transaction.

#### 19.5.3 How long do transactions take to process?

Transaction processing times vary by type:
- Internal transfers: Near-instant (typically under 5 seconds)
- External blockchain transfers: Dependent on network conditions (5-30 minutes)
- Fiat deposits: 1-3 business days
- Token purchases: 5-15 minutes after payment confirmation
- Loan disbursements: Typically under 1 hour after approval

#### 19.5.4 Can I cancel a transaction?

Transaction cancellation depends on the status:
- Pending transactions: May be cancelable depending on type
- Processing transactions: Generally cannot be canceled
- Completed transactions: Cannot be canceled or reversed
- Failed transactions: Automatically reversed with funds returned

For assistance with problematic transactions, contact customer support.

### 19.6 Loan and Collateral Questions

#### 19.6.1 How do collateralized loans work in NepaliPay?

Collateralized loans in NepaliPay work as follows:
1. You deposit supported cryptocurrency (BNB, ETH, or BTC) as collateral
2. Based on the collateral value and loan-to-value ratio, the system calculates your maximum borrowing capacity
3. You specify the loan amount and duration (up to the maximum)
4. Upon approval, NPT tokens are transferred to your wallet
5. You repay the loan with interest by the specified due date
6. After full repayment, your collateral is returned to you

#### 19.6.2 What happens if I can't repay my loan?

If you cannot repay your loan:
1. The system will send multiple warnings as the due date approaches
2. You can request a loan extension (subject to approval and additional fees)
3. If the loan remains unpaid, the system will initiate the liquidation process
4. Your collateral will be sold to cover the outstanding loan amount plus fees
5. Any remaining collateral value after liquidation will be returned to your wallet

#### 19.6.3 What is the liquidation process?

The liquidation process includes:
1. Automatic monitoring of collateral value relative to loan amount
2. Warnings when the health factor drops below safe thresholds
3. Grace period opportunity to add collateral or repay partially
4. If the health factor drops below 1.0, liquidation is triggered
5. Collateral is sold at market rates to recover the loan amount
6. A liquidation fee (typically 5%) is applied
7. Any surplus value is returned to the borrower

#### 19.6.4 How are interest rates determined?

Interest rates are determined based on:
- Current market conditions
- Loan duration
- Collateral type
- Loan-to-value ratio
- Borrower history and reputation

Rates typically range from 5-8% APR for standard loans.

### 19.7 Technical Questions

#### 19.7.1 Which blockchain does NepaliPay use?

NepaliPay primarily operates on the Binance Smart Chain (BSC) for its smart contracts and token operations. This choice provides:
- Lower transaction fees compared to Ethereum
- Faster transaction confirmation times
- High compatibility with existing blockchain tools
- Robust security and reliability

#### 19.7.2 Are the smart contracts audited?

Yes, all NepaliPay smart contracts undergo rigorous auditing:
1. Internal code review and testing
2. External audit by reputable blockchain security firms
3. Published audit reports with addressed findings
4. Ongoing monitoring for new vulnerabilities
5. Regular re-auditing when contracts are updated

#### 19.7.3 How does NepaliPay handle private keys?

NepaliPay employs the following approaches to private key management:
- User wallet keys are never stored on NepaliPay servers
- Non-custodial options are available for advanced users
- Custodial wallets use secure multi-party computation
- System wallets employ hardware security modules (HSMs)
- Treasury wallets require multi-signature authorization

#### 19.7.4 Is there an API for developers?

Yes, NepaliPay provides a comprehensive API for developers that enables:
- Integration with third-party applications
- Automated payments and transfers
- Custom wallet implementations
- Transaction monitoring
- Custom financial services

Developers can access documentation and request API access through the Developer Portal.

### 19.8 Support Questions

#### 19.8.1 How can I contact customer support?

Customer support can be reached through multiple channels:
- In-app chat support (available 24/7)
- Email: support@nepalipay.com
- Phone: +977-XXXX-XXXX (9 AM - 6 PM NPT, Monday-Friday)
- Support ticket system via the website
- Social media direct messages (@NepaliPaySupport)

#### 19.8.2 What information should I provide when contacting support?

To help resolve issues faster, provide:
- Your registered email address
- Transaction ID (if applicable)
- Description of the issue
- Screenshots of error messages
- Steps you've taken to resolve the issue
- Device and browser/app version

Never share your password or 2FA codes with support staff.

#### 19.8.3 How quickly can I expect a response from support?

Response times vary by issue priority:
- Critical issues (account access, security concerns): 1-2 hours
- Transaction issues: 4-8 hours
- General inquiries: 24-48 hours
- Feature requests: 3-5 business days

Support availability may be affected during holidays or maintenance periods.

#### 19.8.4 Is there documentation or tutorials available?

Yes, NepaliPay provides comprehensive documentation:
- Knowledge Base with searchable articles
- Video tutorials for common tasks
- Step-by-step guides for all features
- FAQs section for quick answers
- Community forum for peer support

### 19.9 Business Questions

#### 19.9.1 Can businesses accept NPT payments?

Yes, businesses can accept NPT payments through:
- NepaliPay Business accounts
- Integration with existing POS systems
- Payment buttons on websites
- QR code-based payment systems
- API integration for custom solutions

#### 19.9.2 What are the benefits for merchants?

Merchants benefit from accepting NPT payments in several ways:
- Lower transaction fees compared to traditional payment processors
- Faster settlement times
- No chargebacks
- Access to a growing user base
- Simplified cross-border transactions
- Real-time transaction monitoring
- Loyalty program integration

#### 19.9.3 How can a business get started with NepaliPay?

Businesses can get started by:
1. Creating a NepaliPay Business account
2. Completing business verification
3. Integrating payment solutions (web, mobile, or in-person)
4. Setting up financial reporting
5. Training staff on the platform

#### 19.9.4 Are there special features for businesses?

NepaliPay offers several business-specific features:
- Bulk payment processing
- Employee salary disbursements
- Expense management tools
- Customer loyalty programs
- Detailed financial reporting
- Multi-user access with role-based permissions
- API access for custom integrations

### 19.10 Regulatory and Compliance Questions

#### 19.10.1 How does NepaliPay handle user data?

NepaliPay handles user data according to strict privacy principles:
- Data is encrypted in transit and at rest
- Personal information is stored separately from transaction data
- Access to user data is strictly limited and audited
- Data is only retained as long as necessary
- Users can request data export or deletion
- No data is sold to third parties

#### 19.10.2 How does NepaliPay prevent money laundering?

NepaliPay prevents money laundering through:
- Comprehensive KYC verification
- Transaction monitoring systems
- Pattern recognition for suspicious activities
- Limits on transaction volumes
- Screening against sanction lists
- Collaboration with financial authorities
- Regular compliance audits

#### 19.10.3 What regulations does NepaliPay comply with?

NepaliPay complies with various regulations including:
- Relevant cryptocurrency regulations
- Anti-Money Laundering (AML) requirements
- Counter-Terrorist Financing (CTF) provisions
- Data protection regulations
- Consumer protection laws
- Banking regulations where applicable
- International remittance regulations

#### 19.10.4 How are taxes handled?

While NepaliPay does not provide tax advice, the platform helps users with tax compliance by:
- Providing detailed transaction records
- Offering exportable transaction history in various formats
- Recording transaction timestamps and values
- Categorizing transactions by type
- Providing year-end summaries

Users are responsible for understanding and complying with their local tax requirements.

## 21. Blockchain Interoperability and Cross-Chain Functionality

As blockchain technology evolves, the importance of interoperability between different blockchain networks becomes increasingly critical. NepaliPay is designed with a forward-looking approach to cross-chain functionality, allowing it to operate seamlessly across multiple blockchain ecosystems. This section details the technical implementation and user benefits of NepaliPay's blockchain interoperability features.

### 21.1 Cross-Chain Architecture

#### 21.1.1 Bridge Technology

NepaliPay utilizes advanced bridge technology to enable cross-chain functionality:

```solidity
// Simplified representation of the cross-chain bridge contract
contract NepaliPayBridge {
    mapping(bytes32 => bool) public processedHashes;
    mapping(address => bool) public authorizedRelayers;
    
    event TokensLocked(
        address indexed sender,
        address indexed targetChain,
        uint256 amount,
        bytes32 transferId
    );
    
    event TokensUnlocked(
        bytes32 indexed sourceChain,
        address indexed recipient,
        uint256 amount,
        bytes32 transferId
    );
    
    // Lock tokens on the source chain
    function lockTokens(
        address targetChain,
        address recipient,
        uint256 amount
    ) external returns (bytes32) {
        // Generate unique transfer ID
        bytes32 transferId = keccak256(
            abi.encodePacked(
                msg.sender,
                targetChain,
                recipient,
                amount,
                block.timestamp,
                blockhash(block.number - 1)
            )
        );
        
        // Transfer tokens to bridge contract
        IERC20(nptTokenAddress).transferFrom(msg.sender, address(this), amount);
        
        // Emit event for relayers to pick up
        emit TokensLocked(msg.sender, targetChain, amount, transferId);
        
        return transferId;
    }
    
    // Unlock tokens on the target chain (called by authorized relayers)
    function unlockTokens(
        bytes32 sourceChain,
        address recipient,
        uint256 amount,
        bytes32 transferId,
        bytes memory signature
    ) external {
        // Verify not already processed
        require(!processedHashes[transferId], "Transfer already processed");
        
        // Verify relayer is authorized
        require(authorizedRelayers[msg.sender], "Unauthorized relayer");
        
        // Verify signature
        require(verifySignature(sourceChain, recipient, amount, transferId, signature), 
                "Invalid signature");
        
        // Mark as processed
        processedHashes[transferId] = true;
        
        // Transfer tokens to recipient
        IERC20(nptTokenAddress).transfer(recipient, amount);
        
        // Emit event
        emit TokensUnlocked(sourceChain, recipient, amount, transferId);
    }
    
    // Other bridge functions, administrative controls, etc.
}
```

This bridge contract enables NPT tokens to move between Binance Smart Chain and other supported blockchains while maintaining their value and properties.

#### 21.1.2 Supported Blockchains

NepaliPay currently supports cross-chain functionality with the following blockchains:

| Blockchain | Integration Type | Status | Confirmation Time |
|------------|------------------|--------|------------------|
| Binance Smart Chain | Native | Active | 3-5 seconds |
| Ethereum | Bridged | Active | 15-30 seconds |
| Polygon | Bridged | Active | 2-5 seconds |
| Avalanche | Bridged | Beta | 3-5 seconds |
| Solana | Bridged | Planned Q3 2025 | - |

#### 21.1.3 Consensus Mechanism

The cross-chain bridge employs a security model that combines:

- **Multi-signature verification**: Requiring multiple authorized validators to sign off on cross-chain transfers
- **Proof-of-Stake validation**: Validators must stake NPT tokens as a security deposit
- **Fraud-proof system**: Economic penalties for validators who attempt to validate fraudulent transactions
- **Monitoring network**: Dedicated nodes that monitor cross-chain transactions for anomalies

### 21.2 User Experience of Cross-Chain Functionality

#### 21.2.1 Cross-Chain Transfer Interface

The user interface for cross-chain transfers is designed to simplify the complexity of the underlying technology:

```typescript
// Client-side implementation of cross-chain transfer form
function CrossChainTransferForm() {
  const { t } = useTranslation('transfer');
  const { user, wallet } = useAuth();
  const { balances } = useWallet();
  const [sourceChain, setSourceChain] = useState('bsc');
  const [targetChain, setTargetChain] = useState('ethereum');
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [fee, setFee] = useState(0);
  const [processingTime, setProcessingTime] = useState('5-15');
  
  // Calculate fee and processing time when parameters change
  useEffect(() => {
    if (amount && sourceChain && targetChain) {
      const feeData = calculateCrossChainFee(sourceChain, targetChain, amount);
      setFee(feeData.fee);
      setProcessingTime(feeData.processingTime);
    }
  }, [amount, sourceChain, targetChain]);
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Initiate cross-chain transfer
      const result = await initiateTransfer({
        sourceChain,
        targetChain,
        amount: parseFloat(amount),
        recipient,
        userId: user.id
      });
      
      // Show confirmation and tracking information
      if (result.success) {
        toast({
          title: t('transfer:crosschain.success'),
          description: t('transfer:crosschain.tracking_id', { id: result.transferId }),
        });
      }
    } catch (error) {
      toast({
        title: t('transfer:crosschain.error'),
        description: error.message,
        variant: 'destructive'
      });
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Form implementation with source chain, target chain, amount, and recipient fields */}
      {/* Fee and processing time display */}
      {/* Submit button and confirmation dialogs */}
    </form>
  );
}
```

#### 21.2.2 Cross-Chain Transaction Monitoring

Users can track their cross-chain transactions through a dedicated monitoring interface:

- **Real-time status updates**: Progress tracking through multiple confirmation stages
- **Explorer links**: Direct links to block explorers on both source and destination chains
- **Notification system**: Push or email alerts for status changes
- **Problem resolution**: Automated and manual processes for handling stuck transactions

### 21.3 Security Considerations

#### 21.3.1 Cross-Chain Validation Process

The validation process for cross-chain transactions includes multiple security layers:

1. **Source chain validation**: Initial transaction is confirmed on the source blockchain
2. **Bridge protocol validation**: Bridge smart contracts validate the transfer parameters
3. **Relayer network consensus**: Multiple relayers must agree on the validity of the transfer
4. **Destination chain validation**: Final transaction is confirmed on the destination blockchain
5. **Proof verification**: Cryptographic proofs ensure the transaction's authenticity

#### 21.3.2 Risk Mitigation Strategies

To mitigate risks specific to cross-chain operations, NepaliPay implements:

- **Transaction size limits**: Maximum transfer amounts to limit potential losses
- **Progressive confirmation thresholds**: Larger transactions require more confirmations
- **Circuit breakers**: Automatic suspension of cross-chain functionality if anomalies are detected
- **Insurance fund**: Reserved funds to cover losses from technical failures
- **Regular security audits**: Specialized cross-chain security evaluations

### 21.4 Technical Implementation Details

#### 21.4.1 Cross-Chain Token Representation

NPT tokens maintain consistent representation across different blockchains through:

- **Original chain**: Native BEP-20 tokens on Binance Smart Chain
- **Ethereum**: ERC-20 representation with wrapped functionality
- **Polygon**: Mapped tokens with equivalent value and functionality
- **Avalanche**: C-Chain compatible tokens

Each representation maintains a 1:1 peg with the native NPT token value.

#### 21.4.2 Cross-Chain Communication Protocol

The cross-chain communication protocol enables secure message passing between blockchains:

```solidity
// Simplified message verification contract
contract CrossChainMessageVerifier {
    mapping(bytes32 => bool) public processedMessages;
    mapping(address => bool) public trustedOracles;
    
    struct CrossChainMessage {
        bytes32 messageId;
        address sourceDomain;
        address targetDomain;
        address recipient;
        bytes payload;
        uint256 timestamp;
    }
    
    event MessageReceived(
        bytes32 indexed messageId,
        address indexed sourceDomain,
        address indexed recipient,
        bytes payload
    );
    
    // Verify and process a cross-chain message
    function verifyAndProcessMessage(
        CrossChainMessage memory message,
        bytes[] memory signatures
    ) external returns (bool) {
        // Generate message hash
        bytes32 messageHash = keccak256(
            abi.encodePacked(
                message.messageId,
                message.sourceDomain,
                message.targetDomain,
                message.recipient,
                message.payload,
                message.timestamp
            )
        );
        
        // Ensure message hasn't been processed
        require(!processedMessages[messageHash], "Message already processed");
        
        // Verify oracle signatures
        require(verifySignatures(messageHash, signatures), "Invalid signatures");
        
        // Mark message as processed
        processedMessages[messageHash] = true;
        
        // Emit event
        emit MessageReceived(
            message.messageId,
            message.sourceDomain,
            message.recipient,
            message.payload
        );
        
        // Process message payload
        (bool success, ) = message.recipient.call(message.payload);
        return success;
    }
    
    // Internal signature verification
    function verifySignatures(
        bytes32 messageHash,
        bytes[] memory signatures
    ) internal view returns (bool) {
        // Implementation of signature verification logic
        // Requires a threshold of valid signatures from trusted oracles
    }
}
```

### 21.5 Use Cases and Applications

#### 21.5.1 Cross-Chain DeFi Integration

The cross-chain functionality enables NPT tokens to participate in DeFi ecosystems across multiple blockchains:

- **Yield farming**: Deploy NPT as collateral in multiple DeFi protocols
- **Liquidity provision**: Provide NPT-based liquidity across different DEXs
- **Lending/borrowing**: Use NPT as collateral on various lending platforms
- **Synthetic assets**: Create synthetic assets backed by cross-chain NPT

#### 21.5.2 Cross-Chain Business Payments

Businesses can leverage cross-chain functionality for enhanced payment options:

- **Multi-chain merchant acceptance**: Accept payments regardless of customer's preferred blockchain
- **Optimized fee routing**: Automatically select the lowest-cost blockchain for processing payments
- **Chain-agnostic subscriptions**: Subscription services that work across multiple blockchains
- **Unified reporting**: Consolidated financial reporting across all blockchain activity

#### 21.5.3 Cross-Chain Remittances

International remittances benefit from cross-chain capabilities:

- **Corridor-optimized routing**: Select the most efficient blockchain based on the remittance corridor
- **Fee reduction**: Minimize costs by selecting optimal pathways
- **Settlement time improvement**: Reduce wait times for international transfers
- **Enhanced reliability**: Provide alternate routes in case of congestion on any single blockchain

### 21.6 Future Development

#### 21.6.1 Planned Cross-Chain Enhancements

The roadmap for cross-chain functionality includes:

- **Additional blockchain integrations**: Support for more Layer 1 and Layer 2 blockchains
- **Cross-chain smart contracts**: Smart contracts that can execute across multiple blockchains
- **Decentralized bridge governance**: Community-governed bridge parameters and validator selection
- **Advanced routing algorithms**: Optimization of cross-chain transfers for efficiency and cost
- **Cross-chain identity system**: Unified identity verification across multiple blockchains

#### 21.6.2 Research Initiatives

Ongoing research to improve cross-chain capabilities includes:

- **Zero-knowledge proofs for cross-chain verification**: Enhancing privacy and efficiency
- **Trustless bridge architectures**: Reducing reliance on trusted validators
- **Interoperable smart contract standards**: Enabling consistent contract behavior across chains
- **Cross-chain oracle networks**: Providing reliable data across multiple blockchains
- **Quantum-resistant cross-chain security**: Future-proofing against quantum computing threats

## 22. Conclusion

NepaliPay represents a sophisticated fusion of blockchain technology and traditional financial services, tailored specifically for the Nepali market. Its comprehensive feature set, robust security measures, and culturally sensitive design make it a powerful tool for digital financial management in Nepal's evolving economy.

The system's architecture balances the benefits of blockchain technology with practical user experience considerations, creating a platform that is both technologically advanced and accessible to users with varying levels of technical expertise.

The inclusion of advanced features like blockchain interoperability, comprehensive internationalization, and a collateralized loan system positions NepaliPay at the forefront of financial innovation in the region. As digital finance continues to evolve in Nepal, NepaliPay is positioned to play a significant role in the country's financial ecosystem, providing secure, efficient, and user-friendly financial services powered by blockchain technology.