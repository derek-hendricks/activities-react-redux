import React from 'react'
import PropTypes from 'prop-types'
import {Input, Button} from 'semantic-ui-react'

import SelectList from '../SelectList'
import './styles.scss'

export const ActivityForm = (props) => {
  const activityObject = {};
  const {
    onSubmit,
    buttonText,
    categories,
    activeCategoryId,
    placeholder
  } = props;
  let categoryId = { value: activeCategoryId };

  return (
    <div className='activity-input'>

      <div className='ui tiny form category-form'>
        <div className="five fields">
          <div className="field">
            <Input
              ref={(node) => activityObject.name = node}
              type='text'
              placeholder={placeholder ? `${placeholder} name` : 'name'}
            />
          </div>
          <div className="field">
            <Input
              ref={(node) => activityObject.about = node}
              type='text'
              placeholder={placeholder ? `${placeholder} description` : 'description'}
            />
          </div>
          <div className="field">
            <Input
              ref={(node) => activityObject.location = node}
              type='text'
              placeholder={placeholder ? `${placeholder} location` : 'location'}
            />
          </div>
          <div className="field">
            <Input
              ref={(node) => activityObject.date = node}
              type='date'
            />
          </div>
          <div className="field">
            <SelectList
              value={activityObject.categoryId}
              items={categories}
              onSelect={({ target }) => categoryId = target }
            />
          </div>
        </div>
      </div>

      <Button
        onClick={() => {
          const activity = { ...activityObject, categoryId };
          return onSubmit(activity);
        }}
      >
        {buttonText}
      </Button>
    </div>
  );
};

const { string, func, arrayOf, shape } = PropTypes;

ActivityForm.propTypes = {
  placeholder: string,
  activeCategoryId: string,
  onSubmit: func.isRequired,
  buttonText: string.isRequired,
  categories: arrayOf(shape({
    id: string.isRequired,
    name: string.isRequired,
    description: string
  })).isRequired
};

export default ActivityForm
