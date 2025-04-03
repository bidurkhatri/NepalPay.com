// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.5.0/contracts/access/Ownable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.5.0/contracts/token/ERC20/IERC20.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.5.0/contracts/security/ReentrancyGuard.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.5.0/contracts/utils/Strings.sol";

/**
 * @title NepaliPay
 * @dev Main contract for NepaliPay platform with payments, remittances, loans, business accounts, and crowdfunding
 */
contract NepaliPay is Ownable, ReentrancyGuard {
    using Strings for uint256;
    
    // Token contract
    IERC20 public token;
    
    // User profile information
    mapping(address => string) public usernameOf;
    mapping(address => string) public fullName;
    mapping(address => string) public userRoles;
    mapping(address => string) public userCountry;
    mapping(string => address) public addressByUsername;
    
    // User token balances
    mapping(address => uint256) public balance;
    
    // Transaction history
    struct Transaction {
        uint256 id;
        address sender;
        address recipient;
        uint256 amount;
        string description;
        uint256 timestamp;
    }
    
    uint256 public transactionCount;
    mapping(uint256 => Transaction) public transactions;
    mapping(address => uint256[]) public userTransactions;
    
    // Loan data
    struct Loan {
        uint256 amount;
        uint256 dueDate;
        uint256 interest;
        bool active;
    }
    
    mapping(address => Loan) public loans;
    uint256 public loanInterestRate = 500; // 5% in basis points
    uint256 public loanDuration = 30 days;
    uint256 public maxLoanAmount;
    
    // Staking data
    struct StakingData {
        bool isStaking;
        uint256 stakedAmount;
        uint256 rewards;
    }
    
    mapping(address => StakingData) public stakingInfo;
    
    // Business account data
    struct BusinessAccount {
        bool verified;
        string businessType;
        string businessName;
        string registrationNumber;
    }
    
    mapping(address => BusinessAccount) public businessAccounts;
    
    // Crowdfunding campaigns
    struct Campaign {
        address creator;
        uint256 targetAmount;
        uint256 raisedAmount;
        string description;
        bool active;
        uint256 deadline;
    }
    
    mapping(address => mapping(bytes32 => Campaign)) public crowdfundingCampaigns;
    mapping(address => mapping(bytes32 => uint256)) public contributions;
    
    // Scheduled payments
    struct ScheduledPayment {
        uint256 amount;
        uint256 timestamp;
        bool active;
    }
    
    mapping(address => mapping(bytes32 => ScheduledPayment)) public scheduledPayments;
    
    // Events
    event Deposited(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event Transfer(address indexed from, address indexed to, uint256 amount, string description);
    event LoanTaken(address indexed user, uint256 amount, uint256 dueDate);
    event LoanRepaid(address indexed user, uint256 amount);
    event ProfileUpdated(address indexed user, string username, string role, string country);
    event BusinessAccountRegistered(address indexed user, string businessName, string businessType, string registrationNumber);
    event BusinessPayment(address indexed sender, string recipientUsername, uint256 amount, string description);
    event CampaignCreated(address indexed creator, bytes32 campaignId, uint256 targetAmount, string description);
    event ContributionMade(address indexed contributor, address indexed campaignCreator, bytes32 campaignId, uint256 amount);
    event ScheduledPaymentCreated(address indexed creator, bytes32 paymentId, uint256 amount, uint256 timestamp);
    event ScheduledPaymentModified(address indexed creator, bytes32 paymentId, uint256 amount, uint256 timestamp);
    event ScheduledPaymentCancelled(address indexed creator, bytes32 paymentId);
    
    /**
     * @dev Initialize contract with token address
     * @param _tokenAddress Address of the ERC20 token
     */
    constructor(address _tokenAddress) {
        token = IERC20(_tokenAddress);
        maxLoanAmount = 1000 * 10**18; // 1000 tokens
    }
    
    /**
     * @dev Set profile information
     * @param _username Username
     * @param _role User role (consumer, business, etc.)
     * @param _country Country code
     */
    function setUsername(string memory _username, string memory _role, string memory _country) external {
        require(bytes(_username).length > 0, "Username cannot be empty");
        require(addressByUsername[_username] == address(0) || addressByUsername[_username] == msg.sender, "Username already taken");
        
        // Update user data
        usernameOf[msg.sender] = _username;
        userRoles[msg.sender] = _role;
        userCountry[msg.sender] = _country;
        addressByUsername[_username] = msg.sender;
        
        emit ProfileUpdated(msg.sender, _username, _role, _country);
    }
    
    /**
     * @dev Register a business account
     * @param _businessName Business name
     * @param _businessType Business type
     * @param _registrationNumber Business registration number
     */
    function registerBusinessAccount(
        string memory _businessName,
        string memory _businessType,
        string memory _registrationNumber
    ) external {
        require(bytes(usernameOf[msg.sender]).length > 0, "Set username first");
        
        businessAccounts[msg.sender] = BusinessAccount({
            verified: false,
            businessType: _businessType,
            businessName: _businessName,
            registrationNumber: _registrationNumber
        });
        
        userRoles[msg.sender] = "business";
        
        emit BusinessAccountRegistered(msg.sender, _businessName, _businessType, _registrationNumber);
    }
    
    /**
     * @dev Verify a business account (onlyOwner)
     * @param _business Business account address
     */
    function verifyBusinessAccount(address _business) external onlyOwner {
        require(bytes(usernameOf[_business]).length > 0, "Account not registered");
        businessAccounts[_business].verified = true;
    }
    
    /**
     * @dev Deposit tokens to NepaliPay
     * @param _amount Amount to deposit
     */
    function depositTokens(uint256 _amount) external {
        require(_amount > 0, "Cannot deposit 0 tokens");
        
        // Transfer tokens from sender to contract
        require(token.transferFrom(msg.sender, address(this), _amount), "Token transfer failed");
        
        // Update balance
        balance[msg.sender] += _amount;
        
        emit Deposited(msg.sender, _amount);
    }
    
    /**
     * @dev Withdraw tokens from NepaliPay
     * @param _amount Amount to withdraw
     */
    function withdrawTokens(uint256 _amount) external nonReentrant {
        require(_amount > 0, "Cannot withdraw 0 tokens");
        require(balance[msg.sender] >= _amount, "Insufficient balance");
        
        // Update balance
        balance[msg.sender] -= _amount;
        
        // Transfer tokens from contract to sender
        require(token.transfer(msg.sender, _amount), "Token transfer failed");
        
        emit Withdrawn(msg.sender, _amount);
    }
    
    /**
     * @dev Send tokens to another user
     * @param _recipient Recipient address
     * @param _amount Amount to send
     * @param _description Transaction description
     */
    function sendTokens(address _recipient, uint256 _amount, string memory _description) external nonReentrant {
        require(_recipient != address(0), "Invalid recipient");
        require(_recipient != msg.sender, "Cannot send to self");
        require(_amount > 0, "Cannot send 0 tokens");
        require(balance[msg.sender] >= _amount, "Insufficient balance");
        
        // Update balances
        balance[msg.sender] -= _amount;
        balance[_recipient] += _amount;
        
        // Record transaction
        uint256 txId = transactionCount++;
        transactions[txId] = Transaction({
            id: txId,
            sender: msg.sender,
            recipient: _recipient,
            amount: _amount,
            description: _description,
            timestamp: block.timestamp
        });
        
        userTransactions[msg.sender].push(txId);
        userTransactions[_recipient].push(txId);
        
        emit Transfer(msg.sender, _recipient, _amount, _description);
    }
    
    /**
     * @dev Make a payment to a business account by username
     * @param _recipientUsername Business account username
     * @param _amount Amount to send
     * @param _description Transaction description
     */
    function makeBusinessPayment(string memory _recipientUsername, uint256 _amount, string memory _description) external nonReentrant {
        address recipient = addressByUsername[_recipientUsername];
        require(recipient != address(0), "Recipient not found");
        require(businessAccounts[recipient].verified, "Not a verified business account");
        require(_amount > 0, "Cannot send 0 tokens");
        require(balance[msg.sender] >= _amount, "Insufficient balance");
        
        // Update balances
        balance[msg.sender] -= _amount;
        balance[recipient] += _amount;
        
        // Record transaction
        uint256 txId = transactionCount++;
        transactions[txId] = Transaction({
            id: txId,
            sender: msg.sender,
            recipient: recipient,
            amount: _amount,
            description: _description,
            timestamp: block.timestamp
        });
        
        userTransactions[msg.sender].push(txId);
        userTransactions[recipient].push(txId);
        
        emit BusinessPayment(msg.sender, _recipientUsername, _amount, _description);
    }
    
    /**
     * @dev Take a loan
     * @param _amount Loan amount
     */
    function takeLoan(uint256 _amount) external nonReentrant {
        require(_amount > 0, "Cannot borrow 0 tokens");
        require(_amount <= maxLoanAmount, "Exceeds maximum loan amount");
        require(!loans[msg.sender].active, "Existing loan must be repaid first");
        
        // Calculate interest
        uint256 interest = (_amount * loanInterestRate) / 10000;
        
        // Create loan
        loans[msg.sender] = Loan({
            amount: _amount,
            dueDate: block.timestamp + loanDuration,
            interest: interest,
            active: true
        });
        
        // Update balance
        balance[msg.sender] += _amount;
        
        emit LoanTaken(msg.sender, _amount, block.timestamp + loanDuration);
    }
    
    /**
     * @dev Repay a loan
     * @param _amount Amount to repay
     */
    function repayLoan(uint256 _amount) external nonReentrant {
        Loan storage loan = loans[msg.sender];
        require(loan.active, "No active loan");
        
        uint256 totalDue = loan.amount + loan.interest;
        require(_amount <= totalDue, "Amount exceeds loan debt");
        require(balance[msg.sender] >= _amount, "Insufficient balance");
        
        // Deduct from balance
        balance[msg.sender] -= _amount;
        
        // Update loan
        if (_amount == totalDue) {
            // Full repayment
            loan.active = false;
        } else {
            // Partial repayment
            uint256 principalPaid = (_amount * loan.amount) / totalDue;
            uint256 interestPaid = _amount - principalPaid;
            
            loan.amount -= principalPaid;
            loan.interest -= interestPaid;
        }
        
        emit LoanRepaid(msg.sender, _amount);
    }
    
    /**
     * @dev Start a crowdfunding campaign
     * @param _campaignId Campaign ID
     * @param _targetAmount Target amount
     * @param _description Campaign description
     */
    function startCampaign(bytes32 _campaignId, uint256 _targetAmount, string memory _description) external {
        require(_targetAmount > 0, "Target amount must be positive");
        require(crowdfundingCampaigns[msg.sender][_campaignId].targetAmount == 0, "Campaign already exists");
        
        crowdfundingCampaigns[msg.sender][_campaignId] = Campaign({
            creator: msg.sender,
            targetAmount: _targetAmount,
            raisedAmount: 0,
            description: _description,
            active: true,
            deadline: block.timestamp + 30 days
        });
        
        emit CampaignCreated(msg.sender, _campaignId, _targetAmount, _description);
    }
    
    /**
     * @dev Contribute to a crowdfunding campaign
     * @param _campaignId Campaign ID
     * @param _amount Amount to contribute
     */
    function contribute(bytes32 _campaignId, uint256 _amount) external nonReentrant {
        address creator = crowdfundingCampaigns[msg.sender][_campaignId].creator;
        if (creator == address(0)) {
            // Check if campaign exists for any other creator
            for (uint i = 0; i < 5; i++) { // Check a few recent contributors
                address potentialCreator = address(uint160(uint256(keccak256(abi.encodePacked(i, _campaignId)))));
                if (crowdfundingCampaigns[potentialCreator][_campaignId].active) {
                    creator = potentialCreator;
                    break;
                }
            }
        }
        
        require(creator != address(0), "Campaign not found");
        require(_amount > 0, "Cannot contribute 0 tokens");
        require(balance[msg.sender] >= _amount, "Insufficient balance");
        
        Campaign storage campaign = crowdfundingCampaigns[creator][_campaignId];
        require(campaign.active, "Campaign is not active");
        require(block.timestamp <= campaign.deadline, "Campaign has ended");
        
        // Update balances
        balance[msg.sender] -= _amount;
        campaign.raisedAmount += _amount;
        
        // Record contribution
        contributions[msg.sender][_campaignId] += _amount;
        
        emit ContributionMade(msg.sender, creator, _campaignId, _amount);
        
        // Auto-close campaign if target is reached
        if (campaign.raisedAmount >= campaign.targetAmount) {
            campaign.active = false;
            balance[creator] += campaign.raisedAmount;
        }
    }
    
    /**
     * @dev Get staking info for a user
     * @param user User address
     * @return isStaking Whether user is staking
     * @return stakedAmount Amount staked
     * @return rewards Current rewards
     */
    function getStakingInfo(address user) public view returns (bool isStaking, uint256 stakedAmount, uint256 rewards) {
        StakingData storage staking = stakingInfo[user];
        return (staking.isStaking, staking.stakedAmount, staking.rewards);
    }
    
    /**
     * @dev Set up a scheduled payment
     * @param _paymentId Unique payment ID
     * @param _amount Amount to send
     * @param _timestamp Timestamp when payment should execute
     */
    function setScheduledPayment(bytes32 _paymentId, uint256 _amount, uint256 _timestamp) external {
        require(_amount > 0, "Amount must be positive");
        require(_timestamp > block.timestamp, "Timestamp must be in the future");
        require(scheduledPayments[msg.sender][_paymentId].amount == 0, "Payment already scheduled");
        
        scheduledPayments[msg.sender][_paymentId] = ScheduledPayment({
            amount: _amount,
            timestamp: _timestamp,
            active: true
        });
        
        emit ScheduledPaymentCreated(msg.sender, _paymentId, _amount, _timestamp);
    }
    
    /**
     * @dev Modify a scheduled payment
     * @param _paymentId Payment ID
     * @param _amount New amount
     * @param _timestamp New timestamp
     */
    function modifyScheduledPayment(bytes32 _paymentId, uint256 _amount, uint256 _timestamp) external {
        require(scheduledPayments[msg.sender][_paymentId].active, "Payment not found or inactive");
        require(_amount > 0, "Amount must be positive");
        require(_timestamp > block.timestamp, "Timestamp must be in the future");
        
        scheduledPayments[msg.sender][_paymentId].amount = _amount;
        scheduledPayments[msg.sender][_paymentId].timestamp = _timestamp;
        
        emit ScheduledPaymentModified(msg.sender, _paymentId, _amount, _timestamp);
    }
    
    /**
     * @dev Cancel a scheduled payment
     * @param _paymentId Payment ID
     */
    function cancelScheduledPayment(bytes32 _paymentId) external {
        require(scheduledPayments[msg.sender][_paymentId].active, "Payment not found or already cancelled");
        
        scheduledPayments[msg.sender][_paymentId].active = false;
        
        emit ScheduledPaymentCancelled(msg.sender, _paymentId);
    }
    
    /**
     * @dev Execute scheduled payments
     * @param _user User address
     * @param _paymentIds Array of payment IDs to execute
     */
    function executeScheduledPayments(address _user, bytes32[] memory _paymentIds) external {
        for (uint i = 0; i < _paymentIds.length; i++) {
            bytes32 paymentId = _paymentIds[i];
            ScheduledPayment storage payment = scheduledPayments[_user][paymentId];
            
            if (payment.active && payment.timestamp <= block.timestamp && balance[_user] >= payment.amount) {
                // Deduct from sender
                balance[_user] -= payment.amount;
                
                // Add to recipient (contract owner for now, can be modified)
                balance[owner()] += payment.amount;
                
                // Mark payment as inactive
                payment.active = false;
            }
        }
    }
    
    /**
     * @dev Update loan parameters (onlyOwner)
     * @param _interestRate New interest rate in basis points
     * @param _loanDuration New loan duration in seconds
     * @param _maxLoanAmount New maximum loan amount
     */
    function updateLoanParameters(
        uint256 _interestRate,
        uint256 _loanDuration,
        uint256 _maxLoanAmount
    ) external onlyOwner {
        require(_interestRate <= 3000, "Interest rate too high, max 30%");
        
        loanInterestRate = _interestRate;
        loanDuration = _loanDuration;
        maxLoanAmount = _maxLoanAmount;
    }
    
    /**
     * @dev Get user's transaction count
     * @param _user User address
     * @return transactionCount Number of transactions
     */
    function getUserTransactionCount(address _user) external view returns (uint256) {
        return userTransactions[_user].length;
    }
    
    /**
     * @dev Get paginated user transactions
     * @param _user User address
     * @param _offset Starting index
     * @param _limit Number of transactions to return
     * @return Transaction IDs
     */
    function getUserTransactionsPaginated(address _user, uint256 _offset, uint256 _limit) 
        external 
        view 
        returns (uint256[] memory) 
    {
        uint256[] storage userTxns = userTransactions[_user];
        uint256 txCount = userTxns.length;
        
        if (_offset >= txCount) {
            return new uint256[](0);
        }
        
        uint256 end = _offset + _limit;
        if (end > txCount) {
            end = txCount;
        }
        
        uint256 resultCount = end - _offset;
        uint256[] memory result = new uint256[](resultCount);
        
        for (uint256 i = 0; i < resultCount; i++) {
            result[i] = userTxns[txCount - 1 - (_offset + i)]; // Return in reverse order (newest first)
        }
        
        return result;
    }
    
    /**
     * @dev Emergency withdraw tokens (onlyOwner)
     * @param _token Token address
     * @param _amount Amount to withdraw
     */
    function emergencyWithdraw(address _token, uint256 _amount) external onlyOwner {
        IERC20(_token).transfer(owner(), _amount);
    }
}