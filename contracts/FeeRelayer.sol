// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.5.0/contracts/access/Ownable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.5.0/contracts/token/ERC20/IERC20.sol";

/**
 * @title FeeRelayer
 * @dev Contract to handle gas fee relaying for NepalPay application
 */
contract FeeRelayer is Ownable {
    // Address of the NepalPay token
    IERC20 public token;
    
    // Fee configurations
    uint256 public relayFeePercentage = 1; // 1% relay fee
    mapping(address => bool) public feeExempt; // Addresses exempt from fees
    mapping(address => uint256) public customFeePercentage; // Custom fee percentages for specific addresses
    
    // Relayer registry
    mapping(address => bool) public isRelayer;
    mapping(address => uint256) public relayerBalance;
    
    // Events
    event RelayerAdded(address indexed relayer);
    event RelayerRemoved(address indexed relayer);
    event FeeCollected(address indexed from, address indexed relayer, uint256 amount);
    event FeeExemptionSet(address indexed user, bool exempt);
    event CustomFeeSet(address indexed user, uint256 feePercentage);
    event RelayerFeePaid(address indexed relayer, uint256 amount);
    
    constructor(address _tokenAddress) {
        token = IERC20(_tokenAddress);
        isRelayer[msg.sender] = true;
    }
    
    /**
     * @dev Set or remove fee exemption status for a user
     * @param _user The user address
     * @param _exempt Whether the user is exempt from fees
     */
    function setFeeExemption(address _user, bool _exempt) external onlyOwner {
        feeExempt[_user] = _exempt;
        emit FeeExemptionSet(_user, _exempt);
    }
    
    /**
     * @dev Set a custom fee percentage for a specific user
     * @param _user The user address
     * @param _feePercentage The custom fee percentage
     */
    function setCustomFee(address _user, uint256 _feePercentage) external onlyOwner {
        require(_feePercentage <= 10, "Fee percentage cannot exceed 10%");
        customFeePercentage[_user] = _feePercentage;
        emit CustomFeeSet(_user, _feePercentage);
    }
    
    /**
     * @dev Add a new relayer
     * @param _relayer The address of the relayer
     */
    function addRelayer(address _relayer) external onlyOwner {
        isRelayer[_relayer] = true;
        emit RelayerAdded(_relayer);
    }
    
    /**
     * @dev Remove a relayer
     * @param _relayer The address of the relayer
     */
    function removeRelayer(address _relayer) external onlyOwner {
        isRelayer[_relayer] = false;
        emit RelayerRemoved(_relayer);
    }
    
    /**
     * @dev Relay a transaction and collect fees
     * @param _from The address paying for the transaction
     * @param _value The value of the transaction
     */
    function relayTransaction(address _from, uint256 _value) external {
        require(isRelayer[msg.sender], "Caller is not a relayer");
        
        uint256 fee;
        if (!feeExempt[_from]) {
            fee = customFeePercentage[_from] > 0 
                ? (_value * customFeePercentage[_from]) / 100 
                : (_value * relayFeePercentage) / 100;
        }
        
        if (fee > 0) {
            // Transfer fee from user to contract
            require(token.transferFrom(_from, address(this), fee), "Fee transfer failed");
            
            // Add fee to relayer's balance
            relayerBalance[msg.sender] += fee;
            
            emit FeeCollected(_from, msg.sender, fee);
        }
    }
    
    /**
     * @dev Withdraw collected fees
     * @param _amount The amount to withdraw
     */
    function withdrawFees(uint256 _amount) external {
        require(isRelayer[msg.sender], "Caller is not a relayer");
        require(relayerBalance[msg.sender] >= _amount, "Insufficient balance");
        
        relayerBalance[msg.sender] -= _amount;
        require(token.transfer(msg.sender, _amount), "Fee withdrawal failed");
        
        emit RelayerFeePaid(msg.sender, _amount);
    }
    
    /**
     * @dev Set the global relay fee percentage
     * @param _feePercentage The new fee percentage
     */
    function setRelayFeePercentage(uint256 _feePercentage) external onlyOwner {
        require(_feePercentage <= 10, "Fee percentage cannot exceed 10%");
        relayFeePercentage = _feePercentage;
    }
}