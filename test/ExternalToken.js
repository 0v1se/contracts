var ExternalToken = artifacts.require('./token/ExternalToken.sol');
var AdapterMock = artifacts.require('./helpers/CompatReceiveAdapterMock.sol');

const awaitEvent = require('./helpers/awaitEvent');

contract("ExternalToken", accounts => {
    it("should let owner mint", async () => {
        const token = await ExternalToken.new();
        const mintEvent = token.Mint({});

        await token.mint(accounts[1], 100, "tx");
        assert.equal(await token.balanceOf.call(accounts[1]), 100);
        let result = await awaitEvent(mintEvent);
        assert.equal(result.args.to, accounts[1]);
        assert.equal(result.args.value, 100);
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
});