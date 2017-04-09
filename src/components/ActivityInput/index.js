import React from 'react'
import Link from 'react-router/Link';
import './styles.scss'

export const ActivityInput = ({ placeholder, onSubmit, buttonText, categories, activeCategoryId }) => {
  const activityObject = {};
  return (
    <div className='activity-input'>
      <input
        ref={(node) => activityObject.name = node}
        type='text'
        placeholder={`${placeholder} name`}
      >
      </input>

      <input
        ref={(node) => activityObject.about = node}
        type='text'
        placeholder={`${placeholder} description`}
      >
      </input>

      <input
        ref={(node) => activityObject.location = node}
        type='text'
        placeholder={`${placeholder} location`}
      >
      </input>

      <input
        ref={(node) => activityObject.date = node}
        type='date'
      >
      </input>

      <select value={activityObject.categoryId} onChange={({ target }) => activityObject.categoryId = target }>
        {categories.map((category, index) => (
          <option key={index} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>

      <div onClick={() => onSubmit(activityObject, activeCategoryId) }>
        <Link to='/activities'>
          {buttonText}
        </Link>
      </div>

    </div>
  );
};

ActivityInput.propTypes = {
  onSubmit: React.PropTypes.func.isRequired,
  placeholder: React.PropTypes.string.isRequired,
  buttonText: React.PropTypes.string.isRequired,
  activeCategoryId: React.PropTypes.string,
  categories: React.PropTypes.array.isRequired
};

export default ActivityInput

