import {connect} from "react-redux"
import {graphql, compose} from "react-apollo";
import Activity from "../components/Activity/index"

import {activityQuery} from '../../../gql/queries'
import {activityDelete, activityUpdate} from '../../../gql/mutations'
import {
  setProperties,
  clearInputFields,
  sortCategories,
  getActivityByCategoryId
} from "../../../utils";

const initialState = { activity: {}, categories: [] };

const mapStateToActivityProps = (state = initialState, action) => {
  const { id, error = false, loading = false } = action;
  const { activeCategoryId, categories: categoryList = [], activity = {} } = state;

  const categories = sortCategories(categoryList, activeCategoryId);
  const loadedActivity = getActivityByCategoryId(activeCategoryId, id, categories);

  return {
    activity: loadedActivity || activity,
    categories,
    activeCategoryId,
    loading,
    error
  }
};

const mapDispatchToActivityProps = (dispatch) => ({ dispatch });

const mergeActivityProps = (stateProps, dispatchProps) => ({
  ...stateProps,
  ...dispatchProps,
  handleActivityUpdate: ({ id: activityId, ...activity }, onActivityUpdate, previousActivity) => {
    const { categoryId: { value: categoryId } } = activity;
    const { data, inputReferences } = setProperties(activity, 'categoryId');
    let updatedActivity = { ...data, id: activityId };
    if (categoryId.trim()) {
      updatedActivity = { ...updatedActivity, categoryId }
    }
    clearInputFields(inputReferences);

    return (
      onActivityUpdate(updatedActivity, previousActivity)
    );
  }
});

const activityDeleteOptions = {
  props: ({ mutate }) => ({
    handleActivityDelete: (id) => (
      mutate({
        variables: {
          id: `activities: ${id}`
        },
        optimisticResponse: {
          __typename: "Mutation",
          activity: {
            __typename: "Activity",
            id
          }
        }
      })
    )
  })
};

const activityUpdateOptions = {
  props: ({ ownProps, mutate }) => ({
    onActivityUpdate: ({ id, ...activity }, previousActivity) => (
      mutate({
        variables: {
          id: `activities: ${id}`,
          ...activity
        },
        optimisticResponse: {
          __typename: "Mutation",
          activity: {
            id,
            __typename: "Activity",
            ...activity,
          },
          previousActivity
        }
      })
    )
  })
};

const activityQueryOptions = {
  options: ({ id, store }) => {
    const { categories = [], activeCategoryId } = store.getState();
    const activity = getActivityByCategoryId(activeCategoryId, id, categories);

    return ({
      skip: !id || activity,
      variables: {
        "id": `activities: ${id}`
      }
    });
  },
  props: ({ data: { loading, error } }) => ({
    loading: !!loading,
    error: !!error
  })
};

export default compose(
  graphql(activityQuery, activityQueryOptions),
  connect(
    (state, ownProps) => mapStateToActivityProps(state, ownProps),
    (dispatch) => mapDispatchToActivityProps(dispatch),
    (stateProps, dispatchProps) => mergeActivityProps(stateProps, dispatchProps)),
  graphql(activityUpdate, activityUpdateOptions),
  graphql(activityDelete, activityDeleteOptions)
)(Activity);
