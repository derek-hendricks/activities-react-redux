export const OPEN_CATEGORY = 'OPEN_CATEGORY';
export const APOLLO_QUERY_RESULT = 'APOLLO_QUERY_RESULT';
export const APOLLO_MUTATION_INIT = "APOLLO_MUTATION_INIT";
export const APOLLO_CATEGORIES_QUERY = "CategoriesQuery";
export const APOLLO_UPDATE_ACTIVITY_MUTATION = "UPDATE_ACTIVITY_MUTATION";

export function openCategory(id) {

  return {
    type: OPEN_CATEGORY,
    id
  };
}

function optimisticMutationStateSetup(state, optimisticResponse) {
  const { activity: { categoryId }, previousActivity: previousCategoryId } = optimisticResponse;
  if (categoryId && categoryId !== previousCategoryId) {

    return categoryId;
  } else {

    return state;
  }
}

const initialState = null;

export default function activeCategoryIdReducer(state = initialState, action) {
  const { type, id, operationName, optimisticResponse } = action;
  const queryResult = type === APOLLO_QUERY_RESULT;
  const optimisticMutation = type === APOLLO_MUTATION_INIT;

  if (OPEN_CATEGORY === type) {

    return id;
  } else if (queryResult && APOLLO_CATEGORIES_QUERY === operationName) {
    const { result: { data: { categoryList: { categories } } } } = action;

    return categories[0].id;
  } else if (optimisticMutation && APOLLO_UPDATE_ACTIVITY_MUTATION === operationName) {

    return optimisticMutationStateSetup(state, optimisticResponse);
  } else {

    return state;
  }
}
