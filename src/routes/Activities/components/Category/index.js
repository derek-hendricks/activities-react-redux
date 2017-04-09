import React from 'react'
import ActivityList from '../ActivityList/index'
import ActivityInput from '../../../../components/ActivityInput/index'
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
          console.log('activeCategoryId', activeCategoryId)
          console.log('activity.categoryId', activity.categoryId)
          console.log('activity.categoryId || {}).value || activeCategoryId', (activity.categoryId || {}).value || activeCategoryId);
          handleActivitySubmit(activity, (activity.categoryId || {}).value || activeCategoryId, onActivitySubmit)
        }
        }
        categories={categories}
        activeCategoryId={activeCategoryId}
        buttonText={"Create Activity"}
        placeholder={""}
      />
    </div>
  )
};

Category.propTypes = {
  loading: React.PropTypes.bool.isRequired,
  error: React.PropTypes.bool.isRequired,
  category: React.PropTypes.object.isRequired,
  onActivitySubmit: React.PropTypes.func.isRequired,
  handleActivitySubmit: React.PropTypes.func.isRequired,
  activeCategoryId: React.PropTypes.string
};

export default Category
