import React from 'react'
import {Dimmer, Loader} from 'semantic-ui-react'
import './styles.scss'
import ActivityForm from '../../../../components/ActivityForm'
import DeleteItem from '../DeleteItem/index'

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

        <DeleteItem
          id={id}
          categoryId={activeCategoryId}
          onSubmit={(id, categoryId) => {
            return handleActivityDelete(id, categoryId)
          }
          }
        />
      </div>
    )
  }
};

Activity.propTypes = {
  handleActivityDelete: React.PropTypes.func.isRequired,
  onActivityUpdate: React.PropTypes.func.isRequired,
  handleActivityUpdate: React.PropTypes.func.isRequired,
  activity: React.PropTypes.object.isRequired,
  dispatch: React.PropTypes.func.isRequired,
  categories: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
  loading: React.PropTypes.bool.isRequired,
  activeCategoryId: React.PropTypes.string
};

export default Activity
