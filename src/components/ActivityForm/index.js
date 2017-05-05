import React from 'react'
import Link from 'react-router/Link';
import PropTypes from 'prop-types';
import './styles.scss'
import {Button, Input} from 'semantic-ui-react'

export const ActivityForm = ({placeholder, onSubmit, buttonText, categories, activeCategoryId}) => {
  const activityObject = {};
  let categoryId = { value: activeCategoryId };

  return (
    <div className='activity-input'>
      <Input
        ref={(node) => activityObject.name = node}
        type='text'
        placeholder={`${placeholder} name`}
      >
      </Input>
      <Input
        ref={(node) => activityObject.about = node}
        type='text'
        placeholder={`${placeholder} description`}
      >
      </Input>
      <Input
        ref={(node) => activityObject.location = node}
        type='text'
        placeholder={`${placeholder} location`}
      >
      </Input>
      <Input
        ref={(node) => activityObject.date = node}
        type='date'
      >
      </Input>
      <select
        className={"ui search dropdown"}
        value={activityObject.categoryId}
        onChange={({target}) => categoryId = target }>
        {categories.map((category, index) => (
          <option key={index} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>

      <div onClick={() => {
        const activity = {...activityObject};
        return onSubmit({...activity, categoryId});
      } }>
        <Link to='/activities'>
          {buttonText}
        </Link>
      </div>

    </div>
  );
};

ActivityForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  placeholder: PropTypes.string.isRequired,
  buttonText: PropTypes.string.isRequired,
  activeCategoryId: PropTypes.string,
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      description: PropTypes.string
    })).isRequired
};

export default ActivityForm
