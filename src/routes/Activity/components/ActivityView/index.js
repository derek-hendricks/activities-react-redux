import React from 'react'
import PropTypes from 'prop-types'

import './styles.scss'
import Activity from '../../containers/Activity'

export const ActivityView = ({ id, store, props }) => {
  return (
    <div className='activity-view'>
      <Activity id={id} store={store} props={props}/>
    </div>
  )
};

const { string, object } = PropTypes;

ActivityView.propTypes = {
  id: string.isRequired,
  store: object.isRequired,
  props: object.isRequired
};

export default ActivityView
