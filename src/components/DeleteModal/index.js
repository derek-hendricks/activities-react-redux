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
        <Modal className={'delete-modal'} size={'small'} closeIcon={'close'} open={open} onClose={onClose}>
          <ModalHeader>
            Delete Category
          </ModalHeader>

          <ModalContent>
            <div className={'ui grid'}>
              <div className={'ten wide column'}>
                <div className={'ui segment'}>
                  <ListItem className={'category-list-item'}>
                    <ListContent>
                      <ListHeader>{name}</ListHeader>
                      <listDescription>{`Activities: ${activities.length}`}</listDescription>
                      <ListDescription>{description ? `Description: ${description}` : 'No description'}</ListDescription>
                    </ListContent>
                  </ListItem>
                </div>
              </div>
              <div className={'left floated six wide column'}>
                <div className={"ui segment"}>
                  <div className={"image content"}>
                  <img
                    className={"ui wireframe image"}
                    src={"https://semantic-ui.com/images/wireframe/image.png"}
                  />
                  </div>
                </div>
              </div>

              <div className={'divider'}>
                <h5 className={"ui horizontal divider header"}>
                  <i className={"tag icon"}/>
                  Category Structure
                </h5>
              </div>
              <div className={'eight wide column'}>
              <CategoryFoldersList
                listHeader={name}
                listContents={activities}
                listDescription={`${activities.length} ${activityText}`}
              />
              </div>
              <div className={'eight wide column'}>
                <p>{activities.length ? `${activities.length} ${activityText} will be removed` : ''}</p>
              </div>
            </div>
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
