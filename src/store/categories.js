import {activitiesReducer} from './activities';
import categoryReducer from './category';

import {
  isInteger, splitNodeId, getCategoryIndexByActivity, getIndex, getEdgeIndex
} from '../utils'

const ADD_ACTIVITY = "ADD_ACTIVITY";
const DELETE_ACTIVITY = "DELETE_ACTIVITY";
const UPDATE_ACTIVITY = "UPDATE_ACTIVITY";

const APOLLO_QUERY_RESULT = "APOLLO_QUERY_RESULT";
const APOLLO_MUTATION_INIT = "APOLLO_MUTATION_INIT";
const APOLLO_MUTATION_RESULT = "APOLLO_MUTATION_RESULT";
const APOLLO_UPDATE_QUERY_RESULT = "APOLLO_UPDATE_QUERY_RESULT";

const CATEGORIES_QUERY = "CATEGORIES_QUERY";
export const ACTIVITIES_QUERY = "ACTIVITIES_QUERY";
export const FETCH_MORE_ACTIVITIES = "FETCH_MORE_ACTIVITIES";
const DELETE_ACTIVITY_MUTATION = "DELETE_ACTIVITY_MUTATION";
const CREATE_ACTIVITY_MUTATION = "CREATE_ACTIVITY_MUTATION";
const UPDATE_ACTIVITY_MUTATION = "UPDATE_ACTIVITY_MUTATION";
const CREATE_CATEGORY_MUTATION = "CREATE_CATEGORY_MUTATION";
const UPDATE_CATEGORY_MUTATION = "UPDATE_CATEGORY_MUTATION";
const DELETE_CATEGORY_MUTATION = "DELETE_CATEGORY_MUTATION";

function stateSetup(state, index, category, operation) {

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

function categorySetup(state, { type, ...action }, index) {
  const previousCategory = state[ index ];
  const activityEdges = activitiesReducer(previousCategory.activityEdges, type, action);
  let pageInfo;
  if (FETCH_MORE_ACTIVITIES === type) {
    pageInfo = action.activitiesPage.pageInfo;
  } else {
    pageInfo = previousCategory.pageInfo;
  }

  return {
    ...previousCategory,
    activityEdges,
    pageInfo
  };
}

function apolloCategoriesStateSetup(action) {
  const { result: { data: { categoryList: { categories } } } } = action;

  return categories;
}

function categoryActivitiesQueryResultStateSetup(state, action) {
  const {
    result: { data: { categoryInterface: { id, activitiesPage: { edges, pageInfo } } } }
  } = action;

  const index = getIndex(state, splitNodeId(id));
  const previousCategory = state[ index ];
  const category = {
    ...previousCategory,
    activityEdges: edges,
    pageInfo
  };

  return stateSetup(state, index, category);
}

function moveActivityStateSetup(state, activity, previousCategoryIndex, updatedCategoryIndex) {
  const deleteAction = { id: activity.id, type: DELETE_ACTIVITY };
  const categoryWithActivityRemoved = categorySetup(state, deleteAction, previousCategoryIndex);
  const stateWithActivityRemoved = stateSetup(state, previousCategoryIndex, categoryWithActivityRemoved);

  const { activityEdges: previousActivityEdges } = state[ previousCategoryIndex ];
  const previousActivityIndex = getEdgeIndex(previousActivityEdges, activity.id);
  const { node: previousActivityNode } = previousActivityEdges[ previousActivityIndex ];
  const addAction = { ...previousActivityNode, ...activity, type: ADD_ACTIVITY };
  const categoryWithActivityAdded = categorySetup(stateWithActivityRemoved, addAction, updatedCategoryIndex);

  return stateSetup(stateWithActivityRemoved, updatedCategoryIndex, categoryWithActivityAdded);
}

function updateCategoryStateSetup(state, action) {
  const { optimisticResponse: { activity: updatedActivity, previousCategoryId } } = action;
  const { categoryId: updatedActivityCategoryId } = updatedActivity;

  const categoryIndex = getIndex(state, updatedActivityCategoryId || previousCategoryId);
  const {activityEdges} = state[ categoryIndex ] || {};

  if (!activityEdges) {
    return state;
  }

  if (updatedActivityCategoryId && updatedActivityCategoryId !== previousCategoryId) {
    return moveActivityStateSetup(state, updatedActivity, getIndex(state, previousCategoryId), categoryIndex);
  }

  const updateAction = { ...updatedActivity, type: UPDATE_ACTIVITY };
  const category = categorySetup(state, updateAction, categoryIndex);

  return stateSetup(state, categoryIndex, category);
}

function newActivityStateSetup(state, action) {
  const { result: { data: { CREATE_ACTIVITY_MUTATION: activity } } }  = action;
  const index = getIndex(state, activity.categoryId);
  const updatedCategory = categorySetup(state, action, index);

  return stateSetup(state, index, updatedCategory);
}

function optimisticActivityAddedStateSetup(state, optimisticResponse) {
  const { createActivity: activity } = optimisticResponse;
  const index = getIndex(state, activity.categoryId);
  const updatedCategory = categorySetup(state, { ...activity, type: ADD_ACTIVITY }, index);

  return stateSetup(state, index, updatedCategory);
}

function optimisticActivityRemovedStateSetup(state, optimisticResponse) {
  const { activity: { id } } = optimisticResponse;
  const index = getCategoryIndexByActivity(state, id);
  const updatedCategory = categorySetup(state, { id, type: DELETE_ACTIVITY }, index);

  return stateSetup(state, index, updatedCategory);
}

function fetchMoreActivitiesStateSetup(state, action) {
  const { result: { data: { categoryInterface } }, operationName } = action;
  const index = getIndex(state, splitNodeId(categoryInterface.id));
  const fetchMoreAction = { type: operationName, ...categoryInterface };
  const updatedCategory = categorySetup(state, fetchMoreAction, index);

  return stateSetup(state, index, updatedCategory);
}

const initialState = [];
export default function categoriesReducer(state = initialState, action) {
  const { type, operationName, optimisticResponse } = action;
  const optimisticMutation = APOLLO_MUTATION_INIT === type;
  const mutationResult = APOLLO_MUTATION_RESULT === type;

  if (optimisticMutation && CREATE_ACTIVITY_MUTATION === operationName) {

    return optimisticActivityAddedStateSetup(state, optimisticResponse);
  } else if (optimisticMutation && DELETE_ACTIVITY_MUTATION === operationName) {

    return optimisticActivityRemovedStateSetup(state, optimisticResponse);
  } else if (optimisticMutation && UPDATE_ACTIVITY_MUTATION === operationName) {

    return updateCategoryStateSetup(state, action);
  } else if (mutationResult && CREATE_ACTIVITY_MUTATION === operationName) {

    return newActivityStateSetup(state, action);
  } else if (CATEGORIES_QUERY === operationName) {

    return apolloCategoriesStateSetup(action)
  } else if (ACTIVITIES_QUERY === operationName) {

    return categoryActivitiesQueryResultStateSetup(state, action);
  } else if (FETCH_MORE_ACTIVITIES === operationName) {

    return fetchMoreActivitiesStateSetup(state, action);
  } else if ([ CREATE_CATEGORY_MUTATION, DELETE_CATEGORY_MUTATION, UPDATE_CATEGORY_MUTATION ].indexOf(operationName) > -1) {

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
  debugger;
  if (isInteger(index)) {
    return stateSetup(state, index, null, DELETE_CATEGORY_MUTATION)
  } else {
    return state;
  }
}
