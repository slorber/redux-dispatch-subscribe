import { dispatchSubscribe } from '../';
import expect from 'expect';

function createStoreShape() {
  return {
    dispatch: expect.createSpy(),
    subscribe: expect.createSpy()
  };
}

function createStore() {
  return dispatchSubscribe()(createStoreShape)();
}

describe('batchedSubscribe()', () => {
  it('it calls batch function on dispatch', () => {
    const store = createStore();
    const listener1 = expect.createSpy();
    store.addDispatchListener(listener1);


    const listener2 = expect.createSpy();
    store.addDispatchListener(listener2);


    store.dispatch({ type: 'foo' });
    expect(listener1.calls.length).toEqual(1);
    expect(listener2.calls.length).toEqual(1);


    store.dispatch({ type: 'bar' });
    expect(listener1.calls.length).toEqual(2);
    expect(listener2.calls.length).toEqual(2);
  });
});
