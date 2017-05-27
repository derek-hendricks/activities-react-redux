import React from 'react'
import PropTypes from 'prop-types'
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
      <LoadError
        className="category"
        errorText={`Error loading activities for ${(category || {}).name || "Category"}`}
        inverted={true}
      />
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

const { string, bool, object, arrayOf, func } = PropTypes;

Category.propTypes = {
  loading: bool.isRequired,
  error: bool.isRequired,
  category: object.isRequired,
  categories: arrayOf(object).isRequired,
  onActivitySubmit: func.isRequired,
  handleActivitySubmit: func.isRequired,
  activeCategoryId: string
};

export default Category
