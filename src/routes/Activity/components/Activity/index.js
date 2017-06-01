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
    handleActivityUpdate,
    onActivityUpdate,
    dispatch,
    categories,
    loading,
    error
  } = props;

  if (loading && !(activity).id) {
    return (
      <div>
        <Dimmer active inverted>
          <Loader inverted>Loading</Loader>
        </Dimmer>
      </div>)
  } else if (error) {
    return (
      <LoadError
        className="activity"
        errorText="Error loading Activity"
        dimmed={false}
      />
    )
  } else {
    const { name, id, about, location, date } = activity;

    return (
      <div className="activity">
        <p>Name: {name}</p>
        <p>Description: {about}</p>
        <p>Location: {location}</p>
        <p>Date: {date}</p>

        <ActivityForm
          onSubmit={(activityObject) => {
            return handleActivityUpdate(
              { ...activityObject, id },
              onActivityUpdate,
              activity,
              dispatch
            )
          }}
          buttonText={"Edit Activity"}
          placeholder={"Edit"}
          categories={categories}
          activity={activity}
          activeCategoryId={activeCategoryId}
        />

        <LinkButton
          text={'Delete'}
          className={'delete-activity'}
          onClick={() => {
            return handleActivityDelete(id, activeCategoryId)
          }}
        />
      </div>
    )
  }
};

const { string, func, bool, arrayOf, shape } = PropTypes;

Activity.propTypes = {
  activeCategoryId: string,
  handleActivityDelete: func.isRequired,
  onActivityUpdate: func.isRequired,
  handleActivityUpdate: func.isRequired,
  dispatch: func.isRequired,
  loading: bool.isRequired,
  activity: shape({
    id: string,
    name: string,
    about: string,
    location: string,
    date: string
  }).isRequired,
  categories: arrayOf(
    shape({
      id: string.isRequired,
      name: string.isRequired,
      description: string
    })).isRequired
};

export default Activity
