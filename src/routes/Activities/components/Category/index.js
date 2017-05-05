import React from 'react'
import {Dimmer, Loader} from 'semantic-ui-react'
import ActivityList from '../ActivityList'
import ActivityForm from '../../../../components/ActivityForm'
import LoadError from '../../../../components/LoadError'
import './styles.scss'

export const Category = (props) => {
  const {
    loading, error,
    category, activeCategoryId, categories,
    onActivitySubmit, handleActivitySubmit
  } = props;

  if (loading || !category) {
    return (
      <div>
        <Dimmer active inverted>
          <Loader inverted>Loading</Loader>
        </Dimmer>
      </div>
    )
  } else if (error) {
    return (
      <div className="category error">
        <LoadError
          errorText={"Error loading category"}
          inverted={true}
        />
      </div>
    )
  }

  return (
    <div className='category'>
      <ActivityList
        activities={category.activities}
      />
      <ActivityForm
        onSubmit={(activity, activeCategoryId) => {
          handleActivitySubmit(activity, activeCategoryId, onActivitySubmit)
        }}
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
  categories: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
  onActivitySubmit: React.PropTypes.func.isRequired,
  handleActivitySubmit: React.PropTypes.func.isRequired,
  activeCategoryId: React.PropTypes.string
};

export default Category
