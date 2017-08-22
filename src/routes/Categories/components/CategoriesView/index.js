import React from 'react'
import Categories from '../../../../containers/Categories';
import Category from '../../containers/Category'
import './styles.scss'

export const CategoriesView = () => {
  return (
    <div className='activities-view'>
      <Categories />
      <Category />
    </div>
  );
};

export default CategoriesView
