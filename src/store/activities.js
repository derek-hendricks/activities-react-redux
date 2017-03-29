export const ADD_ACTIVITY = 'ADD_ACTIVITY';
export const DELETE_ACTIVITY = 'DELETE_ACTIVITY';
export const UPDATE_ACTIVITY = 'UPDATE_ACTIVITY';

export function deleteActivity(id) {
  debugger;
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
    case ADD_ACTIVITY: {
      return activitiesAdded(state, action);
    }
    case UPDATE_ACTIVITY: {
      return activitiesUpdated(state, action);
    }
    case DELETE_ACTIVITY: {
      return activitiesDeleted(state, action);
    }
    default: {
      return state;
    }
  }
}

function getIndex(state, {id}) {
  return state.findIndex((activity) => activity.id === id);
}

function activitiesAdded(state, { type, __typename, ...activity }) {
  return state.concat(activity);
}

function activitiesUpdated(state, { type, __typename, ...activity }) {
  const activityIndex = getIndex(state, activity);
  const previousActivity = state[getIndex(state, activity)];
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
  debugger;
  const activityIndex = getIndex(state, action);

  return [
    ...state.slice(0, activityIndex),
    ...state.slice(activityIndex + 1, state.length)
  ];
}
