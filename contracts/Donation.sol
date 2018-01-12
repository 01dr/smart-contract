pragma solidity ^0.4.18;

import 'zeppelin-solidity/contracts/math/SafeMath.sol';
import 'zeppelin-solidity/contracts/ownership/Ownable.sol';

contract Donation is Ownable {
  using SafeMath for uint;

  uint balance;
  uint hardcap;
  uint startDate;
  uint endDate;
  uint fundProportion = 85;
  address beneficiary;
  address fund;
  mapping(address => uint) public donators;
  bool isHardcapReached;
  bool isCampaignEnded = false;

  event NewDonation(address indexed donator, uint etherAmount);

  function Donation(
      uint _startDate,
      uint _endDate,
      uint _hardcap,
      address _beneficiary,
      address _fund
    ) public {
    startDate = _startDate;
    endDate = _endDate;
    hardcap = _hardcap;
    beneficiary = _beneficiary;
    fund = _fund;
  }

  modifier deadlineHasExpired() {
    require(now > endDate);
    _;
  }

  modifier hardcapReached() {
    require(balance >= hardcap);
    _;
  }

  modifier hardcapNotReached() {
    require(balance < hardcap);
    _;
  }

  function () public payable {
    require(now > startDate);
    require(now < endDate);
    balance = balance.add(msg.value);
    NewDonation(msg.sender, msg.value);
  }

  function refund() private deadlineHasExpired hardcapNotReached {
    uint val = donators[msg.sender];
    donators[msg.sender] = 0;
    msg.sender.transfer(val);
  }

  function withdraw() public onlyOwner hardcapReached {
    uint toBeneficiary = balance.div(100).mul(fundProportion);
    uint toFund = balance.sub(toBeneficiary);
    beneficiary.transfer(toBeneficiary);
    fund.transfer(toFund);
    isCampaignEnded = true;
  }
}
