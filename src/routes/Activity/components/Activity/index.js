import React from 'react'
import PropTypes from 'prop-types'
import {Dimmer, Loader} from 'semantic-ui-react'

import './styles.scss'
import ActivityForm from '../../../../components/ActivityForm'
import LinkButton from '../../../../components/LinkButton'

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
    return (<p>Error!</p>)
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
              { ...activityObject, id: activity.id },
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

Activity.propTypes = {
  activeCategoryId: PropTypes.string,
  handleActivityDelete: PropTypes.func.isRequired,
  onActivityUpdate: PropTypes.func.isRequired,
  handleActivityUpdate: PropTypes.func.isRequired,
  activity: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      description: PropTypes.string
    })).isRequired
};

export default Activity
