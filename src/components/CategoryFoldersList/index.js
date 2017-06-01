import React from 'react'
import PropTypes from 'prop-types'
import {
  List,
  ListDescription,
  ListHeader,
  ListContent,
  ListIcon,
  ListItem
} from 'semantic-ui-react'

import './styles.scss'
import {classify, capitalize} from '../../utils'

export const CategoryFoldersList = (props) => {
  const {
    listHeader,
    listDescription,
    listContents,
    listIconName = "folder",
    listItemIconName = "file"
  } = props;

  const listItem = (data, index) => {
    const { id, categoryId, type, name, __typename, ...item } = data;
    const listItemAttributes = Object.keys(item).filter((attr) => item[attr]);
    return (
      <ListItem key={index} className={classify(__typename)}>
        <ListIcon name={listItemIconName}/>
        <ListContent>
          <ListHeader>{name}</ListHeader>
          {listItemAttributes.map((attr, index) => (
            <ListDescription key={index}>
              <strong>{`${capitalize(attr)}: `}</strong>{`${item[attr]}`}
            </ListDescription>
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

const { string, shape, arrayOf } = PropTypes;

CategoryFoldersList.propTypes = {
  listHeader: string.isRequired,
  listContents: arrayOf(
    shape({
      id: string.isRequired,
      name: string.isRequired,
      categoryId: string,
      description: string,
      location: string,
      date: string,
      __typename: string,
      type: string
    })).isRequired,
  listDescription: string,
  listTitle: string,
  listIconName: string,
  listItemIconName: string
};

export default CategoryFoldersList
