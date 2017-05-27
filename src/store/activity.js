const APOLLO_ACTIVITY_QUERY = "ACTIVITY_QUERY";
const APOLLO_UPDATE_ACTIVITY_MUTATION = "UPDATE_ACTIVITY_MUTATION";
const APOLLO_MUTATION_INIT = "APOLLO_MUTATION_INIT";

const initialState = {};

function updateActivityStateSetup(action) {
  const { optimisticResponse: { activity, previousActivity } } = action;

  return {
    ...previousActivity,
    ...activity
  };
}

export default function activityReducer(state = initialState, action) {
  const { operationName, result, type } = action;
  const optimisticMutation = type === APOLLO_MUTATION_INIT;

  if (APOLLO_ACTIVITY_QUERY === operationName) {
    const { data: { categoryInterface: activity } }  = result;

    return activity;
  } else if (optimisticMutation && APOLLO_UPDATE_ACTIVITY_MUTATION === operationName) {

    return updateActivityStateSetup(action)
  } else {

    return state;
  }
}
