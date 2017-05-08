import {getIndex} from '../utils'

const ADD_ACTIVITY = 'ADD_ACTIVITY';
const DELETE_ACTIVITY = 'DELETE_ACTIVITY';
const UPDATE_ACTIVITY = 'UPDATE_ACTIVITY';
const APOLLO_MUTATION_RESULT = 'APOLLO_MUTATION_RESULT';

const initialState = [];

export default function activitiesReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_ACTIVITY:

      return activitiesAdded(state, action);
    case UPDATE_ACTIVITY:
      const activityIndex = getIndex(state, action.id);

      return activityUpdated(state, action, activityIndex);
    case DELETE_ACTIVITY:

      return activitiesDeleted(state, action);
    case APOLLO_MUTATION_RESULT:
      const { result: { data: { CREATE_ACTIVITY_MUTATION: { id, name, categoryId } } } } = action;
      const index = getIndex(state, `${categoryId}:${name}`);

      return activityUpdated(state, { id }, index);
    default:
      return state;
  }
}

function activitiesAdded(state, { type, __typename, ...activity }) {
  return [].concat(activity, state);
}

function activityUpdated(state, activity, activityIndex) {
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

function activitiesDeleted(state, {id}) {
  const activityIndex = getIndex(state, id);

  return [
    ...state.slice(0, activityIndex),
    ...state.slice(activityIndex + 1, state.length)
  ];
}
