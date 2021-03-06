const assertJump = require('./helpers/assertJump');

var TokenMock = artifacts.require("./helpers/ERC20BasicMock.sol");

import expectThrow from './helpers/expectThrow';

contract('ERC20BasicImpl', function(accounts) {

  it("should return the correct totalSupply after construction", async function() {
    let token = await TokenMock.new(accounts[0], 100);
    let totalSupply = await token.totalSupply();

    assert.equal(totalSupply, 100);
  })

  it("should return correct balances after transfer", async function(){
    let token = await TokenMock.new(accounts[0], 100);
    let transfer = await token.transfer(accounts[1], 100);

    let firstAccountBalance = await token.balanceOf(accounts[0]);
    assert.equal(firstAccountBalance, 0);

    let secondAccountBalance = await token.balanceOf(accounts[1]);
    assert.equal(secondAccountBalance, 100);
  });

  it('should throw an error when trying to transfer more than balance', async function() {
    let token = await TokenMock.new(accounts[0], 100);
    try {
      let transfer = await token.transfer(accounts[1], 101);
      assert.fail('should have thrown before');
    } catch(error) {
      assertJump(error);
    }
  });

  it('should throw an error when trying to transfer to 0x0', async function() {
    let token = await TokenMock.new(accounts[0], 100);
    try {
      let transfer = await token.transfer(0x0, 100);
      assert.fail('should have thrown before');
    } catch(error) {
      assertJump(error);
    }
  });

  it('should throw an error when paused', async function() {
    let token = await TokenMock.new(accounts[0], 100);
    await token.pause();
    await expectThrow(
      token.transfer(accounts[1], 100)
    );
  });

});
