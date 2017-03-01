import React from 'react'
import './styles.scss'
import Activity from '../../containers/Activity'

export const ActivityList = (props) => {
  return (
    <div className='activity-list'>
      {
        props.activities.map((activity, index) => (
          <div
            className='activity'
            key={index}
            onClick={() => props.onActivityClick(activity.id)}
          >
            <div className='text'>
              {activity.text}
            </div>
          </div>
        ))
      }
      <Activity />
    </div>
  );
};

ActivityList.propTypes = {
  activities: React.PropTypes.array.isRequired,
  onActivityClick: React.PropTypes.func.isRequired,
};

export default ActivityList
