import React from 'react'
import PropTypes from 'prop-types'
import './styles.scss'
import {
  Icon,
  Button,
  ButtonGroup,
  ButtonOr,
  Popup
} from 'semantic-ui-react'

export const CategoryButtons = ({ setAction }) => (
  <ButtonGroup>
    <Popup content='Edit Category' size='small' trigger={
      <Button icon={true} onClick={() => setAction('edit')}>
        <Icon name='edit'/>
      </Button>
    }/>
    <ButtonOr />
    <Popup content='Remove Category' size='small' trigger={
      <Button icon={true} onClick={() => setAction('remove')}>
        <Icon name='remove'/>
      </Button>
    }/>
  </ButtonGroup>
);

const { func } = PropTypes;

CategoryButtons.propTypes = {
  setAction: func.isRequired
};

export default CategoryButtons
