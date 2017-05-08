import React from 'react'
import './styles.scss'
import {classify} from '../../utils'
import {
  List,
  ListDescription,
  ListHeader,
  ListContent,
  ListIcon,
  ListItem
} from 'semantic-ui-react';

export const CategoryFoldersList = (props) => {
  const { listHeader, listDescription, listContents } = props;

  const ListItemDetails = (data, index) => {
    const { id, categoryId, __typename, ...item } = data;
    const listItem = Object.keys(item).filter((attr) => item[attr]);
    return (
      <ListItem key={index} className={classify(__typename)}>
        <ListIcon name='file'/>
        <ListContent>
          <ListHeader>
            {item.name}
          </ListHeader>
          {listItem.map((attr) => (
            <ListDescription>
              {`${attr}: ${item[attr]}`}
            </ListDescription>
          ))}
        </ListContent>
      </ListItem>
    );
  };

  return (
    <div>
      <List>
        <ListItem>
          <ListIcon name='folder'/>
          <ListContent>
            <ListHeader>
              {listHeader}
            </ListHeader>
            <ListDescription>
              {listDescription}
            </ListDescription>
            <List>
              {listContents.map((item, index) => {
                return ListItemDetails(item, index);
              })}
            </List>
          </ListContent>
        </ListItem>
      </List>
    </div>
  );
};

CategoryFoldersList.propTypes = {
  listContents: React.PropTypes.array.isRequired,
  listDescription: React.PropTypes.string,
  listTitle: React.PropTypes.string
};

export default CategoryFoldersList
