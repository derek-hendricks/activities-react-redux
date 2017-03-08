import React from 'react'
import './styles.scss'
import ActivityInput from '../ActivityInput/index'
import DeleteItem from '../DeleteItem/index'

export const Activity = (props) => {
  return (
    <div className="activity">
      <p>{props.activity.text}</p>
      <ActivityInput
        onSubmit={props.onModifyClick}
        buttonText={"Edit"}
        placeholder={"Edit Activity"}
      />
      <DeleteItem
        onSubmit={props.onDeleteClick}
        activityId={props.activity.id}
      />
    </div>
  )
};

Activity.propTypes = {
  onModifyClick: React.PropTypes.func.isRequired,
  onDeleteClick: React.PropTypes.func.isRequired,
  activity: React.PropTypes.object.isRequired,
};

export default Activity
