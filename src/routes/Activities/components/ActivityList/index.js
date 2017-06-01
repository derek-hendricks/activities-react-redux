import React from 'react'
import PropTypes from 'prop-types'
import Link from 'react-router/Link'

import './styles.scss'

export const ActivityList = ({ activities }) => (
  <div className='activity-list'>
    {
      activities.map(({id, name}, index) => (
        <div className='text' key={index}>
          <Link to={`/activity/${id}`}>
            {name}
          </Link>
        </div>
      ))
    }
  </div>
);

const { string, arrayOf, shape } = PropTypes;

ActivityList.propTypes = {
  activities: arrayOf(shape({
    id: string.isRequired,
    name: string.isRequired
  })).isRequired
};

export default ActivityList
