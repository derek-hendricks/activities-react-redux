import React from 'react'
import './styles.scss'
import Activity from '../../containers/Activity'

export const ActivityView = ({ id }) => {
  return (
    <div className='activity-view'>
      <Activity id={id}/>
    </div>
  )
};

ActivityView.propTypes = {
  id: React.PropTypes.string.isRequired
};

export default ActivityView
