import React from 'react'
import './styles.scss'
import Activity from '../../containers/Activity'

export const ActivityView = ({ id, store, props }) => {
  return (
    <div className='activity-view'>
      <Activity id={id} store={store} props={props}/>
    </div>
  )
};

ActivityView.propTypes = {
  id: React.PropTypes.string.isRequired,
  store: React.PropTypes.object.isRequired,
  props: React.PropTypes.object.isRequired
};

export default ActivityView
