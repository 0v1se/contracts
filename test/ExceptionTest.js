var ExceptionTest = artifacts.require("./helpers/ExceptionTest.sol");
var WillThrow = artifacts.require("./helpers/WillThrow.sol");

contract('WillThrow', function(accounts) {
  it("should not save state if throws", async function() {
    let willThrow = await WillThrow.new();
    let exceptionTest = await ExceptionTest.new();

    await exceptionTest.callWillThrow(10, willThrow.address, "changeAndThrow");
    assert.equal((await exceptionTest.state.call()), 10);
    assert.equal((await exceptionTest.stateInternal.call()), 0);
    assert.equal((await willThrow.state.call()), 0);
  });

  it("should save state", async function() {
    let willThrow = await WillThrow.new();
    let exceptionTest = await ExceptionTest.new();

    await exceptionTest.callWillThrow(10, willThrow.address, "change");
    assert.equal((await exceptionTest.state.call()), 10);
    assert.equal((await exceptionTest.stateInternal.call()), 0);
    assert.equal((await willThrow.state.call()), 10);
  });
});

contract('ExceptionTest', function(accounts) {
  it("should not save internalState if throws", async function() {
    let exceptionTest = await ExceptionTest.new();

    await exceptionTest.callWillThrow(10, exceptionTest.address, "changeInternalAndThrow");
    assert.equal((await exceptionTest.state.call()), 10);
    assert.equal((await exceptionTest.stateInternal.call()), 0);
  });

  it("should save internalState", async function() {
    let exceptionTest = await ExceptionTest.new();

    await exceptionTest.callWillThrow(10, exceptionTest.address, "changeInternal");
    assert.equal((await exceptionTest.state.call()), 10);
    assert.equal((await exceptionTest.stateInternal.call()), 10);
  })
});
