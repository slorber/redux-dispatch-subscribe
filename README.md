redux-dispatch-subscribe
=====================

[![npm version](https://img.shields.io/npm/v/redux-dispatch-subscribe.svg?style=flat-square)](https://www.npmjs.com/package/redux-dispatch-subscribe)

Store enhancer for [redux](https://github.com/rackt/redux) which allows listening of dispatched actions. 
```sh
npm install --save redux-dispatch-subscribe
```


## Setup

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


## Usage examples

```js 
const unsubscribe = store.addDispatchListener(action => {
  
  // Do whatever you want here
  
  if ( this && that ) {
    Mixpanel.track(action.name);
  }
  
  if ( other ) {
    Intercom.update({...});
  }
  
  if ( isLogout(action) ) {
    if ( isCordova() ) {
      logoutCordova();
    } 
    else {
      window.location = getLogoutUrl();
    }
  }
  
})
```

```js
class MyLayoutComponent extends Component {
  componentDidMount() {
    this.unsubscribe = this.props.store.addDispatchListener(action => {
      if (action.type === "SCOLL_TO_TOP") {
        this.layoutRef.scrollTop = 0;
      }
    })
  }
  componentWillUnmount() {
    this.unsubscribe();
  }
  render() {
    return (
      <div className="layout" ref={c => this.layoutRef = c}>
        <div>content</div>
      </div>
    );
  }
}
```


## Why

Because it's a very simple solution to listen for dispatches and react to them. 

If you already use Redux-saga or Redux-observable it will not be useful for as this lib is aiming to solve the same usecase.
If you don't and these libraries are frightening you, this solution could be simpler and lighter.
If you only need one listener of this type in your app, you could create a middleware instead. This solution is mostly useful if you want to easily register/remove listeners during app lifetime.


Discussions with Yassine Elouafi and me (Redux-saga) lead to the creation of Redux-saga which is much more advanced (and complex) than this solution. 
This solution is how I implemented the saga/process-manager/whatever pattern in my own app before Redux-saga even existed. 
I created this store enhancer for myself mostly due to a complex app migration and retrocompatibility with existing legacy code.


## Thanks

Implementation is inspired from [redux-batched-subscribe](https://www.npmjs.com/package/redux-batched-subscribe).
