var ExternalToken = artifacts.require('./token/ExternalToken.sol');
var AdapterMock = artifacts.require('./helpers/CompatReceiveAdapterMock.sol');

const awaitEvent = require('./helpers/awaitEvent');
import expectThrow from './helpers/expectThrow';

contract("ExternalToken", accounts => {
    it("should start with totalSupply=0", async () => {
        const token = await ExternalToken.new();
        assert.equal(await token.totalSupply.call(), 0);
    });

    it("should let owner mint", async () => {
        const token = await ExternalToken.new();
        const mintEvent = token.Mint({});

        await token.mint(accounts[1], 100, "tx");
        assert.equal(await token.balanceOf.call(accounts[1]), 100);
        let mint = await awaitEvent(mintEvent);
        assert.equal(mint.args.to, accounts[1]);
        assert.equal(mint.args.value, 100);
    });

    it("should not let mint if not owner", async () => {
        const token = await ExternalToken.new();
        const mintEvent = token.Mint({});

        await expectThrow(
            token.mint(accounts[1], 100, "tx", {from: accounts[1]})
        );
    });

    it("should let owner mintAndCall", async () => {
        const token = await ExternalToken.new();
        const receiver = await AdapterMock.new();
        const mintEvent = token.Mint({});
        const receiveEvent = receiver.Receive({});

        await token.mintAndCall(receiver.address, 100, "tx", "0xffff");
        assert.equal(await token.balanceOf.call(receiver.address), 100);
        let mint = await awaitEvent(mintEvent);
        assert.equal(mint.args.to, receiver.address);
        assert.equal(mint.args.value, 100);

        let receive = await awaitEvent(receiveEvent);
        assert.equal(receive.args.token, token.address);
        assert.equal(receive.args.value, 100);
        assert.equal(receive.args.from, "0x0000000000000000000000000000000000000000");
        assert.equal(receive.args.data, "0xffff");
    });

    it("should not let burn if paused", async () => {
        const token = await ExternalToken.new();
        await token.mint(accounts[1], 100, "tx");
        await token.pause();

        await expectThrow(
            token.burn(50, "data", {from: accounts[1]})
        );
    });

    it("should burn tokens", async () => {
        const token = await ExternalToken.new();
        await token.mint(accounts[1], 100, "tx");
        const burnEvent = token.Burn({});

        await token.burn(50, "data", {from: accounts[1]});
        assert.equal(await token.balanceOf.call(accounts[1]), 50);
        let burn = await awaitEvent(burnEvent);
        assert.equal(burn.args.burner, accounts[1]);
        assert.equal(burn.args.value, 50);
        assert.equal(burn.args.data, "0x64617461");
    });
});