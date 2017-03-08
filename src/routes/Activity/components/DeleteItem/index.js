import React from 'react'
import './styles.scss'
import Link from 'react-router/Link';

export const DeleteItem = (props) => {
    return (
      <div className='delete-item'>
        <Link to={`/activities`} onClick={() => {
          props.onSubmit(props.activityId);
        }}>
         Delete
        </Link>
      </div>
    )
};

DeleteItem.propTypes = {
  onSubmit: React.PropTypes.func.isRequired,
  activityId: React.PropTypes.string.isRequired
};

export default DeleteItem
