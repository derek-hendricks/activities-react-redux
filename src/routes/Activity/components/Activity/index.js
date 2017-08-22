import React from 'react'
import PropTypes from 'prop-types'
import {Dimmer, Loader} from 'semantic-ui-react'

import './styles.scss'
import ActivityForm from '../../../../components/ActivityForm'
import LinkButton from '../../../../components/LinkButton'
import LoadError from '../../../../components/LoadError'

export const Activity = (props) => {
  const {
    activity = {},
    activeCategoryId,
    handleActivityDelete,
    updateActivity,
    categories,
    loading,
    error
  } = props;

  if (loading && !activity.node) {
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
        className="activity"
        errorText="Error loading Activity"
        dimmed={false}
      />
    )
  } else {
    const {
      node: { name, id, about, location, date }
    } = activity;

    return (
      <div className="activity">
        <p>Name: {name}</p>
        <p>Description: {about}</p>
        <p>Location: {location}</p>
        <p>Date: {date}</p>

        <ActivityForm
          onSubmit={(updatedValues) => (
            updateActivity({ id, ...updatedValues }, activeCategoryId)
          )}
          buttonText={"Edit Activity"}
          placeholder={"Edit"}
          categories={categories}
          activeCategoryId={activeCategoryId}
        />

        <LinkButton
          text={'Delete'}
          className={'delete-activity'}
          onClick={() => (handleActivityDelete(id, activeCategoryId))}
        />
      </div>
    )
  }
};

const {
  string, func, bool, arrayOf, shape
} = PropTypes;

Activity.propTypes = {
  handleActivityDelete: func.isRequired,
  updateActivity: func.isRequired,
  loading: bool.isRequired,
  error: bool.isRequired,
  activeCategoryId: string,
  activity: shape({
    node: shape({
      id: string.isRequired,
      name: string.isRequired,
      about: string,
      location: string,
      date: string
    })
  }).isRequired,
  categories: arrayOf(
    shape({
      id: string.isRequired,
      name: string.isRequired,
      description: string
    }).isRequired
  ).isRequired
};

export default Activity
