import React from 'react'
import PropTypes from 'prop-types'
import {Input} from 'semantic-ui-react'

import './styles.scss'

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

const { func, string, shape } = PropTypes;

CategoryForm.propTypes = {
  onSubmit: func.isRequired,
  type: string.isRequired,
  category: shape({
    id: string,
    name: string,
    description: string
  })
};

export default CategoryForm
