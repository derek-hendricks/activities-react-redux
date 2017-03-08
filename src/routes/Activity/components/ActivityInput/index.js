import React from 'react'
import './styles.scss'

export const ActivityInput = (props) => {
  let input;
  return (
    <div className='ui input'>
      <input
        ref={(node) => input = node}
        type='text'
        placeholder={props.placeholder}
      >
      </input>
      <button
        onClick={() => {
          props.onSubmit(input.value);
          input.value = '';
        }}
        className='ui primary button'
        type='submit'
      >
        {props.buttonText}
      </button>
    </div>
  );
};

ActivityInput.propTypes = {
  onSubmit: React.PropTypes.func.isRequired,
  placeholder: React.PropTypes.string.isRequired,
  buttonText: React.PropTypes.string.isRequired
};

export default ActivityInput
