import activitiesReducer from './activities';

export const ADD_ACTIVITY = 'ADD_ACTIVITY';
export const DELETE_ACTIVITY = 'DELETE_ACTIVITY';
export const UPDATE_ACTIVITY = 'UPDATE_ACTIVITY';

const APOLLO_QUERY_RESULT = 'APOLLO_QUERY_RESULT';
const APOLLO_CATEGORIES_QUERY = 'CategoriesQuery';
const APOLLO_ACTIVITIES_QUERY = 'ActivitiesQuery';


function getIndex(categories, id) {
  return categories.findIndex(
    (category) => category.id === id
  );
}

function findCategoryIndex(categories, { type, result, categoryId, id, variables = {id: " : "}}) {
  switch (type) {
    case ADD_ACTIVITY:
      return getIndex(categories, categoryId);
    case APOLLO_QUERY_RESULT:
      const { data: { categoryInterface: { id: cId } } } = result;
      return getIndex(categories, cId.split(": ")[1]);
    case DELETE_ACTIVITY:
    case UPDATE_ACTIVITY:
      const activity_id = id || variables.id.split(": ")[1];
      return categories.findIndex((category) => {
        return category.activities.find((activity) => {
          return activity_id === activity.id;
        });
      });
    default:
      return;
  }
}

function categorySetup(state, action, index) {
  const previousCategory = state[index];
  const activities = activitiesReducer(previousCategory.activities, action);
  return {
    ...previousCategory,
    activities
  };
}

function stateSetup(state, category, index) {
  return [
    ...state.slice(0, index),
    category,
    ...state.slice(index + 1, state.length)
  ];
}

const initialState = [];

export default function categoriesReducer(state = initialState, action) {
  const { type, operationName } = action;
  let index;
debugger;
  if (type === (ADD_ACTIVITY || UPDATE_ACTIVITY) || operationName === "deleteActivity") {
    index = findCategoryIndex(state, action);
    const newCategory = categorySetup(state, action, index);

    return stateSetup(state, newCategory, index);

  } else if (operationName === APOLLO_CATEGORIES_QUERY) {
    const { result: { data: { categoryList: { categories } } } } = action;
    return categories.slice();
  } else if (operationName === APOLLO_ACTIVITIES_QUERY) {
    const { result: { data: { categoryInterface: {activities} } } } = action;
    index = findCategoryIndex(state, action);

    const category = {
      ...state[index],
      activities: activities.slice()
    };

    return stateSetup(state, category, index);
  } else {
    return state;
  }

}
