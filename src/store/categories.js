import activitiesReducer from './activities';
import categoryReducer from './category';
import {isInteger} from '../utils'

const ADD_ACTIVITY = "ADD_ACTIVITY";
const DELETE_ACTIVITY = "DELETE_ACTIVITY";
const UPDATE_ACTIVITY = "UPDATE_ACTIVITY";

const APOLLO_QUERY_RESULT = "APOLLO_QUERY_RESULT";
const APOLLO_MUTATION_INIT = "APOLLO_MUTATION_INIT";
const APOLLO_MUTATION_RESULT = "APOLLO_MUTATION_RESULT";

const APOLLO_CATEGORIES_QUERY = "CATEGORIES_QUERY";
const APOLLO_ACTIVITIES_QUERY = "ACTIVITIES_QUERY";

const APOLLO_DELETE_ACTIVITY_MUTATION = "DELETE_ACTIVITY_MUTATION";
const APOLLO_CREATE_ACTIVITY_MUTATION = "CREATE_ACTIVITY_MUTATION";
const APOLLO_UPDATE_ACTIVITY_MUTATION = "UPDATE_ACTIVITY_MUTATION";

const CREATE_CATEGORY_MUTATION = "CREATE_CATEGORY_MUTATION";
const UPDATE_CATEGORY_MUTATION = "UPDATE_CATEGORY_MUTATION";
const DELETE_CATEGORY_MUTATION = "DELETE_CATEGORY_MUTATION";


export function getIndex(categories, id) {
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

export function stateSetup(state, index, category, operation) {
  if (DELETE_CATEGORY_MUTATION === operation) {
    return [
      ...state.slice(0, index),
      ...state.slice(index + 1, state.length)
    ];
  }
  return [
    ...state.slice(0, index),
    category,
    ...state.slice(index + 1, state.length)
  ]
}

function apolloCategoriesStateSetup(action) {
  const { result: { data: { categoryList: { categories } } } } = action;

  return categories;
}

function categoryActivitiesQueryResultStateSetup(state, action) {
  const { result: { data: { categoryInterface: { activities } } } } = action;
  const index = findCategoryIndex(state, action);
  const category = {
    ...state[index],
    activities: activities.slice()
  };

  return stateSetup(state, index, category);
}

function moveCategoryStateSetup(state, activity, previousActivity) {
  const previousIndex = state.findIndex(category => category.id === previousActivity.categoryId);
  const deleteAction = { id: previousActivity.id, type: DELETE_ACTIVITY };
  const categoryWithActivityRemoved = categorySetup(state, deleteAction, previousIndex);
  const stateWithActivityRemoved = stateSetup(state, previousIndex, categoryWithActivityRemoved);

  const newIndex = stateWithActivityRemoved.findIndex(category => category.id === activity.categoryId);
  const addAction = { ...previousActivity, ...activity, type: ADD_ACTIVITY };
  const categoryWithActivityAdded = categorySetup(stateWithActivityRemoved, addAction, newIndex);

  return stateSetup(stateWithActivityRemoved, newIndex, categoryWithActivityAdded);
}

function updateCategoryStateSetup(state, action) {
  const { optimisticResponse: { activity, previousActivity } } = action;
  if (activity.categoryId && activity.categoryId !== previousActivity.categoryId) {
    return moveCategoryStateSetup(state, activity, previousActivity);
  }
  const updateAction = { ...activity, type: UPDATE_ACTIVITY };
  const index = findCategoryIndex(state, updateAction);
  const category = categorySetup(state, updateAction, index);

  return stateSetup(state, index, category);
}

function newActivityStateSetup(state, action) {
  const { result: { data: { CREATE_ACTIVITY_MUTATION: activity } } }  = action;
  const index = findCategoryIndex(state, { ...action, categoryId: activity.categoryId });
  const updatedCategory = categorySetup(state, action, index);

  return stateSetup(state, index, updatedCategory);
}

function optimisticActivityAddedStateSetup(state, action, optimisticResponse) {
  const { createActivity, createActivity: { categoryId } } = optimisticResponse;
  const index = findCategoryIndex(state, { ...action, categoryId });
  const updatedCategory = categorySetup(state, { ...createActivity, type: ADD_ACTIVITY }, index);

  return stateSetup(state, index, updatedCategory);
}

function optimisticActivityRemovedStateSetup(state, optimisticResponse) {
  const { activity: { id } } = optimisticResponse;
  const index = findCategoryIndex(state, { type: DELETE_ACTIVITY, id });
  const updatedCategory = categorySetup(state, { id, type: DELETE_ACTIVITY }, index);

  return stateSetup(state, index, updatedCategory);
}

const initialState = [];

export default function categoriesReducer(state = initialState, action) {
  const { type, operationName, optimisticResponse } = action;
  const optimisticMutation = type === APOLLO_MUTATION_INIT;
  const mutationResult = type === APOLLO_MUTATION_RESULT;

  if (optimisticMutation && APOLLO_CREATE_ACTIVITY_MUTATION === operationName) {

    return optimisticActivityAddedStateSetup(state, action, optimisticResponse);
  } else if (optimisticMutation && APOLLO_DELETE_ACTIVITY_MUTATION === operationName) {

    return optimisticActivityRemovedStateSetup(state, optimisticResponse);
  } else if (optimisticMutation && APOLLO_UPDATE_ACTIVITY_MUTATION === operationName) {

    return updateCategoryStateSetup(state, action);
  } else if (mutationResult && APOLLO_CREATE_ACTIVITY_MUTATION === operationName) {

    return newActivityStateSetup(state, action);
  } else if (APOLLO_CATEGORIES_QUERY === operationName) {

    return apolloCategoriesStateSetup(action)
  } else if (APOLLO_ACTIVITIES_QUERY === operationName) {

    return categoryActivitiesQueryResultStateSetup(state, action);
  } else if ([CREATE_CATEGORY_MUTATION, DELETE_CATEGORY_MUTATION, UPDATE_CATEGORY_MUTATION].indexOf(operationName) > -1) {

    return crudCategoryStateSetup(operationName, optimisticMutation, mutationResult, action, state);
  } else {

    return state;
  }
}

function crudCategoryStateSetup(operationName, optimisticMutation, mutationResult, action, state) {
  const { category, index } = categoryReducer(operationName, optimisticMutation, mutationResult, action, state);

  switch (operationName) {
    case CREATE_CATEGORY_MUTATION:

      return addedCategoryStateSetup(state, category, index, optimisticMutation);
    case DELETE_CATEGORY_MUTATION:

      return removedCategoryStateSetUp(state, index);
    case UPDATE_CATEGORY_MUTATION:

      return updatedCategoryStateSetup(state, category, index, optimisticMutation);
    default:

      return state;
  }
}

function addedCategoryStateSetup(state, category, index, optimisticMutation) {
  if (optimisticMutation) {
    return state.concat(category);
  }
  return stateSetup(state, index, category);
}

function updatedCategoryStateSetup(state, category, index, optimisticMutation) {
  if (optimisticMutation) {
    return stateSetup(state, index, category);
  }
  return state;
}

function removedCategoryStateSetUp(state, index) {
  if (isInteger(index)) {
    return stateSetup(state, index, null, DELETE_CATEGORY_MUTATION)
  } else {
    return state;
  }
}
