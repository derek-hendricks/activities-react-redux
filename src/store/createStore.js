import { applyMiddleware, compose, createStore } from 'redux'
import thunk from 'redux-thunk'
import makeRootReducer from './reducers'
import * as asyncInitialState from 'redux-async-initial-state';
const fetch = require('graphql-fetch')("http://localhost:3000/graphql");

export default (initialState = {}, client) => {

  const loadStore = () => {
    let query = `{
      categoryList { 
        categories { 
          id 
          description 
          name 
        } 
      } 
    }`;

    return new Promise(resolve => {
      fetch(query).then(results => {
        if (results.errors) {
          return
        }
        return results.data.categoryList;
      }).then(resolve);
    });
  };

  const middleware = [thunk, client.middleware(), asyncInitialState.middleware(loadStore)];
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

  store.asyncReducers = {};

  if (module.hot) {
    module.hot.accept('./reducers', () => {
      const reducers = require('./reducers').default;
      store.replaceReducer(reducers(store.asyncReducers))
    })
  }

  return store
}
