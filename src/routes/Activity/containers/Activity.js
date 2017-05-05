import {connect} from "react-redux"
import {graphql, compose} from "react-apollo";
import gql from "graphql-tag"

import Activity from "../components/Activity/index"
import {
  setProperties,
  sortCategories,
  getActivity
} from "../../../utils";

const initialState = { activity: {}, categories: [] };

const mapStateToActivityProps = (state = initialState, action) => {
  const { id, error = false, loading = false } = action;
  const { activeCategoryId, categories: categoryList = [], activity = {} } = state;

  const categories = sortCategories(categoryList, activeCategoryId);
  const loadedActivity = getActivity(activeCategoryId, id, categories);

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
  handleActivityUpdate: ({ id, ...activity }, onActivityUpdate, previousActivity) => {
    const { categoryId: { value: categoryId } } = activity;
    let updatedActivity = { ...setProperties(activity, 'categoryId'), id };
    if (categoryId.trim()) {
      updatedActivity = { ...updatedActivity, categoryId }
    }
    return (
      onActivityUpdate(updatedActivity, previousActivity)
    );
  }
});

const activityDelete = gql`
  mutation DELETE_ACTIVITY_MUTATION($id: ID!) {
    DELETE_ACTIVITY_MUTATION(id: $id) {
      __typename
      id
    }
  }`;

const activityDeleteOptions = {
  props: ({ mutate }) => {
    return ({
      handleActivityDelete: (id) => {
        return (
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
      }
    })
  }
};

const activityUpdate = gql`mutation UPDATE_ACTIVITY_MUTATION($id: ID!, $name: String, $categoryId: String, $about: String, $location: String, $date: String) {
  UPDATE_ACTIVITY_MUTATION(id: $id, name: $name, about: $about, location: $location, date: $date, categoryId: $categoryId) {
    __typename
    id
  }
}`;

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

const activityQuery = gql`query ACTIVITY_QUERY($id: ID!) {
  categoryInterface(id: $id) {
    ... on Activity {
      id
      name
      about
      date
      location
      categoryId
    }
  }
}`;

const activityQueryOptions = {
  options: ({ id, store }) => {
    const { categories = [], activeCategoryId } = store.getState();
    const activity = getActivity(activeCategoryId, id, categories);

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
