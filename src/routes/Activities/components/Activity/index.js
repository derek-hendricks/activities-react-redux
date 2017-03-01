import React from 'react'
import './styles.scss'
import ActivityInput from '../ActivityInput'
import DeleteItem from '../DeleteItem'

export const Activity = (props) => {
  if (props.activity) {
    return (
      <div className='activity'>
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
  } else {
    return (
      <div></div>
    );
  }
};

Activity.propTypes = {
  onModifyClick: React.PropTypes.func.isRequired,
  onDeleteClick: React.PropTypes.func.isRequired
};

export default Activity
