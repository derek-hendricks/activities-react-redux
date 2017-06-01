import React from 'react'
import PropTypes from 'prop-types'

import './styles.scss'

export const NoMatch = ({ location: { pathname } }) => (
  <div className='not-found'>
    <strong>Sorry, </strong> we couldn't find anything to match the route:
    <span className='pathname'>
      <code>{pathname}</code>
    </span>
  </div>
);

const { string } = PropTypes;

NoMatch.propTypes = {
  location: string.isRequired
};

export default NoMatch
