import React from 'react'
import './styles.scss'

export const NoMatch = ({ location }) => (
  <div className='not-found'>
    <strong>Sorry, </strong> we couldn't find anything to match the route:
    <span className='pathname'>
      <code>{location.pathname}</code>
    </span>
  </div>
);

export default NoMatch
