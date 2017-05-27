import React from 'react'
import Link from 'react-router/Link'
import {
  Loader,
  Popup,
  Button
} from 'semantic-ui-react';

import './styles.scss'
import CategoryForm from '../CategoryForm'
import CategoryButtons from '../CategoryButtons'
import DeleteModal from '../DeleteModal'
import LoadError from '../LoadError'

export const Categories = (props) => {
  const {
    loading, error, actions, category,
    categories = [], onCategorySelect, onCategoryActionSet,
    handleCategoryCreate, handleCategoryUpdate, onCategoryDelete
  } = props;

  if (loading) {
    return (
      <div>
        <Loader active size='mini'>
          Categories Loading
        </Loader>
      </div>)
  } else if (error) {
    return (
      <LoadError
        className={"categories"}
        errorText={"Error loading categories"}
        inverted={true}
      />
    );
  } else {

    return (
      <div className="categories">
        <div className="ui top attached menu">

          <div className={'left menu'}>
            {categories.map((category, index) => (
              <Link key={index} to='/activities' className={category.active ? 'ui active item' : 'ui item'}
                    onClick={() => onCategorySelect(category.id)}>
                {category.name}
              </Link>
            ))}

          </div>
          <div className="labeled icon right menu">
            <div className="item edit-delete">
              <CategoryButtons setAction={(method) => {
                return onCategoryActionSet(method);
              }}/>
            </div>
            <div className="ui item create-category">
              <Popup content='Create New Category' size='small' trigger={
                <Button onClick={() => onCategoryActionSet('add')}>
                  <i className="add circle icon"/>
                  Create
                </Button>
              }/>
            </div>
          </div>
        </div>

        <div className={actions.categoriesAction === 'add' ? 'add active ui segment category actions' : 'add inactive'}>
          <CategoryForm type="create" onSubmit={(category) => {
            onCategoryActionSet(false);
            return handleCategoryCreate(category);
          }}/>
        </div>

        <div
          className={actions.categoriesAction === 'edit' ? 'edit active ui segment category actions' : 'edit inactive'}>
          <CategoryForm category={category} type="edit" onSubmit={(category, id) => {
            onCategoryActionSet(false);
            return handleCategoryUpdate(category, id);
          }}/>
        </div>

        <DeleteModal
          open={actions.categoriesAction === 'remove'}
          category={category}
          onClose={() => onCategoryActionSet(false)}
          onDelete={(id, activities) => {
            onCategoryActionSet({ action: 'CATEGORY_REMOVED', id, categories });
            return onCategoryDelete(id, activities);
          }}>
        </DeleteModal>
      </div>
    );
  }
};

Categories.propTypes = {
  onCategorySelect: React.PropTypes.func.isRequired,
  categories: React.PropTypes.arrayOf(React.PropTypes.object),
  loading: React.PropTypes.bool.isRequired,
  error: React.PropTypes.bool.isRequired,
  actions: React.PropTypes.object.isRequired,
  category: React.PropTypes.object,
  handleCategoryCreate: React.PropTypes.func.isRequired,
  onCategoryDelete: React.PropTypes.func.isRequired,
  onCategoryActionSet: React.PropTypes.func.isRequired,
  handleCategoryUpdate: React.PropTypes.func.isRequired
};

export default Categories
