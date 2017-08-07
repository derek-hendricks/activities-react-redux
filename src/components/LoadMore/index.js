import React from 'react'
import PropTypes from 'prop-types'
import {Button} from 'semantic-ui-react'
import './styles.scss'

export const LoadMore = ({ loadItems, endCursor, hasNextPage, itemsName }) => {
  if (!hasNextPage) {
    return <div></div>
  }
  return (
    <div className='load-more'>
      <Button
        onClick={() => {
          if (hasNextPage) {
            loadItems({ before: endCursor, first: 15 });
          }
        }}>
        Load more {itemsName}
      </Button>
    </div>
  )
};

const { string, bool, func } = PropTypes;

LoadMore.propTypes = {
  loadItems: func.isRequired,
  itemsName: string.isRequired,
  hasNextPage: bool.isRequired,
  endCursor: string.isRequired
};

export default LoadMore
