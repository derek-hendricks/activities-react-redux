import React from 'react'
import PropTypes from 'prop-types'
import Link from 'react-router/Link'
import {Button} from 'semantic-ui-react'

import {classify} from '../../utils'

import './styles.scss'

export const LinkButton = (props) => {
  const {
    onClick,
    text,
    className,
    url = '/activities'
  } = props;

  return (
    <div className={className || classify(text)}>
      <Link to={url}>
        <Button onClick={() => {
          return onClick();
        }}>
          {text}
        </Button>
      </Link>
    </div>
  )
};

LinkButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
  url: PropTypes.string,
  className: PropTypes.string
};

export default LinkButton
