import React from 'react'
import Header from '../../components/Header'
import './styles.scss'
import '../../styles/core.scss'

export const CoreLayout = (props) => {
  return (
    <div>
      <Header/>
      {props.children}
    </div>
  );
};

CoreLayout.propTypes = {
  children: React.PropTypes.array.isRequired
};

export default CoreLayout
