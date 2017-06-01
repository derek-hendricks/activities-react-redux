import React from 'react'
import Header from '../../components/Header'
import './styles.scss'
import '../../styles/core.scss'
import Categories from '../../containers/Categories';
import PropTypes from 'prop-types';

export const CoreLayout = ({ children }) => {
  return (
    <div className={"ui container"}>
      <Header/>
      <Categories/>
      {children}
    </div>
  );
};

const { arrayOf, shape, object, any } = PropTypes;

CoreLayout.propTypes = {
  children: arrayOf(shape({
    props: object.isRequired,
    key: any,
    ref: any,
    _owner: any,
    _store: object
  })).isRequired
};

export default CoreLayout
