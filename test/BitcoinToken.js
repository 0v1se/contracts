var BitcoinToken = artifacts.require('./bitcoin/BitcoinToken.sol');

const awaitEvent = require('./helpers/awaitEvent');
import expectThrow from './helpers/expectThrow';

contract("BitcoinToken", accounts => {
    it("should throw if burn value is small", async () => {
        const token = await BitcoinToken.new(1000);

        await token.mint(accounts[1], 10000, "tx");
        assert.equal(await token.balanceOf.call(accounts[1]), 10000);

        await token.burn(1000, "data", {from: accounts[1]});

        await expectThrow(
            token.burn(500, "data", {from: accounts[1]});
        );

        assert.equal(await token.balanceOf.call(accounts[1]), 9000);
    });
});