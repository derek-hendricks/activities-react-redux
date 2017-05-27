import React from 'react'
import PropTypes from 'prop-types'
import {
  DimmerDimmable,
  Segment,
  Dimmer,
  Header,
  Icon
} from 'semantic-ui-react';

import './styles.scss'

export const LoadError = (props) => {
  const {
    errorText,
    className = "default",
    icon = "heart",
    dimmed = true,
    inverted = false
  } = props;

  return (
    <div className={className}>
      <DimmerDimmable className="error" as={Segment} dimmed={dimmed}>
        <Dimmer active={true}>
          <Header as="h2" icon={true} inverted={inverted}>
            <Icon name={icon}/>
            {errorText}
          </Header>
        </Dimmer>
      </DimmerDimmable>
    </div>
  )
};

const { string } = PropTypes;

LoadError.propTypes = {
  errorText: string.isRequired,
  className: string,
  icon: string,
  dimmed: string,
  inverted: string
};

export default LoadError
