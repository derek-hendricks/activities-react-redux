import React from 'react'
import Category from '../../containers/Category'
import Categories from '../../containers/Categories'
import './styles.scss'

export const ActivitiesView = () => {
  return (
    <div className='activities-view'>
      <Categories />
      <Category />
    </div>
  );
};

export default ActivitiesView
