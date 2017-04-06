import { connect } from 'react-redux'
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag'
import { setProperties } from '../../../utils';
import { deleteActivity, updateActivity } from '../../../store/activities'
import { openCategory } from '../../../store/activeCategory'
import { addActivity } from '../../../store/activities'
import Activity from '../components/Activity/index'

const mapStateToActivityProps = ({ activeCategoryId, ...state }, { id: activityId }) => {
  const categories = state.categories.slice().sort((category) => {
    return category.id !== activeCategoryId;
  });
  const index = categories.findIndex((category) => {
    return category.id === activeCategoryId;
  });
  const activities = categories[index].activities;
  const activity = activities[activities.findIndex((activity) => {
    return activityId === activity.id;
  })];
  return (
    {
      activity,
      categories
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

function moveActivity(updated, dispatch, id, previousActivity) {
  dispatch(deleteActivity(id));
  dispatch(openCategory(updated.categoryId));
  dispatch(addActivity({ ...previousActivity, ...updated }));
}

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
  mutation deleteActivity($id: ID!) {
    deleteActivity(id: $id) {
      id
    }
  }`;

const activityDeleteOptions = {
  props: ({ ownProps, mutate }) => ({
    onActivityDelete: (id) => {
      return (
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
      );
    }
  })
};

const activityUpdate = gql`mutation updateActivity($id: ID!, $name: String, $categoryId: String, $about: String, $location: String, $date: String) {
  updateActivity(id: $id, name: $name, about: $about, location: $location, date: $date, categoryId: $categoryId) {
    id
  }
}`;

const activityUpdateOptions = {
  props: ({ ownProps, mutate }) => ({
    onActivityUpdate: ({ id, ...activity }, previousActivity) => {
      return (
        mutate({
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
        })
      );
    }
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
