import { connect } from 'react-redux'
import { openCategory } from '../../../store/activeCategory'
import Categories from '../components/Categories'

const mapStateToTabsProps = (state) => {
  const categories = state.categories.map((category) => (
    {
      name: category.name,
      active: category.id === state.activeCategoryId,
      id: category.id,
    }
  ));

  return {
    categories
  };
};

const mapDispatchToTabsProps = (dispatch) => (
  {
    onClick: (id) => (
      dispatch(openCategory(id))
    )
  }
);

export default connect(
  mapStateToTabsProps,
  mapDispatchToTabsProps,
)(Categories);
