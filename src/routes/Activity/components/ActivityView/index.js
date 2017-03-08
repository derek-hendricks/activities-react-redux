import React from 'react'
import './styles.scss'
import Activity from '../../containers/Activity'

export const ActivityView = (props) => {
  return (
    <div className='activity-view'>
      <Activity id={props.id} />
    </div>
  )
};

ActivityView.propTypes = {
  id: React.PropTypes.string.isRequired
};

export default ActivityView
