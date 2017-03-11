import React from 'react'
import ActivityList from '../ActivityList'
import ActivityInput from '../ActivityInput'
import './styles.scss'

export const Category = (props) => {
  if (!props.category) return (<div></div>);
  return (
    <div className='category'>
      <ActivityList
        activities={props.category.activities}
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
  onActivitySubmit: React.PropTypes.func.isRequired
};

export default Category
