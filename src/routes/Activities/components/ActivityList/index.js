import React from 'react'
import PropTypes from 'prop-types'
import Link from 'react-router/Link'

import './styles.scss'

export const ActivityList = ({ edges }) => {
  return (
    <div className='activity-list'>
      {
        edges.map(({ node: { id, name } }, index) => (
          <div className='text' key={index}>
            <Link to={`/activity/${id}`}>
              {name}
            </Link>
          </div>
        ))
      }
    </div>
  );
};

const { string, arrayOf, shape, any } = PropTypes;

ActivityList.propTypes = {
  edges: arrayOf(shape({
    cursor: string,
    node: shape({
      id: string.isRequired,
      name: string.isRequired
    })
  })).isRequired
};

export default ActivityList
