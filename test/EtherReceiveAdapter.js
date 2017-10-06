var AdapterMock = artifacts.require('./helpers/EtherReceiveAdapterMock.sol');

const awaitEvent = require('./helpers/awaitEvent');

contract('EtherReceiveAdapter', function(accounts) {
  it("should receive ethers", async function() {
    let receiver = await AdapterMock.new();
    let receivedEvent = receiver.Receive({});

    await receiver.sendTransaction({value: 10});
    assert.equal(await web3.eth.getBalance(receiver.address), 10);
    let result = await awaitEvent(receivedEvent);
    assert.equal(result.args.token, "0x0000000000000000000000000000000000000000");
    assert.equal(result.args.from, accounts[0]);
    assert.equal(result.args.value, 10);
  });
});
