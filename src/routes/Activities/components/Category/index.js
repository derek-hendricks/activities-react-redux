import React from 'react'
import ActivityList from '../ActivityList'
import ActivityInput from '../ActivityInput'
import './styles.scss'

export const Category = (props) => {
  return (
    <div className='category'>
      <ActivityList
        activities={props.category.activities}
        onActivityClick={props.onActivityClick}
      />
      <ActivityInput
        onSubmit={props.onActivitySubmit}
        buttonText={"Create"}
        placeholder={"New Activity"}
      />
    </div>
  );
};

Category.propTypes = {
  onActivitySubmit: React.PropTypes.func.isRequired,
  onActivityClick: React.PropTypes.func.isRequired,
  category: React.PropTypes.object.isRequired
};

export default Category
