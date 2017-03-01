export const OPEN_CATEGORY = 'OPEN_CATEGORY';

export function openCategory(id) {
  return {
    type: OPEN_CATEGORY,
    id
  };
}
const initialState = "1";

export default function activeCategoryIdReducer(state = initialState, action) {
  if (action.type === OPEN_CATEGORY) {
    return action.id;
  } else {
    return state;
  }
}
