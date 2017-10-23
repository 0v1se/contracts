var TokenMock = artifacts.require('./helpers/ERC667Mock.sol');
var AdapterMock = artifacts.require('./receive/ERC667ReceiveAdapterMock.sol');

const verifyReceiveAdapter = require('./helpers/verifyReceiveAdapter');

contract('ERC667ReceiveAdapter', function(accounts) {
  it("should receive tokens", async function() {
    await verifyReceiveAdapter(accounts[0], TokenMock, AdapterMock, async (token, receiver, value, data) => {
        await token.transferAndCall(receiver.address, value, data);
    });
  });
});
