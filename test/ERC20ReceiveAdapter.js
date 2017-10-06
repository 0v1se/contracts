var StandardTokenMock = artifacts.require('./helpers/StandardTokenMock.sol');
var ERC20ReceiveAdapterMock = artifacts.require('./helpers/ERC20ReceiveAdapterMock.sol');

function awaitEvent(event, handler) {
  return new Promise((resolve, reject) => {
    function wrappedHandler(...args) {
      Promise.resolve(handler(...args)).then(resolve).catch(reject);
    }
    event.watch(wrappedHandler);
  });
}

contract('ERC20ReceiveAdapter', function(accounts) {
  it("should receive tokens", async function() {
    let token = await StandardTokenMock.new(accounts[0], 100);
    let receiver = await ERC20ReceiveAdapterMock.new();
    let receivedEvent = receiver.Receive({});

    await token.approve(receiver.address, 50);
    await receiver.receive(token.address, 10, "test");
    await awaitEvent(receivedEvent, async (err, result) => {
        receivedEvent.stopWatching();
        if (err) { throw err; }
        assert.equal(result.args.token, token.address);
        assert.equal(result.args.from, accounts[0]);
        assert.equal(result.args.value, 10);
    });
  });
});
