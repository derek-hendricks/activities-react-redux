const APOLLO_ACTIVITY_QUERY = "ACTIVITY_QUERY";
const APOLLO_UPDATE_ACTIVITY_MUTATION = "UPDATE_ACTIVITY_MUTATION";
const APOLLO_MUTATION_INIT = "APOLLO_MUTATION_INIT";

import {updateActivity} from './activities'

const initialState = {};

export default function activityReducer(state = initialState, action) {
  const { operationName, result, type } = action;
  const optimisticMutation = type === APOLLO_MUTATION_INIT;

  if (APOLLO_ACTIVITY_QUERY === operationName) {
    const { data: { categoryInterface: activity } }  = result;

    return { node: activity };
  } else if (optimisticMutation && APOLLO_UPDATE_ACTIVITY_MUTATION === operationName) {
    const { optimisticResponse: { activity } } = action;

    return updateActivity(state, activity)
  } else {

    return state;
  }
}


