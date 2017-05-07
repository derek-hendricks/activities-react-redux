import React from 'react'
import PropTypes from 'prop-types'
import {Input} from 'semantic-ui-react'

import SelectList from '../SelectList'
import LinkButton from '../LinkButton'
import './styles.scss'

export const ActivityForm = (props) => {
  const activityObject = {};
  const {
    onSubmit,
    buttonText,
    categories,
    activeCategoryId,
    placeholder = ''
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
              placeholder={`${placeholder} name`}
            />
          </div>
          <div className="field">
            <Input
              ref={(node) => activityObject.about = node}
              type='text'
              placeholder={`${placeholder} description`}
            />
          </div>
          <div className="field">
            <Input
              ref={(node) => activityObject.location = node}
              type='text'
              placeholder={`${placeholder} location`}
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

      <LinkButton
        text={buttonText}
        onClick={() => {
          const activity = { ...activityObject, categoryId };
          return onSubmit(activity);
        }}
      />
    </div>
  );
};

ActivityForm.propTypes = {
  placeholder: PropTypes.string,
  activeCategoryId: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
  buttonText: PropTypes.string.isRequired,
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      description: PropTypes.string
    })
  ).isRequired
};

export default ActivityForm
