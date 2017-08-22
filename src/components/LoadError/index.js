import React from 'react'
import PropTypes from 'prop-types'

import {
  DimmerDimmable,
  Segment,
  Dimmer,
  Header,
  Icon
} from 'semantic-ui-react'

import './styles.scss'

export const LoadError = (props) => {
  const {
    errorText = "Error loading page",
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

const { string, bool } = PropTypes;

LoadError.propTypes = {
  errorText: string,
  className: string,
  icon: string,
  dimmed: string,
  inverted: bool
};

export default LoadError

