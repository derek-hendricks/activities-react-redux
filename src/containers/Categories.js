import {connect} from 'react-redux'
import {graphql, compose} from 'react-apollo'

import Categories from '../components/Categories'
import {categoriesQuery} from '../gql/queries'
import {openCategory} from '../store/activeCategory'
import {setButtonMethod} from '../store/actions'

import {
  OPTIMISTIC_ACTIVITY_ID,
  CATEGORY_TYPE_NAME
} from '../store/category'

import {
  categoryCreate,
  categoryDelete,
  categoryUpdate
} from '../gql/mutations'

import {
  setProperties,
  clearFormFields,
  getCategory,
  getCategoriesWithActiveSet
} from '../utils/index';

const initialState = {};

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

export const categoriesQueryOptions = {
  props: (props) => {
    const {
      data: { loading = true, error }
    } = props;

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

      return (mutate({
        variables,
        optimisticResponse: {
          category: {
            ...variables,
            id: OPTIMISTIC_ACTIVITY_ID,
            __typename: CATEGORY_TYPE_NAME
          }
        }
      }));
    }
  })
};

const categoryDeleteOptions = {
  props: ({ mutate }) => ({
    onCategoryDelete: (id, activities = []) => {
      const cachedIds = activities.map(({ node }) => node.id).join(",");

      return (
        mutate({
          variables: {
            id: `categories: ${id}`,
            cachedIds
          },
          optimisticResponse: {
            category: {
              id,
              __typename: CATEGORY_TYPE_NAME
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
            category: {
              ...categoryVariables,
              __typename: CATEGORY_TYPE_NAME,
              id
            }
          }
        })
      );
    }
  })
};

export default compose(
  graphql(categoriesQuery, categoriesQueryOptions),
  connect(
    (state) => mapStateToTabsProps(state),
    (dispatch) => mapDispatchToTabsProps(dispatch)),
  graphql(categoryCreate, categoryCreateOptions),
  graphql(categoryDelete, categoryDeleteOptions),
  graphql(categoryUpdate, categoryUpdateOptions)
)(Categories);
