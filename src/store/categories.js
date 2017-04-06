import activitiesReducer from './activities';

export const ADD_ACTIVITY = "ADD_ACTIVITY";
export const DELETE_ACTIVITY = "DELETE_ACTIVITY";
export const UPDATE_ACTIVITY = "UPDATE_ACTIVITY";

export const APOLLO_QUERY_RESULT = "APOLLO_QUERY_RESULT";
export const APOLLO_MUTATION_INIT = "APOLLO_MUTATION_INIT";
export const APOLLO_MUTATION_RESULT = "APOLLO_MUTATION_RESULT";

export const APOLLO_CATEGORIES_QUERY = "CategoriesQuery";
export const APOLLO_ACTIVITIES_QUERY = "ActivitiesQuery";

export const APOLLO_DELETE_ACTIVITY = "DELETE_ACTIVITY_MUTATION";
export const APOLLO_CREATE_ACTIVITY_MUTATION = "CREATE_ACTIVITY_MUTATION";
export const APOLLO_UPDATE_ACTIVITY_MUTATION = "UPDATE_ACTIVITY_MUTATION";

function getIndex(categories, id) {
  return categories.findIndex(category => category.id === id);
}

function getIndexByActivity(categories, activityId) {
  return categories.findIndex((category) => (
    category.activities.find((activity) => (
      activityId === activity.id
    ))
  ))
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
      const { data: { categoryInterface: { id: cId } } } = result;

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

function categoryActivitiesQueryResultStateSetup(state, action) {
  const { result: { data: { categoryInterface: { activities } } } } = action;
  const index = findCategoryIndex(state, action);
  const category = {
    ...state[index],
    activities: activities.slice()
  };

  return stateSetup(state, category, index);
}

function moveCategoryStateSetup(state, activity, previousActivity) {
  const previousCategoryIndex = findCategoryIndex(state, { type: DELETE_ACTIVITY, id: previousActivity.id });
  const categoryWithActivityRemoved = categorySetup(state, { id: previousActivity.id, type: DELETE_ACTIVITY }, previousCategoryIndex);
  const stateWithActivityRemoved = stateSetup(state, categoryWithActivityRemoved, previousCategoryIndex);

  const newCategoryIndex = findCategoryIndex(stateWithActivityRemoved, { ...activity, type: APOLLO_MUTATION_INIT });
  const categoryWithActivityAdded = categorySetup(stateWithActivityRemoved, { ...previousActivity, ...activity, type: ADD_ACTIVITY }, newCategoryIndex);

  return stateSetup(stateWithActivityRemoved, categoryWithActivityAdded, newCategoryIndex);
}

function updateCategoryStateSetup(state, action) {
  const { optimisticResponse: { activity, previousActivity } } = action;
  if (activity.categoryId && activity.categoryId !== previousActivity.categoryId) {

    return moveCategoryStateSetup(state, activity, previousActivity);
  }
  const updateAction = { ...activity, type: UPDATE_ACTIVITY };
  const index = findCategoryIndex(state, updateAction);
  const category = categorySetup(state, updateAction, index);

  return stateSetup(state, category, index);
}

function newActivityStateSetup(state, action) {
  const { result: { data: { createActivity: activity } } }  = action;
  const index = findCategoryIndex(state, { ...action, categoryId: activity.categoryId });
  const updatedCategory = categorySetup(state, action, index);

  return stateSetup(state, updatedCategory, index);
}

function optimisticActivityAddedStateSetup(state, action, optimisticResponse) {
  const { createActivity, createActivity: { categoryId } } = optimisticResponse;
  const index = findCategoryIndex(state, { ...action, categoryId });
  const updatedCategory = categorySetup(state, { ...createActivity, type: ADD_ACTIVITY }, index);

  return stateSetup(state, updatedCategory, index);
}

function optimisticActivityRemovedStateSetup(state, optimisticResponse) {
  const { activity: { id } } = optimisticResponse;
  const index = findCategoryIndex(state, { type: DELETE_ACTIVITY, id });
  const updatedCategory = categorySetup(state, { id, type: DELETE_ACTIVITY }, index);

  return stateSetup(state, updatedCategory, index);
}

const initialState = [];

export default function categoriesReducer(state = initialState, action) {
  const { type, operationName, optimisticResponse } = action;
  const optimisticMutation = type === APOLLO_MUTATION_INIT;
  const mutationResult = type === APOLLO_MUTATION_RESULT;

  if (optimisticMutation && APOLLO_CREATE_ACTIVITY_MUTATION === operationName) {

    return optimisticActivityAddedStateSetup(state, action, optimisticResponse);
  } else if (optimisticMutation && APOLLO_DELETE_ACTIVITY === operationName) {

    return optimisticActivityRemovedStateSetup(state, optimisticResponse);
  } else if (optimisticMutation && APOLLO_UPDATE_ACTIVITY_MUTATION === operationName) {

    return updateCategoryStateSetup(state, action);
  } else if (mutationResult && APOLLO_CREATE_ACTIVITY_MUTATION === operationName) {

    return newActivityStateSetup(state, action);
  } else if (APOLLO_CATEGORIES_QUERY === operationName) {
    const { result: { data: { categoryList: { categories } } } } = action;

    return categories.slice();
  } else if (APOLLO_ACTIVITIES_QUERY === operationName) {

    return categoryActivitiesQueryResultStateSetup(state, action);
  } else {

    return state;
  }
}
