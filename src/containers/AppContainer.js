import React, {Component, PropTypes} from 'react'
import {Provider} from 'react-redux'
import Router from 'react-router/BrowserRouter';

class AppContainer extends Component {
  static propTypes = {
    routes: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
  };

  shouldComponentUpdate() {
    return false
  }

  render() {
    const {store, routes} = this.props;

    return (
      <Provider store={store}>
        <div style={{height: '100%'}}>
          <Router>
            {routes}
          </Router>
        </div>
      </Provider>
    )
  }
}

export default AppContainer
