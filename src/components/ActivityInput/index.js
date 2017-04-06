import React from 'react'
import './styles.scss'

export const ActivityInput = ({ placeholder, onSubmit, buttonText, categories, activeCategoryId }) => {
  let activityObject = {};
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

      <button
        onClick={() => {
          onSubmit(activityObject, activeCategoryId);
          activityObject = {};
        }}
      >
        {buttonText}
      </button>
    </div>
  );
};

ActivityInput.propTypes = {
  onSubmit: React.PropTypes.func.isRequired,
  placeholder: React.PropTypes.string.isRequired,
  buttonText: React.PropTypes.string.isRequired,
  activeCategoryId: React.PropTypes.string.isRequired,
  categories: React.PropTypes.array.isRequired
};

export default ActivityInput
