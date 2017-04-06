export const ADD_ACTIVITY = 'ADD_ACTIVITY';
export const DELETE_ACTIVITY = 'DELETE_ACTIVITY';
export const UPDATE_ACTIVITY = 'UPDATE_ACTIVITY';
export const APOLLO_MUTATION_RESULT = 'APOLLO_MUTATION_RESULT';

export function deleteActivity(id) {
  return {
    type: DELETE_ACTIVITY,
    id
  };
}

export function addActivity(activity) {
  return {
    type: ADD_ACTIVITY,
    ...activity
  };
}

export function updateActivity(activity) {
  return {
    type: UPDATE_ACTIVITY,
    ...activity
  }
}

const initialState = [];

export default function activitiesReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_ACTIVITY:
      return activitiesAdded(state, action);

    case UPDATE_ACTIVITY:
      const activityIndex = getIndex(state, action);
      return activitiesUpdated(state, action, activityIndex);

    case DELETE_ACTIVITY:
      return activitiesDeleted(state, action);

    case APOLLO_MUTATION_RESULT:
      const {result: {data: {createActivity: {id, name, categoryId}}}} = action;
      const index = getIndex(state, {id: `${categoryId}:${name}`});
      return activitiesUpdated(state, {id}, index);

    default:
      return state;
  }
}

function getIndex(state, {id}) {
  return state.findIndex((activity) => activity.id === id);
}

function activitiesAdded(state, { type, __typename, ...activity }) {
  return state.concat(activity);
}

function activitiesUpdated(state, activity, activityIndex) {
  const previousActivity = state[activityIndex];
  const modifiedActivity = {
    ...previousActivity,
    ...activity
  };

  return [
    ...state.slice(0, activityIndex),
    modifiedActivity,
    ...state.slice(activityIndex + 1, state.length)
  ]
}

function activitiesDeleted(state, action) {
  const activityIndex = getIndex(state, action);

  return [
    ...state.slice(0, activityIndex),
    ...state.slice(activityIndex + 1, state.length)
  ];
}
