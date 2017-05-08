import React from "react"
import Link from "react-router/Link"
import PropTypes from "prop-types"
import {
  Button,
  Modal,
  ModalHeader,
  ModalContent,
  ModalActions
} from 'semantic-ui-react';

import CategoryFoldersList from "../CategoryFoldersList"
import "./styles.scss"

export const DeleteModal = (props) => {
  const { open, onClose, onDelete, category } = props;

  if (!category) {
    return (<div></div>)
  } else {
    const { name, description, id, activities = [] } = category;

    let activityText = '';
    if (activities.length) {
      activityText = activities.length > 1 ? 'activities' : 'activity';
    }

    return (
      <div>
        <Modal size={'small'} closeIcon={'close'} open={open} onClose={onClose}>
          <ModalHeader>
            Delete Category
          </ModalHeader>

          <ModalContent>
            <h3>{`Name: ${name}`}</h3>
            <h4>{description ? `Description: ${description}` : ''}</h4>
            <p>{activities.length ? `The ${activityText} below will also be deleted` : ''}</p>

            <CategoryFoldersList
              listHeader={name}
              listContents={activities}
              listDescription={`${activities.length} ${activityText}`}
            />
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
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  category: PropTypes.shape({
    name: PropTypes.string.isRequired,
    description: PropTypes.string
  }).isRequired
};

export default DeleteModal
