import activitiesReducer from './activities';

export const ADD_ACTIVITY = 'ADD_ACTIVITY';
export const DELETE_ACTIVITY = 'DELETE_ACTIVITY';
export const MODIFY_ACTIVITY = 'MODIFY_ACTIVITY';

function findCategoryIndex(categories, action) {
  switch (action.type) {
    case ADD_ACTIVITY:
      return categories.findIndex(
        (category) => category.id === action.categoryId
      );
    case MODIFY_ACTIVITY:
    case DELETE_ACTIVITY:
      return categories.findIndex(
        (category) => category.activities.find((activity) => (
          activity.id === action.id
        ))
      );
    default:
      return;
  }
}

function newCategorySetup(state, action, index) {
  const previousCategory = state[index];
  return {
    ...previousCategory,
    activities: activitiesReducer(previousCategory.activities, action)
  };
}

const initialState = [];

export default function categoriesReducer(state = initialState, action) {
  if (action.payload) {
    if (action.payload.state) {
      let categories = action.payload.state.categories;
      let categoryList = [];
      for (let i = 0; i < categories.length; i++) {
        let category = action.payload.state.categories[i];
        category.activities = [];
        categoryList.push(category);
      }
      state = categoryList;
    }
  }
  switch (action.type) {
    case MODIFY_ACTIVITY:
    case ADD_ACTIVITY:
    case DELETE_ACTIVITY:
      const categoryIndex = findCategoryIndex(state, action);
      const newCategory = newCategorySetup(state, action, categoryIndex);

      return [
        ...state.slice(0, categoryIndex),
        newCategory,
        ...state.slice(categoryIndex + 1, state.length)
      ];
    default:
      return state;

  }
}
