

export function dispatchSubscribe() {
  let currentListeners = [];
  let nextListeners = currentListeners;

  function ensureCanMutateNextListeners() {
    if (nextListeners === currentListeners) {
      nextListeners = currentListeners.slice();
    }
  }

  function addDispatchListener(listener) {
    if (typeof listener !== 'function') {
      throw new Error('Expected listener to be a function.');
    }

    let isSubscribed = true;

    ensureCanMutateNextListeners();
    nextListeners.push(listener);

    return function unsubscribe() {
      if (!isSubscribed) {
        return;
      }

      isSubscribed = false;

      ensureCanMutateNextListeners();
      const index = nextListeners.indexOf(listener);
      nextListeners.splice(index, 1);
    };
  }

  function notifyListeners(...dispatchArgs) {
    const listeners = currentListeners = nextListeners;
    for (let i = 0; i < listeners.length; i++) {
      listeners[i](...dispatchArgs);
    }
  }

  return next => (...args) => {
    const store = next(...args);

    function dispatch(...dispatchArgs) {
      const res = store.dispatch(...dispatchArgs);
      notifyListeners(...dispatchArgs);
      return res;
    }

    return {
      ...store,
      dispatch,
      addDispatchListener,
    };
  };
}
