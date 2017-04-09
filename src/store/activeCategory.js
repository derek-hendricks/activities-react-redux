export const OPEN_CATEGORY = 'OPEN_CATEGORY';
export const APOLLO_QUERY_RESULT = 'APOLLO_QUERY_RESULT';
export const APOLLO_MUTATION_INIT = "APOLLO_MUTATION_INIT";
export const APOLLO_CATEGORIES_QUERY = "CATEGORIES_QUERY";
export const APOLLO_UPDATE_ACTIVITY_MUTATION = "UPDATE_ACTIVITY_MUTATION";
export const APOLLO_ACTIVITY_QUERY = "ACTIVITY_QUERY";

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
  const { type, id, operationName, optimisticResponse, result } = action;
  const queryResult = type === APOLLO_QUERY_RESULT;
  const optimisticMutation = type === APOLLO_MUTATION_INIT;
  const categoriesQuery = APOLLO_CATEGORIES_QUERY === operationName;

  if (OPEN_CATEGORY === type) {

    return id;
  } else if (APOLLO_ACTIVITY_QUERY === operationName) {
    const { data: { categoryInterface: { categoryId } } }  = result;

    return categoryId;
  } else if (queryResult && categoriesQuery && !state) {
    const { result: { data: { categoryList: { categories } } } } = action;

    return categories[0].id;
  } else if (optimisticMutation && APOLLO_UPDATE_ACTIVITY_MUTATION === operationName) {

    return optimisticMutationStateSetup(state, optimisticResponse);
  } else {

    return state;
  }
}
