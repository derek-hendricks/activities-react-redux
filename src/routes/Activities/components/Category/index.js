import React from 'react'
import ActivityList from '../ActivityList'
import ActivityInput from '../../../../components/ActivityInput'
import './styles.scss'

export const Category = ({ loading, error, category, onActivitySubmit, handleActivitySubmit, categories, activeCategoryId }) => {
  if (loading) {
    return (<div>loading</div>)
  } else if (error) {
    return (<p>Error!</p>);
  }

  return (
    <div className='category'>
      <ActivityList
        activities={category.activities}
      />
      <ActivityInput
        onSubmit={(activity, activeCategoryId) => {
          handleActivitySubmit(activity, activity.categoryId || activeCategoryId, onActivitySubmit)}
        }
        categories={categories}
        activeCategoryId={activeCategoryId}
        buttonText={"Create"}
        placeholder={"New Activity"}
      />
    </div>
  )
};

Category.propTypes = {
  loading: React.PropTypes.bool.isRequired,
  error: React.PropTypes.bool.isRequired,
  category: React.PropTypes.object.isRequired,
  onActivitySubmit: React.PropTypes.func.isRequired,
  handleActivitySubmit: React.PropTypes.func.isRequired
};

export default Category
