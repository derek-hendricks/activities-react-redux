import React from "react"
import Link from 'react-router/Link';
import "./styles.scss"

export const Categories = ({ loading, error, categories, onClick }) => {
  if (loading) {
    return (<div>loading</div>)
  } else if (error) {
    return (<p>Error!</p>);
  } else {

    return (
      <nav className='categories'>
        {categories.map((category, index) => {
          return (
              <Link key={index} to='/activities'>
                <div
                  key={index}
                  className={category.active ? 'active item' : 'item'}
                  onClick={() => onClick(category.id)}
                >
                  {category.name}
                </div>
              </Link>

          );
        })}
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



