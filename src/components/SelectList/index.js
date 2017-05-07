import React from 'react'
import PropTypes from 'prop-types'

import './styles.scss'

export const SelectList = (props) => {
  const {
    items,
    onSelect,
    value,
    className = "ui search dropdown"
  } = props;

  return (
    <div className="select-list">
      <select
        className={className}
        value={value}
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

SelectList.propTypes = {
  className: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired
    })).isRequired
};

export default SelectList
