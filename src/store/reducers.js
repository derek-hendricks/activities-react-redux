import { combineReducers } from 'redux'
import activeCategoryIdReducer from './activeCategory'
import categoriesReducer from './categories'
import activeActivityIdReducer from './activeActivity'
import locationReducer from './location'

export const makeRootReducer = () => {
  return combineReducers({
    activeCategoryId: activeCategoryIdReducer,
    categories: categoriesReducer,
    activeActivityId: activeActivityIdReducer,
    location: locationReducer
  })
};

export default makeRootReducer
