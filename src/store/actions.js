export const SET_BUTTON_METHOD = 'SET_BUTTON_METHOD';

export function setButtonMethod(method) {
  return {
    type: SET_BUTTON_METHOD,
    method
  };
}

const initialState = {
  categoriesAction: false
};

export default function actionReducer(state = initialState, action) {
  const { type, method } = action;
  if (SET_BUTTON_METHOD === type) {
    return {
      ...state,
      ...method
    }
  } else {
    return state;
  }
}
