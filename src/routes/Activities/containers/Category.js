import {connect} from 'react-redux'
import {graphql, compose} from 'react-apollo'

import Category from '../components/Category/index'
import {gqlActivities} from '../../../gql/queries'
import {createActivity} from '../../../gql/mutations'
import {OPTIMISTIC_ACTIVITY_ID} from '../../../store/activities'
import {ACTIVITIES_QUERY, FETCH_MORE_ACTIVITIES} from '../../../store/categories'

import {
  setProperties,
  clearFormFields,
  getCategory,
  sortCategories,
  splitNodeId
} from '../../../utils/index';

const initialState = {
  error: false, loading: false,
  category: {}, activity: {}, categories: []
};

const mapStateToCategoryProps = (state = initialState) => {
  const { activeCategoryId, categories: categoryList }  = state;
  const category = getCategory({ categories: categoryList }, activeCategoryId);
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
    clearFormFields(inputReferences, activity.categoryId);

    return onActivitySubmit({ ...newActivity, categoryId })
  }
});

const updateActivitiesQuery = (previousResult, result) => {
  const { fetchMoreResult: { data: { categoryInterface: { activitiesPage, id } } } } = result;
  const { pageInfo, edges } = activitiesPage;

  return {
    data: {
      activitiesPage: {
        pageInfo,
        edges
      },
      categoryId: splitNodeId(id)
    }
  };
};

const fetchMoreActivities = (props, { before, first }) => {
  const { data: { fetchMore }, ownProps: { category } } = props;

  return fetchMore({
    variables: {
      id: `categories: ${category.id}`,
      first,
      before
    },
    query: gqlActivities(FETCH_MORE_ACTIVITIES),
    updateQuery: updateActivitiesQuery
  });
};

const activitiesQueryOptions = {
  options: ({ activeCategoryId }) => {
    return {
      skip: +activeCategoryId < 0,
      variables: {
        id: `categories: ${activeCategoryId}`,
        first: 10
      }
    };
  },
  props: (props) => {
    const { data:  { loading, error = false } } = props;

    return {
      loading,
      error,
      loadMoreActivities: (cursor) => (
        fetchMoreActivities(props, cursor)
      )
    }
  }
};

const createActivityOptions = {
  props: ({ mutate }) => {
    const mutateOptions = (activity) => ({
      variables: { ...activity },
      optimisticResponse: {
        __typename: "Mutation",
        createActivity: {
          ...activity,
          id: OPTIMISTIC_ACTIVITY_ID,
          __typename: "Activity"
        }
      }
    });

    return {
      onActivitySubmit: (activity) => (
        mutate(mutateOptions(activity))
      )
    };
  }
};

export default compose(
  connect(
    (state) => mapStateToCategoryProps(state),
    (dispatch) => mapDispatchToCategoryProps(dispatch),
    (stateProps, dispatchProps) => mergeCategoryProps(stateProps, dispatchProps)),
  graphql(gqlActivities(ACTIVITIES_QUERY), activitiesQueryOptions),
  graphql(createActivity, createActivityOptions)
)(Category);
