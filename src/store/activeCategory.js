import {splitNodeId} from "../utils"

const OPEN_CATEGORY = 'OPEN_CATEGORY';
const CATEGORY_REMOVED = 'CATEGORY_REMOVED';
const APOLLO_QUERY_RESULT = 'APOLLO_QUERY_RESULT';
const APOLLO_MUTATION_INIT = "APOLLO_MUTATION_INIT";
const APOLLO_CATEGORIES_QUERY = "CATEGORIES_QUERY";
const APOLLO_UPDATE_ACTIVITY_MUTATION = "UPDATE_ACTIVITY_MUTATION";
const APOLLO_ACTIVITY_QUERY = "ACTIVITY_QUERY";
const APOLLO_MUTATION_RESULT = "APOLLO_MUTATION_RESULT";
const APOLLO_CREATE_ACTIVITY_MUTATION = "CREATE_ACTIVITY_MUTATION";
const APOLLO_CREATE_CATEGORY_MUTATION = "CREATE_CATEGORY_MUTATION";

export function openCategory(id) {
  return {
    type: OPEN_CATEGORY,
    id
  };
}

const initialState = null;

export default function activeCategoryIdReducer(state = initialState, action) {
  const { type, id, operationName, optimisticResponse, result, method } = action;
  const { categoriesAction = {} } = method || {};

  const queryResult = type === APOLLO_QUERY_RESULT;
  const categoriesQuery = APOLLO_CATEGORIES_QUERY === operationName;
  const optimisticMutation = type === APOLLO_MUTATION_INIT;
  const mutationResult = type === APOLLO_MUTATION_RESULT;

  if (OPEN_CATEGORY === type) {

    return id;
  } else if (APOLLO_ACTIVITY_QUERY === operationName) {
    const { data: { categoryInterface: { categoryId } } }  = result;

    return categoryId;
  } else if (queryResult && categoriesQuery && !state) {
    const { result: { data: { categoryList: { categories } } } } = action;

    return categories[0].id;
  } else if (CATEGORY_REMOVED === categoriesAction.action) {

    return categoryRemovedStateSetup(categoriesAction);
  } else if (mutationResult && APOLLO_CREATE_ACTIVITY_MUTATION === operationName) {

    return createActivityMutationResultSetup(state, action);
  } else if (optimisticMutation && APOLLO_UPDATE_ACTIVITY_MUTATION === operationName) {

    return optimisticUpdateActivityStateSetup(state, optimisticResponse);
  } else if (optimisticMutation && APOLLO_CREATE_CATEGORY_MUTATION === operationName) {

    return optimisticCreateCategoryStateSetup(state, action);
  } else if (mutationResult && APOLLO_CREATE_CATEGORY_MUTATION === operationName) {

    return createCategoryMutationResultStateSetup(action);
  } else {

    return state;
  }
}

function optimisticUpdateActivityStateSetup(state, optimisticResponse) {
  const { activity: { categoryId }, previousActivity: previousCategoryId } = optimisticResponse;
  if (categoryId && categoryId !== previousCategoryId) {
    return categoryId;
  } else {
    return state;
  }
}

function createActivityMutationResultSetup(state, action) {
  const { result: { data: { CREATE_ACTIVITY_MUTATION: { categoryId } } } }  = action;
  if (categoryId !== state) {
    return categoryId;
  }
  return state;
}

function optimisticCreateCategoryStateSetup(state, action) {
  const { optimisticResponse: { category: { id } } } = action;

  return id;
}

function createCategoryMutationResultStateSetup(action) {
  const { result: { data: { CREATE_CATEGORY_MUTATION: { id } } } } = action;

  return splitNodeId(id);
}

function categoryRemovedStateSetup(action) {
  const { categories, id } = action;
  const defaultCategory = categories[0].id;
  if (id === defaultCategory) {
    return categories[1].id;
  }
  return defaultCategory;
}
