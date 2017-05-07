import {connect} from 'react-redux'
import {graphql, compose} from 'react-apollo'

import Category from '../components/Category/index'
import {activitiesQuery} from '../../../gql/queries'
import {createActivity} from '../../../gql/mutations'
import {
  setProperties,
  clearInputFields,
  getCategory,
  sortCategories
} from '../../../utils/index';

const initialState = { error: false, category: {}, activity: {}, categories: [] };

const mapStateToCategoryProps = (state = initialState) => {
  const { activeCategoryId, categories: categoryList }  = state;
  const category = getCategory({categories: categoryList}, activeCategoryId);
  const categories = sortCategories(categoryList, activeCategoryId);

  return {
    ...initialState,
    category,
    activeCategoryId,
    categories
  };
};

const mapDispatchToCategoryProps = (dispatch) => ({ dispatch });

const mergeCategoryProps = (stateProps, dispatchProps) => ({
  ...stateProps,
  ...dispatchProps,
  handleActivitySubmit: (activity, activeCategoryId, onActivitySubmit) => {
    const { categoryId: { value: categoryId } } = activity;
    const { data: newActivity, inputReferences } = setProperties(activity, 'categoryId');
    clearInputFields(inputReferences);

    return onActivitySubmit({ ...newActivity, categoryId })
  }
});

const queryOptions = {
  options: (props) => {
    const { category = {}, activeCategoryId } = props;
    const { activities } = category;

    return {
      skip: !activeCategoryId || !!activities,
      variables: {
        "id": `categories: ${activeCategoryId}`
      }
    };
  },
  props: ({ data: { loading, error = false } }) => {
    return {
      loading,
      error
    };
  }
};

const createActivityOptions = {
  props: ({ mutate }) => ({
    onActivitySubmit: (activity) => {
      return (
        mutate({
          variables: { ...activity },
          optimisticResponse: {
            __typename: "Mutation",
            createActivity: {
              ...activity,
              id: `${activity.categoryId}:${activity.name}`,
              __typename: "Activity"
            }
          }
        })
      );
    }
  })
};

export default compose(
  connect(
    (state) => mapStateToCategoryProps(state),
    (dispatch) => mapDispatchToCategoryProps(dispatch),
    (stateProps, dispatchProps) => mergeCategoryProps(stateProps, dispatchProps)),
  graphql(activitiesQuery, queryOptions),
  graphql(createActivity, createActivityOptions)
)(Category);
