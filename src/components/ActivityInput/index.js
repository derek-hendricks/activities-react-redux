import React from 'react'
import Link from 'react-router/Link';
import './styles.scss'

export const ActivityInput = ({ placeholder, onSubmit, buttonText, categories, activeCategoryId }) => {
  const activityObject = {};
  let categoryId = {value: activeCategoryId};

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

      <select value={activityObject.categoryId} onChange={({ target }) => categoryId = target }>
        {categories.map((category, index) => (
          <option key={index} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>

      <div onClick={() => {
        return onSubmit({ ...activityObject, categoryId }, activeCategoryId);
      } }>
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
  categories: React.PropTypes.arrayOf(React.PropTypes.object).isRequired
};

export default ActivityInput

