import { applyMiddleware, compose, createStore } from 'redux'
import makeRootReducer from './reducers'

export default (initialState = {}, client) => {
  const middleware = [client.middleware()];
  const enhancers = [];
  let composeEnhancers = compose;

  if (__DEV__) {
    const composeWithDevToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
    if (typeof composeWithDevToolsExtension === 'function') {
      composeEnhancers = composeWithDevToolsExtension
    }
  }

  const store = createStore(
    makeRootReducer(client),
    initialState,
    composeEnhancers(
      applyMiddleware(...middleware),
      ...enhancers
    )
  );

  return store
}
