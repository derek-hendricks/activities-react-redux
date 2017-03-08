import React from 'react'
import './styles.scss'

export const Categories = (props) => {
  return (
    <nav className='categories'>
      {
        props.categories.map((category, index) => (
          <div
            key={index}
            className={category.active ? 'active item' : 'item'}
            onClick={() => props.onClick(category.id)}
          >
            {category.title}
          </div>
        ))
      }
    </nav>
  );
};

Categories.propTypes = {
  onClick: React.PropTypes.func.isRequired,
  categories: React.PropTypes.arrayOf(React.PropTypes.object).isRequired
};

export default Categories
