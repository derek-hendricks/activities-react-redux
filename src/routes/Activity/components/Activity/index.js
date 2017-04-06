import React from 'react'
import './styles.scss'
import ActivityInput from '../../../../components/ActivityInput'
import DeleteItem from '../DeleteItem/index'

export const Activity = (props) => {
  const {
    activity,
    onActivityDelete,
    handleActivityDelete,
    handleActivityUpdate,
    onActivityUpdate,
    dispatch,
    categories
  } = props;

  return (
    <div className="activity">
      <p>{activity.name}</p>
      <p>{activity.about}</p>
      <p>{activity.location}</p>
      <p>{activity.date}</p>

      <ActivityInput
        onSubmit={(props) => {
          handleActivityUpdate({ ...props, id: activity.id }, onActivityUpdate, activity, dispatch)
        }}
        buttonText={"Edit"}
        placeholder={"Edit Activity"}
        categories={categories}
      />

      <DeleteItem
        onSubmit={(props) => {
          handleActivityDelete(props, onActivityDelete)
        }}
        id={activity.id}
      />
    </div>
  );
};

Activity.propTypes = {
  handleActivityUpdate: React.PropTypes.func.isRequired,
  onActivityUpdate: React.PropTypes.func.isRequired,
  handleActivityDelete: React.PropTypes.func.isRequired,
  onActivityDelete: React.PropTypes.func.isRequired,
  activity: React.PropTypes.object.isRequired
};

export default Activity
