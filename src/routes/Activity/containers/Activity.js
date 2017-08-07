import {connect} from "react-redux"
import {graphql, compose} from "react-apollo";
import Activity from "../components/Activity/index"

import {activityQuery} from '../../../gql/queries'
import {activityDelete, activityUpdate} from '../../../gql/mutations'
import {
  setProperties,
  clearFormFields,
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

const mergeActivityProps = (stateProps) => ({
  ...stateProps
});

const activityDeleteOptions = {
  props: ({ mutate }) => ({
    handleActivityDelete: (id, categoryId) => (
      mutate({
        variables: {
          id: `activities: ${id}`,
          categoryId: `categories: ${categoryId}`
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

const updatedActivity = (id, updatedValues) => {
  const { categoryId: { value: categoryId } } = updatedValues;
  const { data, inputReferences } = setProperties(updatedValues, 'categoryId');
  let updatedActivity = { ...data };

  if (categoryId.trim()) {
    updatedActivity = { ...updatedActivity, categoryId }
  }
  clearFormFields(inputReferences, updatedValues.categoryId);

  return updatedActivity;
};

const activityUpdateOptions = {
  props: ({ ownProps, mutate }) => ({
    updateActivity: ({ id, ...updatedValues }, previousCategoryId) => {
      const activity = updatedActivity(id, updatedValues);

      return (
        mutate({
          variables: {
            id: `activities: ${id}`,
            ...activity
          },
          optimisticResponse: {
            __typename: "Mutation",
            activity: {
              __typename: "Activity",
              id,
              ...activity
            },
            previousCategoryId
          }
        })
      );
    }
  })
};

const activityQueryOptions = {
  options: (props) => {
    return {
      variables: {
        id: `activities: ${props.id}`
      }
    };
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
    (stateProps) => mergeActivityProps(stateProps)),
  graphql(activityUpdate, activityUpdateOptions),
  graphql(activityDelete, activityDeleteOptions)
)(Activity);
