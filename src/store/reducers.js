import { combineReducers } from 'redux'
import activeCategoryIdReducer from './activeCategory'
import categoriesReducer from './categories'

export const makeRootReducer = (client) => {
  return combineReducers({
    activeCategoryId: activeCategoryIdReducer,
    categories: categoriesReducer,
    apollo: client.reducer()
  })
};

export default makeRootReducer
