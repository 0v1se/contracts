var TokenMock = artifacts.require('./helpers/ERC20Mock.sol');
var Sale = artifacts.require('./sale/Sale.sol');
const expectThrow = require('./helpers/expectThrow');

contract("Sale", accounts => {
    it("should sell tokens for ether", async () => {
        let token = await TokenMock.new(accounts[0], 100);
        let sale = await Sale.new(token.address, 10);

        let totalSupply = await token.totalSupply.call();
        await token.approve(sale.address, totalSupply.toNumber());

        await sale.sendTransaction({from: accounts[1], value: 100});
        assert.equal(await token.balanceOf.call(accounts[1]), 10);
    });

    it("should not sell tokens for ether if price=0", async () => {
        let token = await TokenMock.new(accounts[0], 100);
        let sale = await Sale.new(token.address, 0);

        let totalSupply = await token.totalSupply.call();
        await token.approve(sale.address, totalSupply.toNumber());

        try {
            await sale.sendTransaction({from: accounts[1], value: 100});
        } catch (e) {
            return;
        }
        assert(false, "should throw because price <=0");
    });

    it("should return token list", async () => {
        let token = await TokenMock.new(accounts[0], 100);
        let sale = await Sale.new(token.address, 10);

        let tokens = await sale.getTokens.call();
        assert.equal(tokens.length, 1);
        assert.equal(tokens[0], "0x0000000000000000000000000000000000000000");

        await sale.setPrice("0x0000000000000000000000000000000000000001", 100);
        tokens = await sale.getTokens.call();
        assert.equal(tokens.length, 2);
        assert.equal(tokens[0], "0x0000000000000000000000000000000000000000");
        assert.equal(tokens[1], "0x0000000000000000000000000000000000000001");

        await sale.setPrice("0x0000000000000000000000000000000000000002", 200);
        tokens = await sale.getTokens.call();
        assert.equal(tokens.length, 3);
        assert.equal(tokens[0], "0x0000000000000000000000000000000000000000");
        assert.equal(tokens[1], "0x0000000000000000000000000000000000000001");
        assert.equal(tokens[2], "0x0000000000000000000000000000000000000002");

        await sale.setPrice("0x0000000000000000000000000000000000000000", 0);
        tokens = await sale.getTokens.call();
        assert.equal(tokens.length, 2);
        assert.equal(tokens[0], "0x0000000000000000000000000000000000000002");
        assert.equal(tokens[1], "0x0000000000000000000000000000000000000001");

        await sale.setPrice("0x0000000000000000000000000000000000000001", 0);
        tokens = await sale.getTokens.call();
        assert.equal(tokens.length, 1);
        assert.equal(tokens[0], "0x0000000000000000000000000000000000000002");

        await sale.setPrice("0x0000000000000000000000000000000000000001", 0);
        tokens = await sale.getTokens.call();
        assert.equal(tokens.length, 1);
        assert.equal(tokens[0], "0x0000000000000000000000000000000000000002");
    });
});