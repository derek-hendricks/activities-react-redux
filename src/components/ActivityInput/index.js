import React from 'react'
import './styles.scss'

export const ActivityInput = ({ placeholder, onSubmit, buttonText, categories, activeCategoryId }) => {
  let activity = {};
  return (
    <div className='ui input'>
      <input
        ref={(node) => activity.name = node}
        type='text'
        placeholder={placeholder}
      >
      </input>
      <input
        ref={(node) => activity.about = node}
        type='text'
        placeholder="Activity Description"
      >
      </input>
      <input
        ref={(node) => activity.location = node}
        type='text'
        placeholder='Activity Location'
      >
      </input>
      <input
        ref={(node) => activity.date = node}
        type='date'
        placeholder='Activity Date'
      >
      </input>
      <select value={activity.categoryId} onChange={({target}) => {
        activity.categoryId = target;
      }}>
        {categories.map((category, index) => {
          return (
            <option key={index} value={category.id}>
              {category.name}
            </option>
          );
        })}
      </select>

      <button
        onClick={(event) => {
          onSubmit(activity, activeCategoryId);
          activity = {};
        }}
        className='ui primary button'
        type='submit'
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
  activeCategoryId: React.PropTypes.string
};

export default ActivityInput

