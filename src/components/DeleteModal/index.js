import React from "react"
import Link from "react-router/Link"
import CategoryFoldersList from "../CategoryFoldersList"
import {
  Button,
  Modal,
  ModalHeader,
  ModalContent,
  ModalActions
} from 'semantic-ui-react';
import "./styles.scss"

export const DeleteModal = (props) => {
  const { open, onClose, onDelete, category } = props;

  if (!category) {
    return (<div></div>)
  } else {
    const { name, description, id, activities = [] } = category;

    return (
      <div>
        <Modal size={'small'} closeIcon={'close'} open={open} onClose={onClose}>
          <ModalHeader>
           Delete Category
          </ModalHeader>

          <ModalContent>
            <h3>{`Name: ${name}`}</h3>
            <h3>{description ? `Description: ${description}` : ''}</h3>
            <p>{activities.length ? `The following will also be deleted` : ''}</p>
          <CategoryFoldersList name={'todo: category name or text or something'} activities={activities} />
          </ModalContent>

          <ModalActions>
            <Button onClick={onClose}>
              Cancel
            </Button>
            <Button labelPosition='right'>
              <Link to={`/activities`} onClick={() => onDelete(id, activities)}>
                Delete
              </Link>
            </Button>
          </ModalActions>
        </Modal>
      </div>
    )
  }
};

DeleteModal.propTypes = {
  open: React.PropTypes.bool.isRequired,
  onClose: React.PropTypes.func.isRequired,
  onDelete: React.PropTypes.func.isRequired,
  category: React.PropTypes.object
};

export default DeleteModal
