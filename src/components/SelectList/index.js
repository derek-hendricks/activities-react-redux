import React from 'react'
import PropTypes from 'prop-types'

import './styles.scss'

export const SelectList = (props) => {
  const {
    items,
    onSelect,
    className = "ui search dropdown"
  } = props;

  return (
    <div className="select-list">
      <select
        className={className}
        onChange={({ target }) => onSelect({ target }) }>
        {items.map(({ name, id }, index) => (
          <option key={index} value={id}>
            {name}
          </option>
        ))}
      </select>
    </div>
  );
};

const { string, func, arrayOf, shape } = PropTypes;

SelectList.propTypes = {
  className: string,
  onSelect: func.isRequired,
  items: arrayOf(shape({
    id: string.isRequired,
    name: string.isRequired
  })).isRequired
};

export default SelectList
