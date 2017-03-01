export const OPEN_ACTIVITY = 'OPEN_ACTIVITY';

export function openActivity(id) {
  return {
    type: OPEN_ACTIVITY,
    id
  };
}

const initialState = "1";

export default function activeActivityIdReducer(state = initialState, action) {
  if (action.type === OPEN_ACTIVITY) {
    return action.id;
  } else {
    return state;
  }
}
