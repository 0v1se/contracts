var BitcoinToken = artifacts.require('./bitcoin/BitcoinToken.sol');

const awaitEvent = require('./helpers/awaitEvent');
import expectThrow from './helpers/expectThrow';

contract("BitcoinToken", accounts => {
    it("should not let burn less than 1000", async () => {
        const token = await BitcoinToken.new(1000);

        await token.mint(accounts[1], 10000, "tx");
        assert.equal(await token.balanceOf.call(accounts[1]), 10000);

        await token.burn(2000, "0x7c4890028c6f80d436de051148ed9014c1669427", {from: accounts[1]});

        await expectThrow(
            token.burn(500, "0x7c4890028c6f80d436de051148ed9014c1669427", {from: accounts[1]})
        );

        assert.equal(await token.balanceOf.call(accounts[1]), 8000);
    });
});