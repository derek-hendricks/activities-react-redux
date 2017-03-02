export const LOCATION_CHANGE = 'LOCATION_CHANGE';

export function locationChange(location = '/') {
  return {
    type: LOCATION_CHANGE,
    payload: location
  }
}

export const updateLocation = ({dispatch}) => {
  return (nextLocation) => dispatch(locationChange(nextLocation))
};

const initialState = null;
export default function locationReducer(state = initialState, action) {
  if (action.type === LOCATION_CHANGE) {
    return action.payload;
  } else {
    return state;
  }
}
