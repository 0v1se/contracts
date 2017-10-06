var TokenMock = artifacts.require('./helpers/ApprovalNotifyTokenMock.sol');
var AdapterMock = artifacts.require('./helpers/ReceiveApprovalAdapterMock.sol');

const verifyReceiveAdapter = require('./helpers/verifyReceiveAdapter');

contract('ReceiveApprovalAdapter', function(accounts) {
  it("should receive tokens", async function() {
    await verifyReceiveAdapter(accounts[0], TokenMock, AdapterMock, async (token, receiver, value, data) => {
        await token.approveAndCall(receiver.address, value, data);
    });
  });
});
