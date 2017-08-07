import React from 'react'
import PropTypes from 'prop-types'
import {Dimmer, Loader} from 'semantic-ui-react'

import ActivityList from '../ActivityList'
import ActivityForm from '../../../../components/ActivityForm'
import LoadError from '../../../../components/LoadError'
import LoadMore from '../../../../components/LoadMore'
import './styles.scss'

export const Category = (props) => {
  const {
    loading, error,
    category, activeCategoryId, categories,
    onActivitySubmit, handleActivitySubmit, loadMoreActivities
  } = props;

  if (loading) {

    return (
      <div>
        <Dimmer active inverted>
          <Loader inverted>Loading</Loader>
        </Dimmer>
      </div>
    )
  } else if (error) {
    const errorText = `Error loading activities for ${(category || {}).name || "Category"}`;

    return (
      <LoadError
        className="category"
        errorText={errorText}
        inverted={true}
      />
    )
  } else if (!category) {

    return (<div></div>)
  } else {
    const { activityEdges, pageInfo: { endCursor, hasNextPage } } = category;

    return (
      <div className='category'>

        <ActivityList edges={activityEdges}/>

        <LoadMore
          itemsName={'Activities'}
          hasNextPage={hasNextPage}
          endCursor={endCursor}
          loadItems={loadMoreActivities}
        />

        <ActivityForm
          onSubmit={(activity, activeCategoryId) => {
            handleActivitySubmit(activity, activeCategoryId, onActivitySubmit);
          }}
          categories={categories}
          activeCategoryId={activeCategoryId}
          buttonText={"Create Activity"}
          placeholder={""}
        />
      </div>
    )
  }
};

const { string, bool, shape, arrayOf, func } = PropTypes;

Category.propTypes = {
  activeCategoryId: string,
  loading: bool.isRequired,
  error: bool,
  loadMoreActivities: func.isRequired,
  onActivitySubmit: func.isRequired,
  handleActivitySubmit: func.isRequired,
  category: shape({
    name: string.isRequired,
    id: string.isRequired,
    edges: arrayOf(shape({
      cursor: string,
      node: shape({
        id: string.isRequired,
        name: string.isRequired,
        bob: string.isRequired
      })
    }))
  }),
  categories: arrayOf(shape({
    name: string,
    id: string
  })).isRequired
};

export default Category
