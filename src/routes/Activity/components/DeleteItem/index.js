import React from 'react'
import './styles.scss'
import Link from 'react-router/Link';

export const DeleteItem = ({ onSubmit, id }) => (
  <div className='delete-item'>
    <Link to={`/activities`} onClick={() => {
      onSubmit(id);
    }}>
      Delete
    </Link>
  </div>
);

DeleteItem.propTypes = {
  onSubmit: React.PropTypes.func.isRequired,
  id: React.PropTypes.string.isRequired
};

export default DeleteItem
