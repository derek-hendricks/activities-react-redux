import { connect } from 'react-redux'
import { addActivity } from '../../../store/activities'
import Category from '../components/Category'

const mapStateToCategoryProps = (state) => {
  return (
    {
      category: state.categories.find((category) => {
        return category.id === state.activeCategoryId;
      })
    }
  );
};

const mapDispatchToCategoryProps = (dispatch) => (
  {
    dispatch
  }
);

const mergeCategoryProps = (stateProps, dispatchProps) => {
  return (
    {
      ...stateProps,
      ...dispatchProps,
      onActivitySubmit: (text) => (
        dispatchProps.dispatch(
          addActivity(stateProps.category.id, text)
        )
      )
    }
  );
};

export default connect(
  mapStateToCategoryProps,
  mapDispatchToCategoryProps,
  mergeCategoryProps
)(Category);
