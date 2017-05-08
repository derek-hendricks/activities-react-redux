const APOLLO_ACTIVITY_QUERY = "ACTIVITY_QUERY";

const initialState = {};

export default function activityReducer(state = initialState, action) {
  const { operationName, result } = action;

  if (APOLLO_ACTIVITY_QUERY === operationName) {
    const { data: { categoryInterface: activity } }  = result;

    return activity;
  } else {

    return state;
  }
}
