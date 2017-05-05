import React from "react"
import "./styles.scss"
import {
  DimmerDimmable,
  Segment,
  Dimmer,
  Header,
  Icon
} from 'semantic-ui-react';

export const LoadError = ({ props }) => {
  const {
    errorText,
    icon = 'heart',
    dimmed = true,
    inverted = false
  } = props;

  return (
    <DimmerDimmable as={Segment} dimmed={dimmed}>
      <Dimmer active={true}>
        <Header as='h2' icon inverted={inverted}>
          <Icon name={icon}/>
          {errorText}
        </Header>
      </Dimmer>
    </DimmerDimmable>
  )
};

LoadError.propTypes = {
  errorText: React.PropTypes.string.isRequired,
  icon: React.PropTypes.string,
  dimmed: React.PropTypes.string,
  inverted: React.PropTypes.string
};

export default LoadError
