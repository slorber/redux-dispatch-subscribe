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
  it('it calls listeners function on dispatch', () => {
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

  it('it can dispatch in listener', () => {
    const store = createStore();
    store.addDispatchListener(action => {
      if (action.type === 'foo') {
        store.dispatch({ type: 'bar' });
      }
    });

    const listener = expect.createSpy();
    store.addDispatchListener(listener);

    store.dispatch({ type: 'first' });
    expect(listener.calls.length).toEqual(1);
    store.dispatch({ type: 'foo' });
    expect(listener.calls.length).toEqual(3);
  });
});
