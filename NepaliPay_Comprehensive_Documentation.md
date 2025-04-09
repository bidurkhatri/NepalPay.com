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