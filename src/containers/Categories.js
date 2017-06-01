import {connect} from 'react-redux'
import {graphql, compose} from 'react-apollo'

import {openCategory} from '../store/activeCategory'
import {setButtonMethod} from '../store/actions'
import Categories from '../components/Categories'

import {categoriesQuery} from '../gql/queries'
import {categoryCreate, categoryDelete, categoryUpdate} from '../gql/mutations'

import {
  setProperties,
  clearFormFields,
  getCategory,
  getCategoriesWithActiveSet,
  getCategoryDeleteVariables
} from '../utils/index';

const initialState = { categories: [] };

const mapStateToTabsProps = (state = initialState) => {
  const { actions, activeCategoryId } = state;
  const categories = getCategoriesWithActiveSet(state, activeCategoryId);
  const category = getCategory(state, activeCategoryId);

  return {
    categories,
    actions,
    category
  }
};

const mapDispatchToTabsProps = (dispatch) => (
  {
    onCategorySelect: (id) => (
      dispatch(openCategory(id))
    ),
    onCategoryActionSet: (method) => (
      dispatch(setButtonMethod({ categoriesAction: method }))
    )
  }
);

const queryOptions = {
  options: ({ activeCategoryId }) => {
    return { skip: activeCategoryId };
  },
  props: ({ data: { loading = true, error = false } }) => {
    return {
      loading,
      error
    }
  }
};

const categoryCreateOptions = {
  props: ({ mutate }) => ({
    handleCategoryCreate: (category) => {
      const { data: variables, inputReferences } = setProperties(category);
      clearFormFields(inputReferences);

      return (
        mutate({
          variables,
          optimisticResponse: {
            __typename: "Mutation",
            category: {
              ...variables,
              id: '-1',
              __typename: "Category"
            }
          }
        })
      );
    }
  })
};

const categoryDeleteOptions = {
  props: ({ mutate }) => ({
    onCategoryDelete: (id, deletedActivities = []) => {
      const variables = getCategoryDeleteVariables(id, deletedActivities);
      return (
        mutate({
          variables,
          optimisticResponse: {
            __typename: "Mutation",
            category: {
              id,
              __typename: "Category"
            }
          }
        })
      );
    }
  })
};

const categoryUpdateOptions = {
  props: ({ mutate }) => ({
    handleCategoryUpdate: (category, id) => {
      const { data: categoryVariables, inputReferences } = setProperties(category);
      clearFormFields(inputReferences);

      return (
        mutate({
          variables: {
            ...categoryVariables,
            id: `categories: ${id}`
          },
          optimisticResponse: {
            __typename: "Mutation",
            category: {
              ...categoryVariables,
              __typename: "Category",
              id
            }
          }
        })
      );
    }
  })
};

export default compose(
  graphql(categoriesQuery, queryOptions),
  connect(
    (state) => mapStateToTabsProps(state),
    (dispatch) => mapDispatchToTabsProps(dispatch)),
  graphql(categoryCreate, categoryCreateOptions),
  graphql(categoryDelete, categoryDeleteOptions),
  graphql(categoryUpdate, categoryUpdateOptions)
)(Categories);
