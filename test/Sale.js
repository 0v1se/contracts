var StandardTokenMock = artifacts.require('./helpers/StandardTokenMock.sol');
var Sale = artifacts.require('./sale/Sale.sol');
const expectThrow = require('./helpers/expectThrow');

contract("Sale", accounts => {
    it("should sell tokens for ether", async () => {
        let token = await StandardTokenMock.new(accounts[0], 100);
        let sale = await Sale.new(token.address, 10);

        let totalSupply = await token.totalSupply.call();
        await token.approve(sale.address, totalSupply.toNumber());

        await sale.buyTokens({from: accounts[1], value: 100});
        assert.equal(await token.balanceOf.call(accounts[1]), 10);
    });

    it("should not sell tokens for ether if price=0", async () => {
        let token = await StandardTokenMock.new(accounts[0], 100);
        let sale = await Sale.new(token.address, 0);

        let totalSupply = await token.totalSupply.call();
        await token.approve(sale.address, totalSupply.toNumber());

        try {
            await sale.buyTokens({from: accounts[1], value: 100});
        } catch (e) {
            return;
        }
        assert(false, "should throw because price <=0");
    });
});