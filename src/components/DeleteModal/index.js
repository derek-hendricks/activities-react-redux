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
    const { name, description, id, activityEdges = [] } = category;
    const activityText = getActivityText(activityEdges);

    return (
      <Modal className={'delete-modal'} size={'small'} closeIcon={'close'} open={open} onClose={onClose}>
        <ModalHeader>Delete Category</ModalHeader>

        <ModalContent>
          <div className={'ui grid'}>
            <div className={'ten wide column'}>
              <div className={'ui segment'}>
                <ListItem className={'category-list-item'}>
                  <ListContent>
                    <ListHeader>{name}</ListHeader>
                    <listDescription>
                      {`Activities: ${activityEdges.length}`}
                    </listDescription>
                    <ListDescription>
                      {description ? `Description: ${description}` : 'No description'}
                    </ListDescription>
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
                listItems={activityEdges}
                listDescription={`${activityEdges.length} ${activityText}`}
              />
            </div>

            <div className={'eight wide column'}>
              <p>{activityEdges.length ? `${activityEdges.length} ${activityText} will be removed` : ''}</p>
            </div>
          </div>
        </ModalContent>

        <ModalActions>
          <Button onClick={onClose}>Cancel</Button>

          <Button labelPosition='right'>
            <Button onClick={() => {
              return onDelete(id, activityEdges)
            }}>
              Delete
            </Button>
          </Button>
        </ModalActions>
      </Modal>
    )
  }
};

function getActivityText(activities) {
  let activityText = '';
  if (activities.length) {
    activityText = activities.length > 1 ? 'activities' : 'activity';
  }
  return activityText;
}

const { bool, func, shape, string, object, array, } = PropTypes;

DeleteModal.propTypes = {
  open: bool.isRequired,
  onClose: func.isRequired,
  onDelete: func.isRequired,
  category: shape({
    id: string.isRequired,
    name: string.isRequired,
    description: string,
    pageInfo: object,
    activityEdges: array
  })
};

export default DeleteModal
