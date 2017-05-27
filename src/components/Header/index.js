import React from 'react'
import Link from 'react-router/Link';
import './styles.scss'

export const Header = () => (
  <div className="ui container header">
    <div className="ui large secondary pointing menu">
    <Link to="/about" className="item" activeClassName="active">
      Home
    </Link>
    {' · '}
    <Link to="/activities" className="item" activeClassName="active">
      Activities
    </Link>
    </div>
  </div>
);

export default Header

