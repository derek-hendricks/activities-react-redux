import {connect} from 'react-redux'
import {graphql, compose} from 'react-apollo';
import gql from 'graphql-tag';

import {openCategory} from '../store/activeCategory'
import {setButtonMethod} from '../store/actions'
import Categories from '../components/Categories'

const initialState = { categories: [] };

const mapStateToTabsProps = (state = initialState) => {
  const { actions, activeCategoryId } = state;
  const categories = getCategories(state, activeCategoryId);
  const category = getCategory(state, activeCategoryId);

  return {
    categories,
    actions,
    category
  }
};

function getCategories({categories}, id) {
  if (!categories) {
    return;
  }
  return categories.slice().map((category) => ({
    ...category,
    active: category.id === id
  }));
}

function getCategory({categories}, id) {
  if (!categories) {
    return;
  }
  return categories.slice().find((category) => (
    category.id === id
  ));
}

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

const CategoriesQuery = gql`
  query CATEGORIES_QUERY {
    categoryList {
      categories {
        id
        description
        name
      }
    }
  }`;

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

const categoryCreate = gql`
  mutation CREATE_CATEGORY_MUTATION($name: String!) {
    CREATE_CATEGORY_MUTATION(name: $name) {
      __typename
      name
      id
    }
  }`;

const categoryCreateOptions = {
  props: ({ mutate }) => ({
    handleCategoryCreate: (category) => {
      const { name: { inputRef: { value: name } } } = category;

      return (
        mutate({
          variables: { name },
          optimisticResponse: {
            __typename: "Mutation",
            category: {
              ...category,
              id: '-1',
              __typename: "Category"
            }
          }
        })
      );
    }
  })
};

const categoryDelete = gql`
  mutation DELETE_CATEGORY_MUTATION($id: ID!, $activities: String) {
    DELETE_CATEGORY_MUTATION(id: $id, activities: $activities) {
      __typename
      id
    }
  }`;

const categoryDeleteOptions = {
  props: ({ mutate }) => ({
    handleCategoryDelete: (id, deletedActivities = []) => {
      const deleteVariables = {
        "id": `categories: ${id}`
      };
      let variables = { ...deleteVariables };
      if (deletedActivities.length >= 1) {
        const activities = deletedActivities.map((activity) => (activity.id)).join(",");
        variables = { ...deleteVariables, activities };
      }
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

const categoryUpdate = gql`
  mutation UPDATE_CATEGORY_MUTATION($id: ID!, $name: String, $description: String) {
    UPDATE_CATEGORY_MUTATION(id: $id, name: $name, description: $description) {
      __typename
      id
    }
  }`;

const categoryUpdateOptions = {
  props: ({ mutate }) => ({
    handleCategoryUpdate: (category, id) => {
      const {
        name: { inputRef: { value: name } },
        name: { inputRef: { value: description } }
      } = category;

      return (
        mutate({
          variables: {
            id: `categories: ${id}`,
            name,
            description
          },
          optimisticResponse: {
            __typename: "Mutation",
            category: {
              __typename: "Category",
              id,
              name,
              description
            }
          }
        })
      );
    }
  })
};

export default compose(
  graphql(CategoriesQuery, queryOptions),
  connect(
    (state) => mapStateToTabsProps(state),
    (dispatch) => mapDispatchToTabsProps(dispatch)),
  graphql(categoryCreate, categoryCreateOptions),
  graphql(categoryDelete, categoryDeleteOptions),
  graphql(categoryUpdate, categoryUpdateOptions)
)(Categories);
