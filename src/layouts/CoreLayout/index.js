import React from 'react'
import Header from '../../components/Header'
import './styles.scss'
import '../../styles/core.scss'
import PropTypes from 'prop-types';

export const CoreLayout = ({ children }) => {
  return (
    <div className={"ui container"}>
      <Header/>
      {children}
    </div>
  );
};

const { arrayOf, shape, object } = PropTypes;

CoreLayout.propTypes = {
  children: arrayOf(shape({
    props: object.isRequired
  })).isRequired
};

export default CoreLayout
