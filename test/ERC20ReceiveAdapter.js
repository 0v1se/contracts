var TokenMock = artifacts.require('./helpers/ERC20Mock.sol');
var AdapterMock = artifacts.require('./helpers/ERC20ReceiveAdapterMock.sol');

const verifyReceiveAdapter = require('./helpers/verifyReceiveAdapter');

contract('ERC20ReceiveAdapter', function(accounts) {
  it("should receive tokens", async function() {
    await verifyReceiveAdapter(accounts[0], TokenMock, AdapterMock, async (token, receiver, value, data) => {
        await token.approve(receiver.address, value);
        await receiver.receive(token.address, value, data);
    });
  });
});
