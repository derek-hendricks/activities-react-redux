import React, { Component } from "react"
import Router from "react-router/BrowserRouter";
import { ApolloProvider } from "react-apollo";
import PropTypes from "prop-types"

class AppContainer extends Component {
  static propTypes = {
    routes: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired,
    client: PropTypes.object.isRequired
  };

  static shouldComponentUpdate() {
    return false
  }

  render() {
    const { store, routes, client } = this.props;

    return (
      <ApolloProvider store={store} client={client}>
        <div style={{ height: '100%' }}>
          <Router>
            {routes}
          </Router>
        </div>
      </ApolloProvider>
    )
  }
}

export default AppContainer
