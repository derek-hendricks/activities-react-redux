export const OPEN_CATEGORY = 'OPEN_CATEGORY';
export const APOLLO_QUERY_RESULT = 'APOLLO_QUERY_RESULT';

export function openCategory(id) {
  return {
    type: OPEN_CATEGORY,
    id
  };
}

const initialState = null;

export default function activeCategoryIdReducer(state = initialState, action) {
  const { type, id, operationName } = action;
  if (type === OPEN_CATEGORY) {
    return id;
  } else if (type === APOLLO_QUERY_RESULT && "CategoriesQuery" === operationName) {
    const { result: { data: { categoryList: { categories } } } } = action;
    return categories[0].id;
  } else {
    return state;
  }
}
