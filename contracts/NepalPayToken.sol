// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.5.0/contracts/token/ERC20/ERC20.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.5.0/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.5.0/contracts/access/Ownable.sol";

/**
 * @title NepalPayToken
 * @dev ERC20 token for the NepalPay application
 */
contract NepalPayToken is ERC20, ERC20Burnable, Ownable {
    uint8 private _decimals = 18;
    uint256 private _initialSupply = 1000000 * 10**_decimals; // 1 million tokens
    uint256 public tokenPrice = 1 * 10**15; // Initial price 0.001 ether per token
    
    mapping(address => bool) public isTokenAgent;
    
    event TokenAgentAdded(address indexed agent);
    event TokenAgentRemoved(address indexed agent);
    event TokenPriceUpdated(uint256 newPrice);
    event TokensMinted(address indexed recipient, uint256 amount);
    event TokensBurned(address indexed burner, uint256 amount);
    
    /**
     * @dev Constructor that gives the msg.sender all of existing tokens.
     */
    constructor() ERC20("NepalPay Token", "NPT") {
        _mint(msg.sender, _initialSupply);
        isTokenAgent[msg.sender] = true;
    }
    
    /**
     * @dev Returns the number of decimals used to get its user representation.
     */
    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }
    
    /**
     * @dev Function to add a token agent
     * @param _agent The address to add as a token agent
     */
    function addTokenAgent(address _agent) external onlyOwner {
        isTokenAgent[_agent] = true;
        emit TokenAgentAdded(_agent);
    }
    
    /**
     * @dev Function to remove a token agent
     * @param _agent The address to remove as a token agent
     */
    function removeTokenAgent(address _agent) external onlyOwner {
        isTokenAgent[_agent] = false;
        emit TokenAgentRemoved(_agent);
    }
    
    /**
     * @dev Function to update the token price
     * @param _newPrice The new token price in wei
     */
    function updateTokenPrice(uint256 _newPrice) external onlyOwner {
        tokenPrice = _newPrice;
        emit TokenPriceUpdated(_newPrice);
    }
    
    /**
     * @dev Function to buy tokens with ether
     */
    function buyTokens() external payable {
        require(msg.value > 0, "Send ETH to buy tokens");
        uint256 tokensToMint = (msg.value * 10**_decimals) / tokenPrice;
        require(tokensToMint > 0, "Not enough ETH sent");
        _mint(msg.sender, tokensToMint);
        emit TokensMinted(msg.sender, tokensToMint);
    }
    
    /**
     * @dev Function to mint tokens, only callable by token agents
     * @param _to The address to mint tokens to
     * @param _amount The amount of tokens to mint
     */
    function mintTokens(address _to, uint256 _amount) external {
        require(isTokenAgent[msg.sender] || owner() == msg.sender, "Not authorized to mint tokens");
        _mint(_to, _amount);
        emit TokensMinted(_to, _amount);
    }
    
    /**
     * @dev Function to burn tokens, only callable by token agents or the owner
     * @param _amount The amount of tokens to burn
     */
    function burnTokens(uint256 _amount) external {
        require(isTokenAgent[msg.sender] || owner() == msg.sender, "Not authorized to burn tokens");
        _burn(msg.sender, _amount);
        emit TokensBurned(msg.sender, _amount);
    }
    
    /**
     * @dev Function to withdraw ETH from the contract to the owner
     */
    function withdrawETH() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No ETH to withdraw");
        payable(owner()).transfer(balance);
    }
}