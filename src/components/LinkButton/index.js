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
        <Button onClick={() => onClick()}>
          {text}
        </Button>
      </Link>
    </div>
  )
};

const { func, string } = PropTypes;

LinkButton.propTypes = {
  onClick: func.isRequired,
  text: string.isRequired,
  url: string,
  className: string
};

export default LinkButton
