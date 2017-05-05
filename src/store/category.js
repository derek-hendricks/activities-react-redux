import {getIndex} from './categories';
import {splitNodeId} from "../utils"

const CREATE_CATEGORY_MUTATION = "CREATE_CATEGORY_MUTATION";
const UPDATE_CATEGORY_MUTATION = "UPDATE_CATEGORY_MUTATION";
const DELETE_CATEGORY_MUTATION = "DELETE_CATEGORY_MUTATION";

const initialState = [];

export default function categoryReducer(operationName, optimisticMutation, mutationResult, action, state = initialState) {
  if (optimisticMutation && CREATE_CATEGORY_MUTATION === operationName) {

    return optimisticCreateStateSetup(action);
  } else if (mutationResult && CREATE_CATEGORY_MUTATION === operationName) {
    const { result: { data: { CREATE_CATEGORY_MUTATION: { id } } } } = action;
    const categoryId = splitNodeId(id);
    const index = getIndex(state, "-1");

    return mutationResultUpdateStateSetup(state, index, { id: categoryId });
  } else if (optimisticMutation && UPDATE_CATEGORY_MUTATION) {
    const { optimisticResponse: { category } } = action;
    const index = getIndex(state, category.id);

    return mutationResultUpdateStateSetup(state, index, category);
  } else if (optimisticMutation && DELETE_CATEGORY_MUTATION) {

    return optimisticDeleteStateSetup(state, action);
  } else {

    return state;
  }
}

function optimisticCreateStateSetup(action) {
  const { optimisticResponse: { category } } = action;
  return { category: {...category, activities: [] } };
}

function mutationResultUpdateStateSetup(state, index, attributes) {
  const previousCategory = state[index];
  const category = {
    ...previousCategory,
    ...attributes
  };
  return { category, index }
}

function optimisticDeleteStateSetup(state, action) {
  const { optimisticResponse: { category: { id } } } = action;

  return { index: getIndex(state, id) };
}
