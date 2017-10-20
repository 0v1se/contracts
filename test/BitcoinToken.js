var BitcoinToken = artifacts.require('./bitcoin/BitcoinToken.sol');

const awaitEvent = require('./helpers/awaitEvent');
import expectThrow from './helpers/expectThrow';

contract("BitcoinToken", accounts => {
    it("should throw if burn value is small", async () => {
        const token = await BitcoinToken.new(1000);
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

        await token.mintAndCall(receiver.address, 100, "tx", "data");
        assert.equal(await token.balanceOf.call(receiver.address), 100);
        let mint = await awaitEvent(mintEvent);
        assert.equal(mint.args.to, receiver.address);
        assert.equal(mint.args.value, 100);

        let receive = await awaitEvent(receiveEvent);
        assert.equal(receive.args.token, token.address);
        assert.equal(receive.args.value, 100);
        assert.equal(receive.args.from, "0x0000000000000000000000000000000000000000");
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

    it("should log BurnResponse", async () => {
        const token = await ExternalToken.new();
        const burnResponseEvent = token.BurnResponse({});

        await token.setBurnResponse("0x3671902191f40285d3ee633929bd0eb3ba8ae4effefd49b8ed6fd6ddaeffa95e", "0x0a", "data");
        let burnResponse = await awaitEvent(burnResponseEvent);
        assert.equal(burnResponse.args.tx, "0x3671902191f40285d3ee633929bd0eb3ba8ae4effefd49b8ed6fd6ddaeffa95e");
        assert.equal(burnResponse.args.logIndex, 10);
        assert.equal(burnResponse.args.data, "0x64617461");
    });

    it("should not let log BurnResponse if not owner", async () => {
        const token = await ExternalToken.new();
        const burnResponseEvent = token.BurnResponse({});

        await expectThrow(
            token.setBurnResponse("0x3671902191f40285d3ee633929bd0eb3ba8ae4effefd49b8ed6fd6ddaeffa95e", "0x0a", "data", {from: accounts[1]})
        );
    });
});