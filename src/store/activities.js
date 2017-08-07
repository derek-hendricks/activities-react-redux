import {getEdgeIndex} from '../utils'
import {FETCH_MORE_ACTIVITIES} from './categories'

export const OPTIMISTIC_ACTIVITY_ID = -1;

const ADD_ACTIVITY = 'ADD_ACTIVITY';
const DELETE_ACTIVITY = 'DELETE_ACTIVITY';
const UPDATE_ACTIVITY = 'UPDATE_ACTIVITY';
const APOLLO_MUTATION_RESULT = 'APOLLO_MUTATION_RESULT';

export function activitiesReducer(state = [], type, action) {
  switch (type) {
    case ADD_ACTIVITY:

      return activityAdded(state, action);
    case UPDATE_ACTIVITY:
      const activityIndex = getEdgeIndex(state, action.id);

      return activityUpdated(state, action, activityIndex);
    case DELETE_ACTIVITY:

      return activitiesDeleted(state, action);
    case APOLLO_MUTATION_RESULT:
      const { result: { data: { CREATE_ACTIVITY_MUTATION: activity } } } = action;
      const index = getEdgeIndex(state, OPTIMISTIC_ACTIVITY_ID);

      return activityUpdated(state, activity, index);
    case FETCH_MORE_ACTIVITIES:

      return fetchedActivitiesAdded(state, action);
    default:

      return state;
  }
}

function fetchedActivitiesAdded(state, action) {
  const { activitiesPage: { edges } } = action;

  return [
    ...state,
    ...edges
  ];
}

function activityAdded(state, activity) {
  const optimisticActivity = {
    node: {
      ...activity
    }
  };

  return [
    ...state,
    optimisticActivity
  ]
}

export const updateActivity = (edge, updatedNodeProps) => {
  const { node: previousNode, ...activityEdge } = edge;
  const node = {
    ...previousNode,
    ...updatedNodeProps
  };

  return {
    ...activityEdge,
    node
  };
};

function activityUpdated(state, activity, activityIndex) {
  const updatedActivity = updateActivity(state[ activityIndex ], activity);

  return [
    ...state.slice(0, activityIndex),
    updatedActivity,
    ...state.slice(activityIndex + 1, state.length)
  ]
}

function activitiesDeleted(state, { id }) {
  const index = getEdgeIndex(state, id);

  return [
    ...state.slice(0, index),
    ...state.slice(index + 1, state.length)
  ];
}
