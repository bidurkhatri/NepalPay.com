// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.5.0/contracts/token/ERC20/ERC20.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.5.0/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.5.0/contracts/access/Ownable.sol";

/**
 * @title NepalPayToken
 * @dev ERC20 Token for NepalPay application
 */
contract NepalPayToken is ERC20, ERC20Burnable, Ownable {
    uint256 private constant INITIAL_SUPPLY = 1000000 * 10**18; // 1 million tokens with 18 decimals
    uint256 public tokenPrice = 0.50 * 10**18; // Initial token price in USD

    constructor() ERC20("NepalPay Token", "NPT") {
        _mint(msg.sender, INITIAL_SUPPLY);
    }

    /**
     * @dev Update the token price.
     * @param _newPrice The new price in USD.
     */
    function updateTokenPrice(uint256 _newPrice) external onlyOwner {
        tokenPrice = _newPrice;
    }

    /**
     * @dev Get the current token price.
     * @return The current token price in USD.
     */
    function getTokenPrice() external view returns (uint256) {
        return tokenPrice;
    }

    /**
     * @dev Mint new tokens.
     * @param _to The address to mint tokens to.
     * @param _amount The amount of tokens to mint.
     */
    function mint(address _to, uint256 _amount) external onlyOwner {
        _mint(_to, _amount);
    }
}