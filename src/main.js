import React from 'react'
import ReactDOM from 'react-dom'
import createStore from './store/createStore'
import AppContainer from './containers/AppContainer'
import ApolloClient, {
  createNetworkInterface
} from 'apollo-client';

const client = new ApolloClient({
  networkInterface: createNetworkInterface({
    uri: __API_BASE__,
    opts: {
      credentials: 'same-origin',
    },
    ssrForceFetchDelay: 100,
    connectToDevTools: __DEV__,
    dataIdFromObject: (result) => {
      if (result.id && result.__typename) {
        return result.__typename + result.id;
      }
      return null;
    }
  })
});

const initialState = {};
const store = createStore(initialState, client);

const MOUNT_NODE = document.getElementById('root');

let render = () => {
  const routes = require('./routes/index').default(store);

  ReactDOM.render(
    <AppContainer store={store} client={client} routes={routes}/>,
    MOUNT_NODE
  )
};

if (__DEV__ && module.hot) {
  const renderApp = render;
  const renderError = (error) => {
    const RedBox = require('redbox-react').default;
    ReactDOM.render(<RedBox error={error}/>, MOUNT_NODE)
  };

  render = () => {
    try {
      renderApp()
    } catch (error) {
      console.error(error);
      renderError(error)
    }
  };

  module.hot.accept('./routes/index', () =>
    setImmediate(() => {
      ReactDOM.unmountComponentAtNode(MOUNT_NODE);
      render()
    })
  )
}

render();

export default client
