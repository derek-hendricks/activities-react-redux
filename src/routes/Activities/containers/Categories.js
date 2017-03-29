import { connect } from 'react-redux'
import { openCategory } from '../../../store/activeCategory'
import Categories from '../components/Categories/index'
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

const initialState = { categories: [] };

const mapStateToTabsProps = (state = initialState) => {
  const categories = state.categories.slice().map((category) => ({
    ...category,
    active: category.id === state.activeCategoryId
  }));

  return (
    {
      categories: [
        ...initialState.categories,
        ...categories
      ]
    }
  )
};

const mapDispatchToTabsProps = (dispatch) => (
  {
    onClick: (id) => (
      dispatch(openCategory(id))
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

const CategoriesQuery = gql`
  query CategoriesQuery {
    categoryList {
      categories {
        id
        description
        name
      }
    }
  }`;

export default compose(
  graphql(CategoriesQuery, queryOptions),
  connect(
    (state) => mapStateToTabsProps(state),
    (dispatch) => mapDispatchToTabsProps(dispatch))
)(Categories);
