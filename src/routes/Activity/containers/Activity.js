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
  handleActivityDelete: (id, onActivityDelete) => (
    onActivityDelete(id).then(({ data: { deleteActivity: { id } } }) => {
      return (
        dispatch(deleteActivity(id.split(": ")[1]))
      )
    }).catch((e) => {
      return e;
    })
  ),
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
      if (updated.categoryId) {
        moveActivity(updated, dispatchProps.dispatch, id, previousActivity);
      } else {
        dispatchProps.dispatch(updateActivity(updated));
      }
      return (
        onActivityUpdate(updated).then(({ data: { updateActivity: activity } }) => {
          console.log('updated:', activity);
        }).catch((err) => {
          console.log('err', err);
        })
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
    onActivityUpdate: ({ id, ...activity }) => {
      return (
        mutate({
          variables: {
            id: `activities: ${id}`,
            ...activity
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
