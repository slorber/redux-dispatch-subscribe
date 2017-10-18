redux-dispatch-subscribe
=====================

[![npm version](https://img.shields.io/npm/v/redux-dispatch-subscribe.svg?style=flat-square)](https://www.npmjs.com/package/redux-dispatch-subscribe)

Store enhancer for [redux](https://github.com/rackt/redux) which allows listening of dispatched actions. 
```js
npm install --save redux-dispatch-subscribe
```

## Usage

The `dispatchSubscribe` store enhancer add a `addDispatchListener` to your Redux store. The dispatch listener of called after regular store listeners.
Since `dispatchSubscribe` overloads the dispatch on the original redux store it is important that it gets applied before any other store enhancers or middleware that depend on these functions; The [compose](https://github.com/rackt/redux/blob/master/docs/api/compose.md) utility in redux can be used to handle this:

```js
import { createStore, applyMiddleware, compose } from 'redux';
import { dispatchSubscribe } from 'redux-dispatch-subscribe';

const enhancer = compose(
  applyMiddleware(...middleware),
  dispatchSubscribe()
)

// Note: passing enhancer as the last argument to createStore requires redux@>=3.1.0
const store = createStore(reducer, initialState, enhancer);
```

*Note: since `compose` applies functions from right to left, `dispatchSubscribe` should appear at the end of the chain.*


## Thanks

Implementation is inspired from [redux-batched-subscribe](https://www.npmjs.com/package/redux-batched-subscribe).
