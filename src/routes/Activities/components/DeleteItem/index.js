import React from 'react'
import './styles.scss'

export const DeleteItem = (props) => {
    return (
      <div className='delete-item'>
        <button
          onClick={() => {
            props.onSubmit(props.activityId);
          }}
          className='.btn'
          type='delete'
        >
          Delete
        </button>
      </div>
    )
};

DeleteItem.propTypes = {
  onSubmit: React.PropTypes.func.isRequired,
  activityId: React.PropTypes.string.isRequired
};

export default DeleteItem
