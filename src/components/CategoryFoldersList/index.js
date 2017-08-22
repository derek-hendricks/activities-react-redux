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
    listItems,
    listIconName = "folder",
    listItemIconName = "file"
  } = props;

  const listItem = (itemData, itemIndex) => {
    const { id, categoryId, name, __typename, ...item } = itemData;
    const listItemAttributes = Object.keys(item).filter((attr) => item[ attr ]);

    return (
      <ListItem key={itemIndex} className={classify(__typename)}>
        <ListIcon name={listItemIconName}/>
        <ListContent>
          <ListHeader>{name}</ListHeader>
          {listItemAttributes.map((attr, index) => (
            <ListDescription key={index}>
              <strong>{`${capitalize(attr)}: `}</strong>{`${item[ attr ]}`}
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
            {listItems.map(({ node }, index) => listItem(node, index))}
          </List>
        </ListContent>
      </ListItem>
    </List>
  );
};

const {
  string, number, shape, arrayOf, oneOfType
} = PropTypes;

CategoryFoldersList.propTypes = {
  listHeader: string.isRequired,
  listItems: arrayOf(
    shape({
      node: shape({
        name: string.isRequired,
        id: oneOfType([ string, number ]).isRequired,
        categoryId: string,
        about: string,
        location: string,
        date: string,
        createdAt: string
      }).isRequired
    })
  ),
  listDescription: string,
  listTitle: string,
  listIconName: string,
  listItemIconName: string
};

export default CategoryFoldersList



