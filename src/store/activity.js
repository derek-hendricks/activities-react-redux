export const APOLLO_ACTIVITY_QUERY = "ACTIVITY_QUERY";
export const OPEN_ACTIVITY = "OPEN_ACTIVITY";

export function openActivity(activity) {
  return {
    type: OPEN_ACTIVITY,
    activity
  };
}

const initialState = {};

export default function activityReducer(state = initialState, action) {
  const { operationName, type, activity, result } = action;

  if (APOLLO_ACTIVITY_QUERY === operationName) {
    const { data: { categoryInterface: activity } }  = result;

    return activity;
  } else if (OPEN_ACTIVITY === type) {

    return activity;
  } else {

    return state;
  }
}
