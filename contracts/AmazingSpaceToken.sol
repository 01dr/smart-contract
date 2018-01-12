pragma solidity ^0.4.18;

import 'zeppelin-solidity/contracts/token/StandardToken.sol';

contract AmazingSpaceCoin is StandardToken {
  string public name = 'Amazing Space Coin';
  string public symbol = 'ASC';
  uint public decimals = 18;
  uint public INITIAL_SUPPLY = 1000;

  function AmazingSpaceCoin() public {
    totalSupply = INITIAL_SUPPLY;
    balances[msg.sender] = INITIAL_SUPPLY;
  }
}
