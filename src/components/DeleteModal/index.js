import React from "react"
import Link from "react-router/Link"
import PropTypes from "prop-types"
import {
  Button,
  Modal,
  ModalHeader,
  ModalContent,
  ModalActions,
  ListItem,
  ListContent,
  ListHeader,
  ListDescription
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
      <div className={'delete-modal'}>
        <Modal size={'small'} closeIcon={'close'} open={open} onClose={onClose}>
          <ModalHeader>
            Delete Category
          </ModalHeader>

          <ModalContent>
            <div className={'ui segment'}>
              <ListItem className={'category-list-item'}>
                <ListContent>
                  <ListHeader>{name}</ListHeader>
                  <listDescription>{`Activities: ${activities.length}`}</listDescription>
                  <ListDescription>{description ? `Description: ${description}` : ''}</ListDescription>
                </ListContent>
              </ListItem>
            </div>

            <p>{activities.length ? `${activities.length} ${activityText} will also be removed` : ''}</p>

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
