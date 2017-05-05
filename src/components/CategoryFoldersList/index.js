import React from 'react'
import './styles.scss'
import {
  List,
  ListDescription,
  ListHeader,
  ListContent,
  ListIcon,
  ListItem
} from 'semantic-ui-react';

export const CategoryFoldersList = ({ name, activities }) => (
  <div>
    <List>
      <ListItem>
        <ListIcon name='folder'/>
        <ListContent>
          <ListHeader>
            {name}
          </ListHeader>
          <ListDescription>
            {activities.length} activities
          </ListDescription>
          <List.List>
            {activities.map((activity, index) => (
              <ListItem key={index}>
                <ListIcon name='file'/>
                <ListContent>
                  <ListHeader>
                    {activity.name}
                  </ListHeader>
                  <ListDescription>
                    {activity.about ? `About: ${activity.about}` : ''}
                  </ListDescription>
                  <ListDescription>
                    {activity.location ? `Location: ${activity.location}` : ''}
                  </ListDescription>
                  <ListDescription>
                    {activity.date ? `Activity Date: ${activity.date}` : ''}
                  </ListDescription>
                </ListContent>
              </ListItem>
            ))}
          </List.List>
        </ListContent>
      </ListItem>
    </List>
  </div>
);

CategoryFoldersList.propTypes = {
  activities: React.PropTypes.array.isRequired
};

export default CategoryFoldersList
