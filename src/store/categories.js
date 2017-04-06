import activitiesReducer from './activities';
export const ADD_ACTIVITY = 'ADD_ACTIVITY';
export const DELETE_ACTIVITY = 'DELETE_ACTIVITY';
export const UPDATE_ACTIVITY = 'UPDATE_ACTIVITY';
const APOLLO_QUERY_RESULT = 'APOLLO_QUERY_RESULT';
const APOLLO_MUTATION_INIT = 'APOLLO_MUTATION_INIT';
const APOLLO_CATEGORIES_QUERY = 'CategoriesQuery';
const APOLLO_ACTIVITIES_QUERY = 'ActivitiesQuery';
const APOLLO_DELETE_ACTIVITY = 'deleteActivity'; //todo: delete either this or DELETE_ACTIVITY
const APOLLO_MUTATION_RESULT = 'APOLLO_MUTATION_RESULT';

function getIndex(categories, id) {
  return categories.findIndex(
    (category) => category.id === id
  );
}

function getIndexByActivity(categories, activityId) {
  return categories.findIndex((category) => {
    return category.activities.find((activity) => {
      return activityId === activity.id;
    });
  });
}

function findCategoryIndex(categories, action) {
  const {
    type, result, categoryId, id: activityId
  } = action;
  switch (type) {
    case APOLLO_MUTATION_INIT:
    case APOLLO_MUTATION_RESULT:
      return getIndex(categories, categoryId);
    case APOLLO_QUERY_RESULT:
      const {data: {categoryInterface: {id: cId}}} = result;
      return getIndex(categories, cId.split(": ")[1]);
    case DELETE_ACTIVITY:
    case UPDATE_ACTIVITY:
      return getIndexByActivity(categories, activityId);
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
// APOLLO_MUTATION_RESULT
/*
 function moveActivity(updated, dispatch, id, previousActivity) {
 dispatch(deleteActivity(id));
 dispatch(openCategory(updated.categoryId));
 dispatch(addActivity({ ...previousActivity, ...updated }));
 }
 */
export default function categoriesReducer(state = initialState, action) {
  const {type, operationName, optimisticResponse} = action;
  let index;
  if (type === (UPDATE_ACTIVITY || DELETE_ACTIVITY)) {
    index = findCategoryIndex(state, action);
    const newCategory = categorySetup(state, action, index);

    return stateSetup(state, newCategory, index);
  } else if (type === APOLLO_MUTATION_INIT) {
    if (operationName === "createActivityMutation") {
      const {createActivity, createActivity: {categoryId}} = optimisticResponse;
      index = findCategoryIndex(state, {...action, categoryId});

      const newCategory = categorySetup(state, {...createActivity, type: ADD_ACTIVITY}, index);
      return stateSetup(state, newCategory, index);
    } else if (operationName === "deleteActivity") {
      const {activity: {id}} = optimisticResponse;
      index = findCategoryIndex(state, {type: DELETE_ACTIVITY, id});
      const updatedCategory = categorySetup(state, {id, type: DELETE_ACTIVITY}, index);

      return stateSetup(state, updatedCategory, index);

    } else if (operationName === "updateActivity") {
      index = findCategoryIndex(state, action);
      const category = categorySetup(state, action, index);
      return stateSetup(state, category, index);
    } else {

      return state;
    }
  } else if (type === APOLLO_MUTATION_RESULT) {
    const {result: {data: {createActivity:activity}}}  = action;
    index = findCategoryIndex(state, {...action, categoryId: activity.categoryId});
    const newCategory = categorySetup(state, action, index);

    return stateSetup(state, newCategory, index);
  } else if (operationName === APOLLO_CATEGORIES_QUERY) {
    const {result: {data: {categoryList: {categories}}}} = action;

    return categories.slice();
  } else if (operationName === APOLLO_ACTIVITIES_QUERY) {
    const {result: {data: {categoryInterface: {activities}}}} = action;
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
