const Donation = artifacts.require('Donation');

const assertJump = function(error) {
  assert.isAbove(error.message.search(
    'VM Exception while processing transaction: revert'),
    -1,
    'Invalid opcode error must be returned'
  );
};

contract('DonationContract', (accounts) => {
  let instance;
  const hardcap = 50;
  const startDate = 1515542400; // 01/10/2018 @ 12:00am (UTC)
  const endDate = 1515974400;   // 01/15/2018 @ 12:00am (UTC)
  const owner = accounts[0];
  const beneficiary = accounts[8];
  const fund = accounts[9];

  beforeEach(async () => {
    instance = await Donation.deployed(
      startDate,
      endDate,
      hardcap,
      beneficiary,
      fund
    );
  });

  // Невладелец не может менять владельца контракта
  it('Should not allowed change ownership by not owner', async () => {});

  // Владелец может менять владельца контракта
  it('Should allowed change ownnership by owner', async () => {});

  // Никто не может менять дату окончания кампании
  it('Should not allowed change deadline by any', async () => {});

  // Никто не может менять хардкэп
  it('Should not allowed change hardcap by any', async () => {});

  it('Should allow donate', async () => {
    await instance.sendTransaction({ value: 1 * 10 ** 18, from: accounts[5] });
  });

  // Никто не может донатить пока кампания не началась
  it('Should not allowed donate when campaign not started', async () => {
    try {
      await instance.sendTransaction({ value: 1 * 10 ** 18, from: accounts[5] });
    } catch (e) {
      return assertJump(e);
    }

    assert.fail('Expected throw not received');
  });

  // Никто не может донатить когда кампания закончилась (дедлайн или хардкэп)
  it('Should not allowed donate when campaign ended (deadline or hardcap)', async () => {
    await instance.sendTransaction({ value: 50 * 10 ** 18, from: accounts[5] });

    try {
      await instance.sendTransaction({ value: 1 * 10 ** 18, from: accounts[5] });
    } catch (e) {
      return assertJump(e);
    }

    assert.fail('Expected throw not received');
  });

  // Должен отправить 15% фонду когда хардкэп будет собран
  it('Should send 15% of hardcap to fund when hardcap reached', async () => {});

  // Должен отправить 85% ребенку когда хардкэп будет собран
  it('Should send 85% of hardcap to child when hardcap reached', async () => {});

  // Должен вернуть средства донатерам если хардкэп не собран
  it('Should refund when hardcap not reached and deadline has expired', async () => {});

  // it('Should return correct total supply after construction', async () => {
  //   const balance = await instance.balanceOf(owner);
  //   const supply = await instance.totalSupply();
  //
  //   assert.equal(balance, 1000, 'Owner balance must be 1000');
  //   assert.equal(supply, 1000, 'Total supply must be 1000');
  // });
  //
  // it('Should allow transfer', async () => {
  //   await instance.transfer(secondAccount, 19);
  //   const ownerBalance = await instance.balanceOf(owner);
  //   const secondAccountBalance = await instance.balanceOf(secondAccount);
  //
  //   assert.equal(ownerBalance.valueOf(), 1000 - 19, 'Owner balance must be 981');
  //   assert.equal(secondAccountBalance.valueOf(), 0 + 19, 'Second account balance must be 19');
  // });
});
