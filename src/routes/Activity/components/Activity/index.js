import React from 'react'
import './styles.scss'
import ActivityInput from '../../../../components/ActivityInput'
import DeleteItem from '../DeleteItem/index'

export const Activity = (props) => {
  const {
    activity,
    activeCategoryId,
    onActivityDelete,
    handleActivityDelete,
    handleActivityUpdate,
    onActivityUpdate,
    dispatch,
    categories,
    loading,
    error
  } = props;

  if (loading && !(activity || {}).id) {
    return (<div>loading</div>)
  } else if (error) {
    return (<p>Error!</p>)
  } else {

    return (
      <div className="activity">
        <p>Name: {activity.name}</p>
        <p>Description: {activity.about}</p>
        <p>Location: {activity.location}</p>
        <p>Date: {activity.date}</p>

        <ActivityInput
          onSubmit={(props) => {
            handleActivityUpdate({ ...props, id: activity.id }, onActivityUpdate, activity, dispatch)
          }}
          buttonText={"Edit Activity"}
          placeholder={"Edit"}
          categories={categories}
          activity={activity}
          activeCategoryId={activeCategoryId}
        />

        <DeleteItem
          onSubmit={(props) => {
            handleActivityDelete(props, onActivityDelete)
          }}
          id={activity.id}
        />
      </div>
    )
  }
};

Activity.propTypes = {
  handleActivityUpdate: React.PropTypes.func.isRequired,
  onActivityUpdate: React.PropTypes.func.isRequired,
  handleActivityDelete: React.PropTypes.func.isRequired,
  onActivityDelete: React.PropTypes.func.isRequired,
  activity: React.PropTypes.object.isRequired,
  dispatch: React.PropTypes.func.isRequired,
  categories: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
  loading: React.PropTypes.bool.isRequired,
  activeCategoryId: React.PropTypes.string
};

export default Activity
