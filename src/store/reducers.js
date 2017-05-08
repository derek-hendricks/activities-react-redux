import {combineReducers} from 'redux'

import activeCategoryIdReducer from './activeCategory'
import categoriesReducer from './categories'
import activityReducer from './activity'
import actionsReducer from './actions'

export const makeRootReducer = (client) => {
  return combineReducers({
    actions: actionsReducer,
    activeCategoryId: activeCategoryIdReducer,
    categories: categoriesReducer,
    activity: activityReducer,
    apollo: client.reducer()
  })
};

export default makeRootReducer
