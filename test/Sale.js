var TokenMock = artifacts.require('./helpers/ERC20Mock.sol');
var Sale = artifacts.require('./sale/Sale.sol');
var ExternalToken = artifacts.require('./token/ExternalToken.sol');
const awaitEvent = require('./helpers/awaitEvent');

const BigNumber = web3.BigNumber
require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

contract("Sale", accounts => {
    function bn(value) {
        return new web3.BigNumber(value);
    }

    it("should sell tokens for ether", async () => {
        let token = await TokenMock.new(accounts[0], 1000000);
        let sale = await Sale.new(token.address);
        await sale.setRate("0x0000000000000000000000000000000000000000", bn("10000000000000000000"));

        let totalSupply = await token.totalSupply.call();
        await token.approve(sale.address, totalSupply.toNumber());

        await sale.sendTransaction({from: accounts[1], value: 100});
        assert.equal((await token.balanceOf(accounts[1])).toNumber(), 1000);
    });

    it("should send tokens to provided address", async () => {
        let token = await TokenMock.new(accounts[0], 100000);
        let sale = await Sale.new(token.address);
        await sale.setRate("0x0000000000000000000000000000000000000000", bn("10000000000000000000"));

        let totalSupply = await token.totalSupply.call();
        await token.approve(sale.address, totalSupply.toNumber());

        await sale.receiveEtherAndData(accounts[1], {value: 100});
        assert.equal((await token.balanceOf.call(accounts[1])).toNumber(), 1000);
    });

    it("should not sell tokens for ether if rate=0", async () => {
        let token = await TokenMock.new(accounts[0], 100);
        let sale = await Sale.new(token.address);

        let totalSupply = await token.totalSupply.call();
        await token.approve(sale.address, totalSupply.toNumber());

        try {
            await sale.sendTransaction({from: accounts[1], value: 100});
        } catch (e) {
            return;
        }
        assert(false, "should throw because rate == 0");
    });

    it("should withdraw ethers", async () => {
        let token = await TokenMock.new(accounts[0], 100000);
        let sale = await Sale.new(token.address);
        await sale.setRate("0x0000000000000000000000000000000000000000", bn("1000000000000000000"));

        let totalSupply = await token.totalSupply.call();
        await token.approve(sale.address, totalSupply.toNumber());

        await sale.sendTransaction({from: accounts[1], value: 100});
        assert.equal(await token.balanceOf.call(accounts[1]), 100);

        let acc3Balance = await web3.eth.getBalance(accounts[2]);
        await sale.withdraw("0x0", accounts[2], 100);
        acc3Balance.plus(100).should.be.bignumber.equal(await web3.eth.getBalance(accounts[2]));
    });

    it("should withdraw tokens", async () => {
        let token = await TokenMock.new(accounts[0], 1000000);
        let sale = await Sale.new(token.address);
        let btc = await ExternalToken.new();
        await sale.setRate(btc.address, bn("100000000000000000000"));

        await btc.mint(accounts[1], 100, "");

        let totalSupply = await token.totalSupply.call();
        await token.approve(sale.address, totalSupply.toNumber());

        await btc.transferAndCall(sale.address, 100, "", {from: accounts[1]});
        assert.equal(await token.balanceOf.call(accounts[1]), 10000);

        let acc3Balance = await btc.balanceOf.call(accounts[2]);
        await sale.withdraw(btc.address, accounts[2], 100);
        acc3Balance.plus(100).should.be.bignumber.equal(await btc.balanceOf.call(accounts[2]));
    });

    it("should calculate total", async () => {
        let token = await TokenMock.new(accounts[0], 10000);
        let sale = await Sale.new(token.address);

        let totalSupply = await token.totalSupply.call();
        await token.approve(sale.address, totalSupply.toNumber());

        assert.equal((await sale.getTotal.call()).toNumber(), totalSupply.toNumber());
    });

    it("should burn tokens", async () => {
        let token = await TokenMock.new(accounts[0], 100000);
        let sale = await Sale.new(token.address);
        let btc = await ExternalToken.new();
        let burnEvent = btc.Burn({});

        await sale.setRate(btc.address, bn("100000000000000000000"));
        await btc.mint(accounts[1], 100, "");

        let totalSupply = await token.totalSupply.call();
        await token.approve(sale.address, totalSupply.toNumber());

        await btc.transferAndCall(sale.address, 100, "", {from: accounts[1]});
        assert.equal(await token.balanceOf.call(accounts[1]), 10000);

        let acc3Balance = await btc.balanceOf.call(accounts[2]);
        await sale.burnWithData(btc.address, 100, '0xffffff');
        let result = await awaitEvent(burnEvent);
        assert.equal(result.args.burner, sale.address);
        assert.equal(result.args.value, 100);
        assert.equal(result.args.data, '0xffffff');
    });
});