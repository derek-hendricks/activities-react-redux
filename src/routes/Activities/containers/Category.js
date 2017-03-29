import { connect } from 'react-redux'
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag'
import { setProperties } from '../../../utils';
import { addActivity } from '../../../store/activities'
import Category from '../components/Category'

const initialState = { loading: true, error: false, category: {}, categories: [] };

const mapStateToCategoryProps = (state = initialState) => {
  const { activeCategoryId, categories }  = state;
  const category = categories.slice().find((category) => (
    category.id === activeCategoryId
  ));

  return {
    ...initialState,
    category: {
      ...state.category,
      ...category
    },
    activeCategoryId,
    categories: categories.slice().sort((activity) => (
      activity.id !== activeCategoryId
    ))
  };
};

const mapDispatchToCategoryProps = (dispatch) => ({ dispatch });

const mergeCategoryProps = (stateProps, dispatchProps) => ({
  ...stateProps,
  ...dispatchProps,
  handleActivitySubmit: (activity, categoryId, onActivitySubmit) => {
    const newActivity = setProperties(activity, "id");
    return onActivitySubmit({ ...newActivity, categoryId }).then((result) => {
      const { data: { createActivity: activity } } = result;
      return (
        dispatchProps.dispatch(
          addActivity(activity)
        )
      );
    })
  }
});

const query = gql`query ActivitiesQuery($id: ID!) {
  categoryInterface(id: $id) {
    ... on Category {
      id,
      activities {
        id
        name
        about
        date
        location
        categoryId
      }
    }
  }
}`;

const queryOptions = {
  options: ({ activeCategoryId }) => ({
    skip: !activeCategoryId,
    variables: {
      "id": `categories: ${activeCategoryId}`
    }
  }),
  props: ({ data: { loading, error = false } }) => ({
    loading,
    error
  })
};

const createActivity = gql`
  mutation createActivityMutation($name: String!, $categoryId: String!, $about: String, $location: String, $date: String) {
    createActivity(name: $name, categoryId: $categoryId, about: $about, location: $location, date: $date) {
      name
      id
      categoryId
      about
      location
      date
      createdAt
    }
  }`;

const createActivityOptions = {
  props: ({ ownProps: { activeCategoryId: categoryId }, mutate }) => ({
    onActivitySubmit: (activity) => (
      mutate({ variables: { ...activity } })
    )
  })
};

export default compose(
  connect(
    (state) => mapStateToCategoryProps(state),
    (dispatch) => mapDispatchToCategoryProps(dispatch),
    (stateProps, dispatchProps) => mergeCategoryProps(stateProps, dispatchProps)),
  graphql(query, queryOptions),
  graphql(createActivity, createActivityOptions)
)(Category);
