import React from 'react'
import './styles.scss'
import Link from 'react-router/Link'
import {Button} from 'semantic-ui-react'

export const DeleteItem = (props) => {
  const {
    onSubmit,
    id,
    categoryId,
    text = 'Delete',
    url = '/activities'
  } = props;

  return (
    <div className='delete-item'>
      <Button onClick={() => {onSubmit(id, categoryId)}}>
        {text}
      </Button>

    </div>
  )
};

DeleteItem.propTypes = {
  onSubmit: React.PropTypes.func.isRequired,
  id: React.PropTypes.string.isRequired,
  categoryId: React.PropTypes.string.isRequired,
  text: React.PropTypes.string,
  url: React.PropTypes.string
};

export default DeleteItem
