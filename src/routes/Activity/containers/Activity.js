import {connect} from 'react-redux'
import {graphql, compose} from 'react-apollo';
import gql from 'graphql-tag'
import {setProperties} from '../../../utils';
import Activity from '../components/Activity/index'

const initialState = {activity: {}, categories: []};

const mapStateToActivityProps = (state = initialState, action) => {
  const {activeCategoryId, categories: categoryList = [], activity = {}} = state;
  const {id, error = false, loading = false} = action;

  const categories = categoryList.slice().sort((category) => (
    category.id !== activeCategoryId
  ));
  const activities = (categories.find(category => (
      activeCategoryId === category.id
    )) || {}).activities || [];

  const loadedActivity = activities.find((activity) => id === activity.id);

  return {
    activity: loadedActivity || activity,
    categories,
    activeCategoryId,
    loading,
    error
  }
};

const mapDispatchToActivityProps = (dispatch) => ({
  handleActivityDelete: (id, onActivityDelete) => (onActivityDelete(id)),
  dispatch
});

const mergeActivityProps = (stateProps, dispatchProps) => ({
  ...stateProps,
  ...dispatchProps,
  handleActivityUpdate: ({id, ...activity}, onActivityUpdate, previousActivity) => (
    onActivityUpdate({...setProperties(activity), id}, previousActivity)
  )
});

const activityDelete = gql`
  mutation DELETE_ACTIVITY_MUTATION($id: ID!) {
    DELETE_ACTIVITY_MUTATION(id: $id) {
      id
    }
  }`;

const activityDeleteOptions = {
  props: ({ownProps, mutate}) => ({
    onActivityDelete: (id) => (
      mutate({
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
  props: ({ownProps, mutate}) => ({
    onActivityUpdate: ({id, ...activity}, previousActivity) => (
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
  options: ({id, store}) => {
    const {categories, activeCategoryId} = store.getState();
    const category = categories[categories.findIndex(category => category.id === activeCategoryId)];
    const {activities = []} = category || {};
    const activity = activities.find(activity => activity.id === String(id));
    return ({
      skip: !id || activity,
      variables: {"id": `activities: ${id}`}
    });
  },
  props: ({data: {loading, error}}) => ({
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
  graphql(activityDelete, activityDeleteOptions),
  graphql(activityUpdate, activityUpdateOptions)
)(Activity);
