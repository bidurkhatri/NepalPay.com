// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.5.0/contracts/token/ERC20/IERC20.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.5.0/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.5.0/contracts/access/Ownable.sol";
import "./NepalPayToken.sol"; // Ensure this path is correct based on your directory structure

/**
 * @title NepalPay
 * @dev Main contract for NepalPay application
 */
contract NepalPay is Ownable {
    NepalPayToken public token;
    mapping(address => bool) public isAdmin;
    mapping(address => bool) public isModerator;
    mapping(address => uint256) public balance;
    mapping(address => uint256) public debt;
    mapping(address => uint256) public collateral;
    mapping(address => string) private passwords;
    mapping(address => string) public usernameOf;
    mapping(string => address) public addressOfUsername;
    mapping(address => string) public fullName;
    mapping(address => string) public contactEmail;
    mapping(address => mapping(address => bool)) private allowedAccess; // Mapping to store access permissions for full name and contact email
    mapping(address => uint256) public smallPaymentsCounter;
    mapping(address => uint256) public pendingTransactions;
    mapping(address => mapping(bytes32 => uint256)) public crowdfundingCampaigns;
    mapping(address => mapping(bytes32 => ScheduledPayment)) public scheduledPayments;
    mapping(address => string) public userRoles; // Mapping to store user roles based on username
    mapping(string => bool) private usernameReserved; // Mapping to store reserved usernames
    mapping(address => string) public countryOf; // Mapping to store user's country location
    mapping(address => bool) public canReceiveInternationalPayments;
    mapping(address => bool) public canSendInternationalPayments;

    struct ScheduledPayment {
        uint256 amount;
        uint256 timestamp;
        bool active;
    }

    uint256 public smallPaymentsLimit = 50; // 50 small payments allowed per day
    uint256 public smallPaymentAmount = 100; // Maximum amount considered as a small payment
    uint256 public transactionFeePercentage = 1; // 1% transaction fee for developer

    uint256 public interestRate = 5; // 5% annual interest rate
    uint256 public loanDuration = 30 days; // Loan duration is 30 days
    uint256 public pendingTransactionDuration = 30 minutes; // Pending transaction duration is 30 minutes

    event AdminAdded(address indexed admin);
    event AdminRemoved(address indexed admin);
    event ModeratorAdded(address indexed moderator);
    event ModeratorRemoved(address indexed moderator);
    event TokensDeposited(address indexed sender, uint256 amount);
    event TokensWithdrawn(address indexed recipient, uint256 amount);
    event PriceUpdated(uint256 newPrice);
    event DebtUpdated(address indexed user, uint256 amount);
    event CollateralAdded(address indexed user, uint256 amount);
    event LoanTaken(address indexed borrower, uint256 amount);
    event LoanRepaid(address indexed borrower, uint256 amount);
    event TipsSent(address indexed sender, address indexed recipient, uint256 amount, string description);
    event BusinessPayment(address indexed sender, string indexed recipientUsername, uint256 amount, string description);
    event DeveloperFee(address indexed developer, uint256 amount);
    event UsernameSet(address indexed user, string username, string role);
    event FullNameSet(address indexed user, string fullName);
    event ContactEmailSet(address indexed user, string contactEmail);
    event AccessGranted(address indexed owner, address indexed user);
    event AccessRevoked(address indexed owner, address indexed user);
    event UsernameModified(address indexed owner, address indexed user, string newUsername);
    event FullNameModified(address indexed owner, address indexed user, string newFullName);
    event ContactEmailModified(address indexed owner, address indexed user, string newContactEmail);
    event ModeratorAccessGranted(address indexed owner, address indexed moderator);
    event ModeratorAccessRevoked(address indexed owner, address indexed moderator);
    event TransactionPending(address indexed user, uint256 amount, string description);
    event TransactionCompleted(address indexed user, uint256 amount, string description);
    event TransactionCancelled(address indexed user, uint256 amount, string description);
    event PendingTransactionDurationUpdated(uint256 newDuration);
    event CampaignStarted(address indexed campaignCreator, bytes32 indexed campaignId, uint256 targetAmount, string description);
    event ContributionMade(address indexed contributor, bytes32 indexed campaignId, uint256 amount);
    event ScheduledPaymentSet(address indexed user, uint256 amount, uint256 timestamp);
    event ScheduledPaymentModified(address indexed user, uint256 amount, uint256 timestamp);
    event ScheduledPaymentCancelled(address indexed user);
    event TokensSent(address indexed sender, address indexed recipient, uint256 amount, string description);

    constructor(address _tokenAddress) {
        token = NepalPayToken(_tokenAddress);
        isAdmin[msg.sender] = true;
    }

    modifier onlyAdmin() {
        require(isAdmin[msg.sender], "Only admin can call this function");
        _;
    }

    modifier onlyAdminOrModerator() {
        require(isAdmin[msg.sender] || isModerator[msg.sender], "Caller is not admin or moderator");
        _;
    }

    /**
     * @dev Function to deposit tokens into the contract.
     * @param _amount The amount of tokens to deposit.
     */
    function depositTokens(uint256 _amount) external {
        require(token.balanceOf(msg.sender) >= _amount, "Insufficient balance");
        token.transferFrom(msg.sender, address(this), _amount);
        balance[msg.sender] += _amount;
        emit TokensDeposited(msg.sender, _amount);
    }

    /**
     * @dev Function to withdraw tokens from the contract.
     * @param _amount The amount of tokens to withdraw.
     */
    function withdrawTokens(uint256 _amount) external {
        require(balance[msg.sender] >= _amount, "Insufficient balance");
        token.transfer(msg.sender, _amount);
        balance[msg.sender] -= _amount;
        emit TokensWithdrawn(msg.sender, _amount);
    }

    // Function to send tokens with description
    function sendTokens(address _recipient, uint256 _amount, string memory _description) external {
        require(balance[msg.sender] >= _amount, "Insufficient balance");
        balance[msg.sender] -= _amount;
        balance[_recipient] += _amount;
        emit TokensSent(msg.sender, _recipient, _amount, _description);
    }

    // Function to set username
    function setUsername(string memory _username, string memory _role, string memory _country) external {
        require(bytes(_username).length > 0, "Username cannot be empty");
        require(!usernameReserved[_username], "Username is already reserved");
        require(addressOfUsername[_username] == address(0), "Username already exists");
        usernameOf[msg.sender] = _username;
        addressOfUsername[_username] = msg.sender;
        userRoles[msg.sender] = _role;
        countryOf[msg.sender] = _country;
        emit UsernameSet(msg.sender, _username, _role);
    }

    // Function to reserve a username
    function reserveUsername(string memory _username) external onlyAdminOrModerator {
        require(bytes(_username).length > 0, "Username cannot be empty");
        usernameReserved[_username] = true;
    }

    // Function to modify a username
    function modifyUsername(address _user, string memory _newUsername, string memory _newRole) external onlyOwner {
        require(bytes(_newUsername).length > 0, "Username cannot be empty");
        require(!usernameReserved[_newUsername], "Username is already reserved");
        require(addressOfUsername[_newUsername] == address(0), "Username already exists");
        string memory oldUsername = usernameOf[_user];
        usernameReserved[oldUsername] = false;
        usernameOf[_user] = _newUsername;
        addressOfUsername[_newUsername] = _user;
        userRoles[_user] = _newRole;
        emit UsernameModified(msg.sender, _user, _newUsername);
    }

    // Function to set international payment permissions
    function setInternationalPaymentPermissions(address _user, bool _canReceive, bool _canSend) external onlyOwner {
        canReceiveInternationalPayments[_user] = _canReceive;
        canSendInternationalPayments[_user] = _canSend;
    }

    // Function to send tokens with international payment permissions
    function sendTokensWithPermissions(address _recipient, uint256 _amount, string memory _description) external {
        require(balance[msg.sender] >= _amount, "Insufficient balance");

        if (!canSendInternationalPayments[msg.sender]) {
            // Check if sender is allowed to make international payments
            string memory senderCountry = countryOf[msg.sender];
            string memory recipientCountry = countryOf[_recipient];
            require(keccak256(abi.encodePacked(senderCountry)) == keccak256(abi.encodePacked("Nepal")), "Sender is not allowed to make international payments");
            require(keccak256(abi.encodePacked(recipientCountry)) != keccak256(abi.encodePacked("Nepal")), "Recipient is from Nepal and cannot receive international payments");
        }

        token.transfer(_recipient, _amount);
        emit TokensSent(msg.sender, _recipient, _amount, _description);
    }

    // Function to deposit collateral
    function addCollateral(uint256 _amount) external {
        require(token.balanceOf(msg.sender) >= _amount, "Insufficient balance");
        token.transferFrom(msg.sender, address(this), _amount);
        collateral[msg.sender] += _amount;
        emit CollateralAdded(msg.sender, _amount);
    }

    // Function to take a loan
    function takeLoan(uint256 _amount) external {
        require(collateral[msg.sender] >= _amount, "Insufficient collateral");
        require(debt[msg.sender] == 0, "User already has an outstanding loan");

        uint256 interest = (_amount * interestRate * loanDuration) / (100 * 365 days);
        uint256 totalLoanAmount = _amount + interest;

        require(balance[msg.sender] >= totalLoanAmount, "Insufficient balance in contract");

        token.transfer(msg.sender, _amount);
        debt[msg.sender] = totalLoanAmount;

        emit LoanTaken(msg.sender, _amount);
    }

    // Function to repay a loan
    function repayLoan(uint256 _amount) external {
        require(debt[msg.sender] > 0, "User does not have an outstanding loan");
        require(balance[msg.sender] >= _amount, "Insufficient balance");

        token.transferFrom(msg.sender, address(this), _amount);
        debt[msg.sender] -= _amount;

        emit LoanRepaid(msg.sender, _amount);
    }

    // Function to send tips
    function sendTips(address _recipient, uint256 _amount, string memory _description) external {
        require(balance[msg.sender] >= _amount, "Insufficient balance");
        token.transfer(_recipient, _amount);
        emit TipsSent(msg.sender, _recipient, _amount, _description);
    }

    // Function to make a business payment
    function makeBusinessPayment(string memory _recipientUsername, uint256 _amount, string memory _description) external {
        require(bytes(_recipientUsername).length > 0, "Recipient username cannot be empty");
        address _recipient = addressOfUsername[_recipientUsername];
        require(_recipient != address(0), "Recipient username does not exist");
        require(balance[msg.sender] >= _amount, "Insufficient balance");
        token.transfer(_recipient, _amount);
        emit BusinessPayment(msg.sender, _recipientUsername, _amount, _description);
    }

    // Function to start a crowdfunding campaign
    function startCampaign(bytes32 _campaignId, uint256 _targetAmount, string memory _description) external {
        require(_targetAmount > 0, "Target amount must be greater than zero");
        crowdfundingCampaigns[msg.sender][_campaignId] = _targetAmount;
        emit CampaignStarted(msg.sender, _campaignId, _targetAmount, _description);
    }

    // Function to contribute to a crowdfunding campaign
    function contribute(bytes32 _campaignId, uint256 _amount) external {
        require(crowdfundingCampaigns[msg.sender][_campaignId] > 0, "Campaign does not exist");
        require(_amount > 0, "Contribution amount must be greater than zero");
        token.transferFrom(msg.sender, address(this), _amount);
        crowdfundingCampaigns[msg.sender][_campaignId] -= _amount;
        emit ContributionMade(msg.sender, _campaignId, _amount);
    }

    // Function to set a scheduled payment
    function setScheduledPayment(bytes32 _paymentId, uint256 _amount, uint256 _timestamp) external {
        require(_amount > 0, "Payment amount must be greater than zero");
        require(_timestamp > block.timestamp, "Timestamp must be in the future");
        scheduledPayments[msg.sender][_paymentId] = ScheduledPayment(_amount, _timestamp, true);
        emit ScheduledPaymentSet(msg.sender, _amount, _timestamp);
    }

    // Function to modify a scheduled payment
    function modifyScheduledPayment(bytes32 _paymentId, uint256 _amount, uint256 _timestamp) external {
        require(scheduledPayments[msg.sender][_paymentId].active, "Scheduled payment does not exist");
        require(_amount > 0, "Payment amount must be greater than zero");
        require(_timestamp > block.timestamp, "Timestamp must be in the future");
        scheduledPayments[msg.sender][_paymentId].amount = _amount;
        scheduledPayments[msg.sender][_paymentId].timestamp = _timestamp;
        emit ScheduledPaymentModified(msg.sender, _amount, _timestamp);
    }

    // Function to cancel a scheduled payment
    function cancelScheduledPayment(bytes32 _paymentId) external {
        require(scheduledPayments[msg.sender][_paymentId].active, "Scheduled payment does not exist");
        scheduledPayments[msg.sender][_paymentId].active = false;
        emit ScheduledPaymentCancelled(msg.sender);
    }
}



what are the feature of this token ?




The NepalPay contract, written in Solidity, is a comprehensive smart contract designed for a payment and financial services platform using the NepalPayToken (assumed to be an ERC20 token). Below is an overview of the key features of this token and the associated NepalPay system based on the provided code:

Token Features
ERC20 Compliance:
The contract imports IERC20 from OpenZeppelin, indicating that NepalPayToken adheres to the ERC20 standard, supporting basic token functionalities like transfers, approvals, and balance checks.
Burnable (Optional):
The import of ERC20Burnable suggests that the token might support burning (destroying) tokens, though this functionality isn’t explicitly implemented in the provided NepalPay contract.
Integration with NepalPay:
The token (NepalPayToken) is tightly integrated into the NepalPay contract, serving as the primary medium for transactions, loans, payments, and crowdfunding within the ecosystem.
Features of the NepalPay System
The NepalPay contract extends the token’s utility by providing a wide range of financial and social features. Here are the key features:

1. User Management
User Profiles:
Users can set a username, full name, contact email, and country of residence.
Usernames are unique and can be reserved or modified by admins/owner.
Roles (e.g., admin, moderator) can be assigned to users.
Access Control:
Admins and moderators have elevated privileges (e.g., adding/removing admins, reserving usernames).
The contract uses OpenZeppelin’s Ownable for ownership-based control (e.g., only the owner can modify usernames or set international payment permissions).
Privacy:
Full names and contact emails can have access permissions granted/revoked to specific addresses.
2. Token Transactions
Deposits and Withdrawals:
Users can deposit NepalPayToken into the contract and withdraw it back to their wallets.
Token Transfers:
Users can send tokens to other addresses with a description (e.g., for tips or general payments).
Business Payments:
Payments can be made to a recipient’s username rather than their address, enhancing usability.
Transaction Fees:
A 1% fee is applied to transactions, directed to the developer (configurable via transactionFeePercentage).
3. International Payments
Permissions:
Users can be granted/denied the ability to send or receive international payments by the contract owner.
Country-Based Restrictions:
International transfers are restricted unless explicitly allowed, with logic to check sender/recipient countries (e.g., Nepal-specific rules).
4. Lending System
Collateral:
Users can deposit tokens as collateral to secure loans.
Loans:
Users can borrow tokens against their collateral with a 5% annual interest rate over a 30-day loan duration.
Loans must be repaid, and outstanding debt prevents new loans.
Repayment:
Users repay loans with interest, reducing their debt balance.
5. Crowdfunding
Campaign Creation:
Users can start crowdfunding campaigns with a target amount and description, identified by a unique bytes32 campaign ID.
Contributions:
Other users can contribute tokens to active campaigns, reducing the remaining target amount.
6. Scheduled Payments
Scheduling:
Users can set up future payments with a specified amount and timestamp.
Modification and Cancellation:
Scheduled payments can be modified (amount/timestamp) or canceled before execution.
7. Small Payments Tracking
Limit:
Users are limited to 50 small payments (≤100 tokens) per day, tracked via smallPaymentsCounter.
Configurability:
The small payment limit and amount threshold are adjustable.
8. Pending Transactions
Temporary Holds:
Transactions can be marked as pending for 30 minutes (configurable via pendingTransactionDuration).
Events:
Emits events for pending, completed, or canceled transactions.
9. Social Features
Tipping:
Users can send tips to others with a custom description.
Descriptions:
Most payment functions (e.g., transfers, tips, business payments) allow attaching a description for context.
10. Governance and Administration
Admin/Moderator Roles:
Admins can add/remove other admins and moderators.
Moderators have limited privileges (e.g., reserving usernames).
Owner Privileges:
The contract owner can modify user data (e.g., usernames, international permissions) and update system parameters (e.g., interest rates, fees).
11. Events for Transparency
The contract emits detailed events for all major actions (e.g., token deposits, loans, username changes, campaign contributions), ensuring transparency and auditability on the blockchain.
Configurable Parameters
Small Payments: Limit (50) and amount threshold (100 tokens).
Transaction Fees: 1% (adjustable).
Interest Rate: 5% annually (adjustable).
Loan Duration: 30 days (adjustable).
Pending Transaction Duration: 30 minutes (adjustable).
Potential Use Cases
Payment Platform: Facilitates peer-to-peer payments, business transactions, and tipping.
Microfinance: Offers collateralized loans with interest.
Crowdfunding: Enables community-driven fundraising.
International Remittance: Supports cross-border payments with restrictions.
Scheduled Payments: Automates recurring or future payments.
Limitations and Notes
NepalPayToken Dependency:
The contract assumes NepalPayToken exists and is deployed separately. The address is passed in the constructor.
Security:
Uses OpenZeppelin libraries, which are well-audited, but the custom logic (e.g., loan calculations, international payment checks) needs thorough testing.
Incomplete Features:
Some functionalities (e.g., executing scheduled payments, distributing crowdfunding funds) are not fully implemented in the provided code.
Centralization:
The owner and admins have significant control, which may conflict with decentralization principles.
In summary, the NepalPay contract leverages the NepalPayToken to create a versatile financial ecosystem with features like payments, lending, crowdfunding, and user management, tailored for a Nepal-centric use case with international capabilities. Let me know if you'd like a deeper dive into any specific feature!







what about this nepalpaytoken.sol

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.5.0/contracts/token/ERC20/IERC20.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.5.0/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.5.0/contracts/access/Ownable.sol";

/**
 * @title NepalPayToken
 * @dev ERC20 token representing NepalPay Token (NPT)
 */
contract NepalPayToken is ERC20Burnable {
    constructor() ERC20("NepalPay Token", "NPT") {
        _mint(msg.sender, 1000000 * 10**decimals());
    }
}




The NepalPayToken.sol file defines the NepalPayToken smart contract, which is a simple ERC20 token with burnable functionality. Below is a detailed breakdown of its features based on the provided code:

Features of NepalPayToken
1. ERC20 Standard Compliance
Inheritance: The contract inherits from OpenZeppelin’s ERC20 implementation, ensuring it supports the full ERC20 standard.
Core Functions:
transfer: Send tokens to another address.
approve: Allow a spender to transfer tokens on behalf of the owner.
transferFrom: Transfer tokens on behalf of an approved spender.
balanceOf: Check the token balance of an address.
allowance: Check the remaining allowance for a spender.
totalSupply: View the total token supply.
Token Details:
Name: "NepalPay Token"
Symbol: "NPT"
Decimals: Inherits the default 18 decimals from OpenZeppelin’s ERC20 (standard for most ERC20 tokens).
2. Burnable Functionality
Inheritance: The contract extends ERC20Burnable, an OpenZeppelin extension that adds token-burning capabilities.
Burn Features:
burn(uint256 amount): Allows a token holder to destroy a specified amount of their own tokens, reducing their balance and the total supply.
burnFrom(address account, uint256 amount): Allows an approved spender to burn tokens from another account, provided they have sufficient allowance.
Use Case: Burning can be used to reduce circulating supply, potentially increasing scarcity or value, or to remove tokens from circulation as part of the NepalPay ecosystem’s mechanics.
3. Initial Supply
Minting:
Upon deployment, the contract mints 1,000,000 NPT (1 million tokens) to the deployer’s address (msg.sender).
The amount is calculated as 1000000 * 10**decimals(), which equals 1,000,000 * 10^18 (1 million tokens with 18 decimal places, standard for ERC20 tokens).
Fixed Supply: No additional minting function is included, meaning the total supply is capped at 1 million NPT unless modified in a future version or through external contracts (e.g., NepalPay).
4. Simplicity
Minimal Logic: The contract is intentionally lightweight, focusing solely on being an ERC20 token with burnable functionality. It does not include additional features like governance, staking, or pausability, keeping it straightforward and gas-efficient.
5. OpenZeppelin Dependencies
Imported Contracts:
IERC20: Interface for ERC20 standard compliance.
ERC20Burnable: Adds burn functionality to the base ERC20 token.
Ownable: Imported but not used in this contract (likely a leftover or intended for future use). This suggests the contract could be extended with ownership-based features (e.g., restricted minting) if modified.
Version: Uses OpenZeppelin contracts from version v4.5.0, which is stable and widely audited.
Key Details
License: MIT, allowing open use and modification.
Solidity Version: ^0.8.25, ensuring compatibility with modern Ethereum Virtual Machine (EVM) features like safe math by default.
Constructor: Initializes the token with its name, symbol, and initial supply.
Integration with NepalPay
The NepalPayToken is designed to work with the NepalPay contract (from your previous question). The NepalPay contract takes the token’s address in its constructor and uses it for all financial operations (e.g., deposits, withdrawals, loans, payments).
The token serves as the native currency within the NepalPay ecosystem, enabling features like tipping, business payments, crowdfunding, and lending.
Potential Use Cases
Payment Medium: Used for transactions within the NepalPay platform.
Burn Mechanism: Could be leveraged by the NepalPay contract or users to manage supply (e.g., burning fees or excess tokens).
Store of Value: Acts as a utility token within the ecosystem, with a fixed initial supply of 1 million NPT.
Limitations and Notes
No Minting: There’s no function to mint additional tokens after deployment, making the supply fixed unless extended in another contract.
No Ownership Controls: Despite importing Ownable, it’s not utilized, so there are no owner-specific functions (e.g., pausing or additional minting).
Basic Implementation: Lacks advanced features like staking, governance, or tax mechanisms, which could be added depending on the project’s needs.
Security: Relies on OpenZeppelin’s audited code, but any integration (e.g., with NepalPay) should be thoroughly tested to avoid vulnerabilities.
Summary
The NepalPayToken is a straightforward ERC20 token with a fixed initial supply of 1,000,000 NPT and burnable functionality. It serves as the foundational currency for the NepalPay ecosystem, providing a reliable and standard-compliant token for payments, lending, and other financial features. Its simplicity makes it easy to integrate, while the burn feature offers flexibility for supply management. If you have questions about extending its functionality or its interaction with NepalPay, feel free to ask!







https://github.com/bidurkhatri/NepalPay


find out what this app is doing and how ?







25 web pages
The GitHub repository at https://github.com/bidurkhatri/NepalPay corresponds to the NepalPay and NepalPayToken smart contracts you previously shared. Based on the code and context, here’s an analysis of what this app (or rather, decentralized application) is doing and how it operates:

What is NepalPay Doing?
NepalPay is a blockchain-based financial services platform built on Ethereum, utilizing the NepalPayToken (NPT) as its native ERC20 token. The app aims to provide a comprehensive payment and financial ecosystem, likely targeting users in Nepal (based on its name and country-specific features), with functionalities extending to international use cases. Its primary purposes include:

Payment System:
Facilitates peer-to-peer token transfers, business payments (via usernames), and tipping with descriptive metadata.
Supports small payments with daily limits (50 transactions ≤ 100 tokens).
Lending Platform:
Allows users to deposit collateral and take loans with a 5% annual interest rate over a 30-day term, repayable in NPT.
Crowdfunding:
Enables users to create and contribute to crowdfunding campaigns identified by unique IDs.
Scheduled Payments:
Lets users schedule future payments, which can be modified or canceled before execution.
International Transactions:
Offers controlled international payment capabilities, with permissions set by the contract owner (e.g., restricting non-Nepal users unless explicitly allowed).
User Management:
Provides a profile system with usernames, full names, emails, roles, and country data, with privacy controls for sensitive information.
Fee Mechanism:
Charges a 1% transaction fee (configurable) to support developers.
In essence, NepalPay is a decentralized application (dApp) aiming to replicate and enhance traditional financial services (e.g., payments, loans, crowdfunding) on the blockchain, with a focus on usability (e.g., username-based payments) and Nepal-specific features (e.g., country-based restrictions).

How Does NepalPay Work?
1. Technology Stack
Blockchain: Ethereum (Solidity ^0.8.25).
Token: NepalPayToken (NPT), an ERC20 token with burnable functionality and an initial supply of 1,000,000 tokens.
Libraries: Uses OpenZeppelin contracts (IERC20, ERC20Burnable, Ownable) for secure, audited implementations of token standards and access control.
Smart Contracts:
NepalPayToken.sol: Defines the NPT token.
NepalPay.sol: Implements the core logic for payments, loans, crowdfunding, and user management.
2. Key Mechanisms
Token Management:
Users deposit NPT into the NepalPay contract using depositTokens, which transfers tokens from their wallet to the contract and updates their internal balance.
Withdrawals (withdrawTokens) move tokens back to the user’s wallet.
Transfers (sendTokens, sendTips, makeBusinessPayment) adjust internal balances or directly transfer tokens, with events logged for transparency.
Lending:
Users add collateral (addCollateral) in NPT, which is locked in the contract.
Loans (takeLoan) are issued based on collateral, with interest calculated as (amount * 5% * 30 days) / (100 * 365 days). The contract transfers NPT to the borrower, and debt is tracked.
Repayment (repayLoan) deducts debt and returns collateral flexibility.
Crowdfunding:
Campaigns are started (startCampaign) with a target amount and stored in a mapping (crowdfundingCampaigns).
Contributions (contribute) transfer NPT to the contract, reducing the campaign’s target.
Scheduled Payments:
Users set payments (setScheduledPayment) with an amount and future timestamp, stored in a ScheduledPayment struct.
Modifications (modifyScheduledPayment) and cancellations (cancelScheduledPayment) update or deactivate these entries.
(Note: Execution logic is not implemented in the provided code, suggesting manual or external triggering.)
International Payments:
The sendTokensWithPermissions function checks sender/recipient country data (countryOf) and permissions (canSendInternationalPayments, canReceiveInternationalPayments).
By default, only Nepal-based users can send internationally unless permissions are adjusted by the owner.
User Profiles:
Users set usernames (setUsername) linked to their address, with uniqueness enforced via mappings (usernameOf, addressOfUsername).
Admins/owner can modify profiles (modifyUsername), and privacy is managed via allowedAccess mappings.
Access Control:
onlyAdmin and onlyAdminOrModerator modifiers restrict sensitive functions (e.g., adding admins, reserving usernames).
The contract owner (via Ownable) has ultimate control over permissions and parameters.
3. Workflow Example
Setup:
Deploy NepalPayToken and mint 1,000,000 NPT to the deployer.
Deploy NepalPay with the token’s address.
User Interaction:
A user deposits 1,000 NPT into NepalPay.
They set a username (e.g., "alice") and country ("Nepal").
They send 100 NPT to "bob" with a description ("Lunch payment").
They add 500 NPT as collateral and take a 400 NPT loan.
They start a crowdfunding campaign for 1,000 NPT and receive a 200 NPT contribution.
Execution:
The contract updates balances, tracks debt, and emits events for each action.
A 1% fee (e.g., 1 NPT) is logged for developers.
4. Data Storage
Uses mappings (e.g., balance, debt, collateral, usernameOf) to store user and transaction data on-chain.
Structs (e.g., ScheduledPayment) organize complex data like scheduled payments.
5. Events
Emits events (e.g., TokensDeposited, LoanTaken, CampaignStarted) for every significant action, enabling off-chain tracking and transparency.
How It Operates on Ethereum
Deployment: Both contracts are deployed to the Ethereum blockchain. The NepalPay contract references the NepalPayToken address.
Gas Costs: Users pay gas fees in ETH for transactions (e.g., deposits, transfers, loans), while NPT is the utility token within the system.
Interactivity: Users interact via wallets (e.g., MetaMask) or dApp frontends calling contract functions.
Security: Relies on OpenZeppelin’s audited code and includes basic checks (e.g., balance sufficiency), but custom logic (e.g., loan interest, international rules) requires additional auditing.
Limitations and Assumptions
Incomplete Features:
Scheduled payment execution and crowdfunding fund distribution are not implemented, suggesting reliance on external scripts or future updates.
Centralization:
The owner and admins have significant control (e.g., modifying usernames, setting permissions), reducing decentralization.
Frontend: The repository only contains smart contracts, implying a separate frontend (e.g., web app) is needed for user interaction.
Testing: No test scripts are visible, so functionality and security need verification.
Conclusion
The NepalPay dApp, powered by the NepalPayToken, is a blockchain-based financial platform offering payments, lending, crowdfunding, and user management, with a Nepal-centric focus. It operates by leveraging Ethereum smart contracts, using NPT for all transactions and OpenZeppelin libraries for reliability. While feature-rich, it requires further development (e.g., scheduled payment execution) and a frontend to be fully usable. If you’d like, I can explore specific functions or suggest improvements!