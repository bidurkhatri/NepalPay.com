// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.5.0/contracts/token/ERC20/ERC20.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.5.0/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.5.0/contracts/security/Pausable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.5.0/contracts/access/Ownable.sol";

/**
 * @title NepaliPayToken
 * @dev ERC20 token with staking, burning, and pause capabilities
 */
contract NepaliPayToken is ERC20, ERC20Burnable, Pausable, Ownable {
    // Staking related variables
    struct StakingInfo {
        uint256 amount;
        uint256 since;
        uint256 claimedRewards;
    }
    
    // Annual interest rate for staking (in basis points, 1000 = 10%)
    uint256 public stakingInterestRate = 1000;
    
    // Minimum staking period in seconds (30 days)
    uint256 public minimumStakingPeriod = 30 days;
    
    // Maximum tokens that can be staked by a single address
    uint256 public maxStakingAmount = 100000 * 10**18; // 100,000 tokens
    
    // Mapping to track staking balances and timestamps
    mapping(address => StakingInfo) public stakingBalances;
    
    // Total tokens currently staked
    uint256 public totalStaked;
    
    // Events
    event Staked(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount);
    event RewardPaid(address indexed user, uint256 reward);
    event StakingRateUpdated(uint256 newRate);
    
    /**
     * @dev Initialize the token with 100 million tokens
     */
    constructor() ERC20("NepaliPay Token", "NPT") {
        // Mint 100 million tokens to the deployer
        _mint(msg.sender, 100000000 * 10**18);
    }
    
    /**
     * @dev Pause token transfers
     */
    function pause() public onlyOwner {
        _pause();
    }
    
    /**
     * @dev Unpause token transfers
     */
    function unpause() public onlyOwner {
        _unpause();
    }
    
    /**
     * @dev Mint new tokens
     * @param to Recipient address
     * @param amount Amount to mint
     */
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
    
    /**
     * @dev Hook that is called before any token transfer
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override whenNotPaused {
        super._beforeTokenTransfer(from, to, amount);
    }
    
    /**
     * @dev Stake tokens
     * @param amount Amount to stake
     */
    function stake(uint256 amount) public {
        require(amount > 0, "Cannot stake 0 tokens");
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");
        require(stakingBalances[msg.sender].amount + amount <= maxStakingAmount, "Exceeds maximum staking amount");
        
        // Transfer tokens from caller to contract
        _transfer(msg.sender, address(this), amount);
        
        // Update staking info
        if (stakingBalances[msg.sender].amount > 0) {
            // If already staking, calculate and claim rewards first
            uint256 reward = calculateReward(msg.sender);
            if (reward > 0) {
                _mint(msg.sender, reward);
                stakingBalances[msg.sender].claimedRewards += reward;
                emit RewardPaid(msg.sender, reward);
            }
        } else {
            // First time staking
            stakingBalances[msg.sender].since = block.timestamp;
        }
        
        stakingBalances[msg.sender].amount += amount;
        totalStaked += amount;
        
        emit Staked(msg.sender, amount);
    }
    
    /**
     * @dev Unstake tokens
     * @param amount Amount to unstake
     */
    function unstake(uint256 amount) public {
        StakingInfo storage staking = stakingBalances[msg.sender];
        require(staking.amount >= amount, "Insufficient staked amount");
        require(block.timestamp >= staking.since + minimumStakingPeriod, "Minimum staking period not reached");
        
        // Calculate rewards
        uint256 reward = calculateReward(msg.sender);
        
        // Update staking info
        staking.amount -= amount;
        totalStaked -= amount;
        
        if (staking.amount == 0) {
            // Reset staking timestamp if fully unstaked
            staking.since = 0;
        } else {
            // Update staking timestamp for remaining staked amount
            staking.since = block.timestamp;
        }
        
        // Pay rewards
        if (reward > 0) {
            _mint(msg.sender, reward);
            staking.claimedRewards += reward;
            emit RewardPaid(msg.sender, reward);
        }
        
        // Return staked tokens
        _transfer(address(this), msg.sender, amount);
        
        emit Unstaked(msg.sender, amount);
    }
    
    /**
     * @dev Calculate staking reward for a user
     * @param user User address
     * @return Calculated reward
     */
    function calculateReward(address user) public view returns (uint256) {
        StakingInfo storage staking = stakingBalances[user];
        
        if (staking.amount == 0 || staking.since == 0) {
            return 0;
        }
        
        // Calculate time staked in seconds
        uint256 stakingDuration = block.timestamp - staking.since;
        
        // Calculate rewards (amount * rate * time / year in seconds)
        uint256 reward = staking.amount * stakingInterestRate * stakingDuration / (10000 * 365 days);
        
        return reward;
    }
    
    /**
     * @dev Get staking information for a user
     * @param user User address
     * @return staked Amount staked
     * @return since Timestamp when staking started
     * @return reward Current unclaimed reward
     */
    function getStakingInfo(address user) public view returns (uint256 staked, uint256 since, uint256 reward) {
        StakingInfo storage staking = stakingBalances[user];
        return (staking.amount, staking.since, calculateReward(user));
    }
    
    /**
     * @dev Update staking interest rate (onlyOwner)
     * @param newRate New interest rate in basis points (100 = 1%)
     */
    function updateStakingRate(uint256 newRate) public onlyOwner {
        require(newRate <= 3000, "Rate too high, max 30%");
        stakingInterestRate = newRate;
        emit StakingRateUpdated(newRate);
    }
    
    /**
     * @dev Update minimum staking period (onlyOwner)
     * @param newPeriod New minimum period in seconds
     */
    function updateMinimumStakingPeriod(uint256 newPeriod) public onlyOwner {
        require(newPeriod <= 365 days, "Period too long, max 1 year");
        minimumStakingPeriod = newPeriod;
    }
    
    /**
     * @dev Update maximum staking amount (onlyOwner)
     * @param newMax New maximum in token units
     */
    function updateMaxStakingAmount(uint256 newMax) public onlyOwner {
        maxStakingAmount = newMax;
    }
    
    /**
     * @dev Claim staking rewards without unstaking
     */
    function claimRewards() public {
        uint256 reward = calculateReward(msg.sender);
        require(reward > 0, "No rewards to claim");
        
        // Update staking timestamp
        stakingBalances[msg.sender].since = block.timestamp;
        stakingBalances[msg.sender].claimedRewards += reward;
        
        // Mint rewards
        _mint(msg.sender, reward);
        
        emit RewardPaid(msg.sender, reward);
    }
}