import {connect} from 'react-redux'
import {deleteActivity, modifyActivity} from '../../../store/activities'
import Activity from '../components/Activity/index'

const mapStateToActivityProps = (state, ownProps) => {
  const category = state.categories[state.categories.findIndex(
    (category) => category.id === state.activeCategoryId
  )];
  const activity = category.activities[category.activities.findIndex(
    (activity) => activity.id === ownProps.id
  )];
  return (
    {
      activity
    }
  );
};

const mapDispatchToActivityProps = (dispatch) => {
  return (
    {
      onDeleteClick: (id) => (
        dispatch(deleteActivity(id))
      ),
      dispatch
    }
  );
};

const mergeActivityProps = (stateProps, dispatchProps) => {
  return (
    {
      ...stateProps,
      ...dispatchProps,
      onModifyClick: (text) => {
        return (
          dispatchProps.dispatch(
            modifyActivity(stateProps.activity.id, text)
          )
        );
      },
    }
  );
};

export default connect(
  mapStateToActivityProps,
  mapDispatchToActivityProps,
  mergeActivityProps
)(Activity);
