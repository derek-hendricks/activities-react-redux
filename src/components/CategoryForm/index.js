import React from 'react'
import './styles.scss'
import {Input} from 'semantic-ui-react'

export const CategoryForm = ({ onSubmit, type, category = {} }) => {
  const {
    id,
    name = "name",
    description = "description"
  } = category;

  const categoryObject = {};

  return (
      <div className='ui tiny form category-form'>
        <div className="four fields">
          <div className="field">
            <Input
              ref={(node) => categoryObject.name = node}
              type='text'
              placeholder={name}
            >
            </Input>
          </div>
          <div className={`field ${type}`}>
            <Input
              ref={(node) => categoryObject.description = node}
              type='text'
              placeholder={description}
            >
            </Input>
          </div>
          <div
            className="ui submit button small"
            size='small'
            onClick={() => {
              return onSubmit(categoryObject, id);
            }}>
            {type}
          </div>
        </div>
      </div>
  );
};

CategoryForm.propTypes = {
  onSubmit: React.PropTypes.func.isRequired,
  type: React.PropTypes.string.isRequired,
  category: React.PropTypes.object
};

export default CategoryForm
