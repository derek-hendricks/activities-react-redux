import React from 'react'
import Header from '../../components/Header'
import './styles.scss'
import '../../styles/core.scss'
import Categories from '../../containers/Categories';

export const CoreLayout = (props) => {
  return (
    <div>
      <Header/>
      <Categories/>
      {props.children}
    </div>
  );
};

CoreLayout.propTypes = {
  children: React.PropTypes.array.isRequired
};

export default CoreLayout
