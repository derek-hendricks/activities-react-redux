import React from 'react'
import './styles.scss'
import Link from 'react-router/Link';

export const ActivityList = (props) => {
  return (
    <div className='activity-list'>
      {
        props.activities.map((activity, index) => (
          <div className='text' key={index}>
            <Link to={`/activity/${activity.id}`}>
              {activity.text}
            </Link>
          </div>
        ))
      }
    </div>
  );
};

ActivityList.propTypes = {
  activities: React.PropTypes.array.isRequired
};

export default ActivityList
