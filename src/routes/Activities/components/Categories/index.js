import React from "react"
import "./styles.scss"

export const Categories = ({ loading, error, categories, onClick }) => {
  if (loading) {
    return (<div>loading</div>)
  } else if (error) {
    return (<p>Error!</p>);
  } else {

    return (
      <nav className='categories'>
        {categories.map((category, index) => (
          <div
            key={index}
            className={category.active ? 'active item' : 'item'}
            onClick={() => onClick(category.id)}
          >
            <span>{category.name}</span>
          </div>
        ))}
      </nav>
    );
  }
};

Categories.propTypes = {
  onClick: React.PropTypes.func.isRequired,
  categories: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
  loading: React.PropTypes.bool.isRequired,
  error: React.PropTypes.bool.isRequired
};

export default Categories
