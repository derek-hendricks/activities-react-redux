import {connect} from 'react-redux'
import {graphql, compose} from 'react-apollo';
import gql from 'graphql-tag';
import {
  setProperties, 
  clearInputFields, 
  getCategory, 
  sortCategories
} from '../../../utils/index';
import Category from '../components/Category/index'

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
      return (
        mutate({
          variables: { ...activity },
          optimisticResponse: {
            __typename: "Mutation",
            createActivity: {
              ...activity,
              id: `${activity.categoryId}:${activity.name}`,
              __typename: "activities"
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
  graphql(query, queryOptions),
  graphql(createActivity, createActivityOptions)
)(Category);