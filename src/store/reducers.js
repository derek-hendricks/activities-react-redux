import { combineReducers } from 'redux'
import activeCategoryIdReducer from './activeCategory'
import categoriesReducer from './categories'
import activityReducer from './activity'

export const makeRootReducer = (client) => {
  return combineReducers({
    activeCategoryId: activeCategoryIdReducer,
    categories: categoriesReducer,
    activity: activityReducer,
    apollo: client.reducer()
  })
};

export default makeRootReducer
