import activitiesReducer from './activities';

export const ADD_ACTIVITY = 'ADD_ACTIVITY';
export const DELETE_ACTIVITY = 'DELETE_ACTIVITY';
export const MODIFY_ACTIVITY = 'MODIFY_ACTIVITY';

function findCategoryIndex(categories, action) {
  switch (action.type) {
    case ADD_ACTIVITY: {
      return categories.findIndex(
        (category) => category.id === action.categoryId
      );
    }
    case MODIFY_ACTIVITY:
    case DELETE_ACTIVITY: {
      return categories.findIndex(
        (category) => category.activities.find((activity) => (
          activity.id === action.id
        ))
      );
    }
  }
}

function newCategorySetup(state, action, index) {
  const previousCategory = state[index];
  return {
    ...previousCategory,
    activities: activitiesReducer(previousCategory.activities, action)
  };
}

const initialState = [
  {
    id: '1',
    title: 'Category Tab 1',
    activities: []
  },
  {
    id: '2',
    title: 'Category tab 2',
    activities: []
  },
  {
    id: '3',
    title: 'Category Tab 3',
    activities: []
  }
];

export default function categoriesReducer(state = initialState, action) {
  switch (action.type) {
    case MODIFY_ACTIVITY:
    case ADD_ACTIVITY:
    case DELETE_ACTIVITY: {
      const categoryIndex = findCategoryIndex(state, action);
      const newCategory = newCategorySetup(state, action, categoryIndex);

      return [
        ...state.slice(0, categoryIndex),
        newCategory,
        ...state.slice(categoryIndex + 1, state.length)
      ]
    }
    default: {
      return state;
    }
  }
}
