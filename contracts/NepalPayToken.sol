// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.5.0/contracts/token/ERC20/ERC20.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.5.0/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.5.0/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.5.0/contracts/access/Ownable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.5.0/contracts/utils/math/SafeMath.sol";

/**
 * @title NepalPayToken
 * @dev ERC20 Token for NepalPay, with burn and pause functionality
 */
contract NepalPayToken is ERC20, ERC20Burnable, ERC20Pausable, Ownable {
    using SafeMath for uint256;

    uint256 private constant INITIAL_SUPPLY = 1000000000 * (10 ** 18); // 1 billion tokens with 18 decimals
    uint256 public maxSupply = 1000000000 * (10 ** 18); // 1 billion tokens maximum supply

    mapping(address => bool) public frozenAccounts;
    mapping(address => uint256) public vestingSchedule;
    mapping(address => uint256) public stakeAmount;
    mapping(address => uint256) public stakeTime;
    mapping(address => uint256) public rewards;

    uint256 public rewardRate = 10; // 10% annual staking reward
    uint256 public minStakeTime = 30 days; // Minimum staking time to earn rewards
    uint256 public tokenPrice = 0.01 ether; // 0.01 ETH per token

    event FrozenAccount(address indexed target, bool frozen);
    event VestingScheduleSet(address indexed beneficiary, uint256 releaseTime);
    event TokensStaked(address indexed user, uint256 amount);
    event TokensUnstaked(address indexed user, uint256 amount, uint256 reward);
    event TokensBought(address indexed buyer, uint256 amount, uint256 value);
    event TokensSold(address indexed seller, uint256 amount, uint256 value);
    event TokenPriceUpdated(uint256 newPrice);
    event MaxSupplyUpdated(uint256 newMaxSupply);
    event RewardRateUpdated(uint256 newRate);

    constructor() ERC20("NepalPay Token", "NPT") {
        _mint(_msgSender(), INITIAL_SUPPLY);
    }

    /**
     * @dev Required override for _beforeTokenTransfer used in multiple parent contracts
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override(ERC20, ERC20Pausable) {
        require(!frozenAccounts[from], "NepalPayToken: sender account is frozen");
        require(!frozenAccounts[to], "NepalPayToken: recipient account is frozen");
        
        // Check vesting schedule
        if (from != address(0) && vestingSchedule[from] > 0) {
            require(block.timestamp >= vestingSchedule[from], "NepalPayToken: tokens are still locked in vesting");
        }
        
        super._beforeTokenTransfer(from, to, amount);
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
     * @dev Freeze or unfreeze account
     * @param account The address to freeze/unfreeze
     * @param freeze Whether to freeze (true) or unfreeze (false)
     */
    function freezeAccount(address account, bool freeze) public onlyOwner {
        frozenAccounts[account] = freeze;
        emit FrozenAccount(account, freeze);
    }

    /**
     * @dev Set vesting schedule for an account
     * @param account The address to set vesting for
     * @param releaseTime The timestamp when tokens will be available
     */
    function setVestingSchedule(address account, uint256 releaseTime) public onlyOwner {
        require(releaseTime > block.timestamp, "NepalPayToken: release time must be in the future");
        vestingSchedule[account] = releaseTime;
        emit VestingScheduleSet(account, releaseTime);
    }

    /**
     * @dev Mint new tokens
     * @param to The address to mint tokens to
     * @param amount The amount of tokens to mint
     */
    function mint(address to, uint256 amount) public onlyOwner {
        require(totalSupply().add(amount) <= maxSupply, "NepalPayToken: minting would exceed max supply");
        _mint(to, amount);
    }

    /**
     * @dev Update max supply
     * @param newMaxSupply The new maximum supply
     */
    function updateMaxSupply(uint256 newMaxSupply) public onlyOwner {
        require(newMaxSupply >= totalSupply(), "NepalPayToken: new max supply must be greater than current total supply");
        maxSupply = newMaxSupply;
        emit MaxSupplyUpdated(newMaxSupply);
    }

    /**
     * @dev Stake tokens to earn rewards
     * @param amount The amount of tokens to stake
     */
    function stake(uint256 amount) public {
        require(amount > 0, "NepalPayToken: stake amount must be greater than zero");
        require(balanceOf(_msgSender()) >= amount, "NepalPayToken: insufficient balance");
        
        // If user already has staked tokens, calculate and add rewards before updating stake
        if (stakeAmount[_msgSender()] > 0) {
            calculateReward(_msgSender());
        }
        
        // Transfer tokens from user to contract (stake)
        _transfer(_msgSender(), address(this), amount);
        
        // Update stake details
        stakeAmount[_msgSender()] = stakeAmount[_msgSender()].add(amount);
        stakeTime[_msgSender()] = block.timestamp;
        
        emit TokensStaked(_msgSender(), amount);
    }

    /**
     * @dev Unstake tokens and claim rewards
     * @param amount The amount of tokens to unstake
     */
    function unstake(uint256 amount) public {
        require(amount > 0, "NepalPayToken: unstake amount must be greater than zero");
        require(stakeAmount[_msgSender()] >= amount, "NepalPayToken: insufficient staked amount");
        
        // Calculate reward
        calculateReward(_msgSender());
        
        // Update stake amount
        stakeAmount[_msgSender()] = stakeAmount[_msgSender()].sub(amount);
        
        // Transfer staked tokens back to user
        _transfer(address(this), _msgSender(), amount);
        
        // Transfer rewards if any
        if (rewards[_msgSender()] > 0) {
            uint256 rewardAmount = rewards[_msgSender()];
            require(balanceOf(address(this)) >= rewardAmount, "NepalPayToken: insufficient balance for rewards");
            
            rewards[_msgSender()] = 0;
            _transfer(address(this), _msgSender(), rewardAmount);
            
            emit TokensUnstaked(_msgSender(), amount, rewardAmount);
        } else {
            emit TokensUnstaked(_msgSender(), amount, 0);
        }
    }

    /**
     * @dev Calculate staking reward for a user
     * @param user The address to calculate reward for
     */
    function calculateReward(address user) internal {
        if (stakeAmount[user] > 0 && block.timestamp > stakeTime[user]) {
            // Only calculate reward if minimum stake time has passed
            if (block.timestamp.sub(stakeTime[user]) >= minStakeTime) {
                uint256 stakingDuration = block.timestamp.sub(stakeTime[user]);
                uint256 rewardAmount = stakeAmount[user].mul(rewardRate).mul(stakingDuration).div(365 days).div(100);
                rewards[user] = rewards[user].add(rewardAmount);
            }
        }
    }

    /**
     * @dev Update staking reward rate
     * @param newRate The new reward rate (percentage)
     */
    function updateRewardRate(uint256 newRate) public onlyOwner {
        rewardRate = newRate;
        emit RewardRateUpdated(newRate);
    }

    /**
     * @dev Buy tokens with ETH
     */
    function buyTokens() public payable {
        require(msg.value > 0, "NepalPayToken: value must be greater than zero");
        
        uint256 tokenAmount = msg.value.mul(10 ** 18).div(tokenPrice);
        require(balanceOf(owner()) >= tokenAmount, "NepalPayToken: insufficient tokens available for sale");
        
        _transfer(owner(), _msgSender(), tokenAmount);
        emit TokensBought(_msgSender(), tokenAmount, msg.value);
    }

    /**
     * @dev Sell tokens for ETH
     * @param amount The amount of tokens to sell
     */
    function sellTokens(uint256 amount) public {
        require(amount > 0, "NepalPayToken: amount must be greater than zero");
        require(balanceOf(_msgSender()) >= amount, "NepalPayToken: insufficient balance");
        
        uint256 ethAmount = amount.mul(tokenPrice).div(10 ** 18);
        require(address(this).balance >= ethAmount, "NepalPayToken: insufficient ETH balance in contract");
        
        _transfer(_msgSender(), owner(), amount);
        payable(_msgSender()).transfer(ethAmount);
        
        emit TokensSold(_msgSender(), amount, ethAmount);
    }

    /**
     * @dev Update token price
     * @param newPrice The new token price in Wei
     */
    function updateTokenPrice(uint256 newPrice) public onlyOwner {
        require(newPrice > 0, "NepalPayToken: price must be greater than zero");
        tokenPrice = newPrice;
        emit TokenPriceUpdated(newPrice);
    }

    /**
     * @dev Withdraw ETH from contract (for owner)
     * @param amount The amount of ETH to withdraw
     */
    function withdrawETH(uint256 amount) public onlyOwner {
        require(amount > 0, "NepalPayToken: amount must be greater than zero");
        require(address(this).balance >= amount, "NepalPayToken: insufficient ETH balance");
        
        payable(owner()).transfer(amount);
    }

    /**
     * @dev Get user staking info
     * @param user The address to get info for
     * @return staked The amount of tokens staked
     * @return since The timestamp when staking started
     * @return reward The current reward amount
     */
    function getStakingInfo(address user) public view returns (uint256 staked, uint256 since, uint256 reward) {
        staked = stakeAmount[user];
        since = stakeTime[user];
        
        reward = rewards[user];
        
        // Calculate pending reward if staking
        if (staked > 0 && block.timestamp > since) {
            if (block.timestamp.sub(since) >= minStakeTime) {
                uint256 stakingDuration = block.timestamp.sub(since);
                uint256 pendingReward = staked.mul(rewardRate).mul(stakingDuration).div(365 days).div(100);
                reward = reward.add(pendingReward);
            }
        }
        
        return (staked, since, reward);
    }

    // Function to receive ETH
    receive() external payable {}
}