import React from 'react'
import Link from 'react-router/Link';
import './styles.scss'

export const Header = () => (
  <div>
    <h1>Activities</h1>
    <Link to='/home' activeClassName='route--active'>
      Home
    </Link>
    {' · '}
    <Link to='/activities' activeClassName='route--active'>
      Activities
    </Link>
  </div>
);

export default Header
