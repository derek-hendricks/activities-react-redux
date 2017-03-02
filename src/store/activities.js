import uuidV1 from 'uuid/v1';

export const ADD_ACTIVITY = 'ADD_ACTIVITY';
export const DELETE_ACTIVITY = 'DELETE_ACTIVITY';
export const MODIFY_ACTIVITY = 'MODIFY_ACTIVITY';

export function deleteActivity(id) {
  return {
    type: DELETE_ACTIVITY,
    id
  };
}

export function addActivity(categoryId, text) {
  return {
    type: ADD_ACTIVITY,
    text,
    categoryId
  };
}

export function modifyActivity(id, text) {
  return {
    type: MODIFY_ACTIVITY,
    id,
    text
  }
}

const initialState = [];

export default function activitiesReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_ACTIVITY: {
      return activitiesAdded(state, action);
    }
    case MODIFY_ACTIVITY: {
      return activitiesModified(state, action);
    }
    case DELETE_ACTIVITY: {
      return activitiesDeleted(state, action);
    }
    default: {
      return state;
    }
  }
}

function getIndex(state, action) {
  return state.findIndex((activity) => activity.id === action.id);
}

function activitiesAdded(state, action) {
  const newActivity = {
    text: action.text,
    timestamp: Date.now(),
    id: uuidV1(),
  };
  return state.concat(newActivity);
}

function activitiesModified(state, action) {
  const activityIndex = getIndex(state, action);
  const previousActivity = state[activityIndex];
  const modifiedActivity = {
    ...previousActivity,
    text: action.text
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
