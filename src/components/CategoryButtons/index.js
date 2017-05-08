import React from "react"
import {
  Icon,
  Button,
  ButtonGroup,
  ButtonOr,
  Popup
} from "semantic-ui-react";

import "./styles.scss"

export const CategoryButtons = ({setAction}) =>  (
    <div>
      <Popup content='Add Category' size='small' trigger={
        <Button icon={true} onClick={() => setAction('add')}>
          <Icon name='add circle'/>
        </Button>
      }/>
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
    </div>
  );

CategoryButtons.propTypes = {
  setAction: React.PropTypes.func.isRequired
};

export default CategoryButtons
