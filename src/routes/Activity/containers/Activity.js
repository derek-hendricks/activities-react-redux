import { connect } from 'react-redux'
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag'
import { setProperties } from '../../../utils';
import Activity from '../components/Activity/index'

const initialState = { activity: {}, categories: [] };

const mapStateToActivityProps = (state = initialState, { id: activityId }) => {
  const { activeCategoryId } = state;
  const categories = state.categories.slice().sort((category) => (
    category.id !== activeCategoryId
  ));
  const index = categories.findIndex((category) => (
    category.id === activeCategoryId
  ));
  const activities = categories[index].activities;
  const activity = activities[activities.findIndex((activity) => (
    activityId === activity.id
  ))];

  return (
    {
      activity,
      categories,
      activeCategoryId
    }
  );
};

const mapDispatchToActivityProps = (dispatch) => ({
  handleActivityDelete: (id, onActivityDelete) => {

    return (
      onActivityDelete(id)
    );
  },
  dispatch
});

const mergeActivityProps = (stateProps, dispatchProps) => {

  return ({
    ...stateProps,
    ...dispatchProps,
    handleActivityUpdate: ({ id, ...activity }, onActivityUpdate, previousActivity) => {
      const updated = { ...setProperties(activity), id };

      return (
        onActivityUpdate(updated, previousActivity)
      );
    }
  });
};

const activityDelete = gql`
  mutation DELETE_ACTIVITY_MUTATION($id: ID!) {
    DELETE_ACTIVITY_MUTATION(id: $id) {
      id
    }
  }`;

const activityDeleteOptions = {
  props: ({ ownProps, mutate }) => ({
    onActivityDelete: (id) => (
      mutate(
        {
          variables: {
            "id": `activities: ${id}`
          },
          optimisticResponse: {
            __typename: "Mutation",
            activity: {
              id,
              __typename: "activities"
            }
          }
        })
    )
  })
};

const activityUpdate = gql`mutation UPDATE_ACTIVITY_MUTATION($id: ID!, $name: String, $categoryId: String, $about: String, $location: String, $date: String) {
  UPDATE_ACTIVITY_MUTATION(id: $id, name: $name, about: $about, location: $location, date: $date, categoryId: $categoryId) {
    id
  }
}`;

const activityUpdateOptions = {
  props: ({ ownProps, mutate }) => ({
    onActivityUpdate: ({ id, ...activity }, previousActivity) => (
      mutate(
        {
          variables: {
            id: `activities: ${id}`,
            ...activity
          },
          optimisticResponse: {
            __typename: "Mutation",
            activity: {
              id,
              __typename: "activities",
              ...activity,
            },
            previousActivity
          }
        }
      )
    )
  })
};

export default compose(
  connect(
    (state, ownProps) => mapStateToActivityProps(state, ownProps),
    (dispatch) => mapDispatchToActivityProps(dispatch),
    (stateProps, dispatchProps) => mergeActivityProps(stateProps, dispatchProps)),
  graphql(activityDelete, activityDeleteOptions),
  graphql(activityUpdate, activityUpdateOptions)
)(Activity);
