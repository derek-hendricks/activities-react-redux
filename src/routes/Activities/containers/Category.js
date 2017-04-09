import { connect } from 'react-redux'
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import { setProperties } from '../../../utils/index';
import Category from '../components/Category/index'

const initialState = { loading: true, error: false, category: {}, activity: {}, categories: [] };

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
    const newActivity = setProperties(activity);

    return onActivitySubmit({ ...newActivity, categoryId });
  }
});

const query = gql`
  query ACTIVITIES_QUERY($id: ID!) {
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
  options: ({ category: { activities = [] }, activeCategoryId }) => ({
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
  mutation CREATE_ACTIVITY_MUTATION($name: String!, $categoryId: String!, $about: String, $location: String, $date: String) {
    CREATE_ACTIVITY_MUTATION(name: $name, categoryId: $categoryId, about: $about, location: $location, date: $date) {
      __typename
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
  props: ({ mutate }) => ({
    onActivitySubmit: (activity) => {
      const { categoryId, name } = activity;

      return (
        mutate(
          {
            variables: { ...activity },
            optimisticResponse: {
              __typename: "Mutation",
              createActivity: {
                ...activity,
                id: `${categoryId}:${name}`,
                __typename: "activities"
              }
            }
          }
        )
      );
    }
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
