import React from "react"
import PropTypes from "prop-types"
import {
  List,
  ListDescription,
  ListHeader,
  ListContent,
  ListIcon,
  ListItem
} from "semantic-ui-react"

import "./styles.scss"
import {classify} from "../../utils"

export const CategoryFoldersList = (props) => {
  const {
    listHeader,
    listDescription,
    listContents,
    listIconName = 'folder',
    listItemIconName = 'file'
  } = props;

  const listItem = (data, index) => {
    const { id, categoryId, name, __typename, ...item } = data;
    const listItem = Object.keys(item).filter((attr) => item[attr]);
    return (
      <ListItem key={index} className={classify(__typename)}>
        <ListIcon name={listItemIconName}/>
        <ListContent>
          <ListHeader>{name}</ListHeader>
          {listItem.map(attr => (
            <ListDescription>{`${attr}: ${item[attr]}`}</ListDescription>
          ))}
        </ListContent>
      </ListItem>
    );
  };

  return (
    <List>
      <ListItem>
        <ListIcon name={listIconName}/>
        <ListContent>
          <ListHeader>{listHeader}</ListHeader>
          <ListDescription>{listDescription}</ListDescription>
          <List>
            {listContents.map((item, index) => listItem(item, index))}
          </List>
        </ListContent>
      </ListItem>
    </List>
  );
};

CategoryFoldersList.propTypes = {
  listHeader: PropTypes.string.isRequired,
  listContents: PropTypes.array.isRequired,
  listDescription: PropTypes.string,
  listTitle: PropTypes.string,
  listIconName: PropTypes.string,
  listItemIconName: PropTypes.string
};

export default CategoryFoldersList
