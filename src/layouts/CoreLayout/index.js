import React from 'react'
import Header from '../../components/Header'
import './styles.scss'
import '../../styles/core.scss'
import Categories from '../../containers/Categories';
import PropTypes from 'prop-types';

export const CoreLayout = ({children}) => {
  return (
    <div className={"ui container"}>
      <Header/>
      <Categories/>
      {children}
    </div>
  );
};

CoreLayout.propTypes = {
  children: PropTypes.arrayOf(
    PropTypes.shape({
      props: PropTypes.object.isRequired,
      key: PropTypes.any,
      ref: PropTypes.any,
      _owner: PropTypes.any,
      _store: PropTypes.object
    })).isRequired
};

export default CoreLayout
