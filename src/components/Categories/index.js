import React from "react"
import Link from "react-router/Link"
import {Loader} from "semantic-ui-react"
import "./styles.scss"
import CategoryForm from "../CategoryForm"
import CategoryButtons from "../CategoryButtons"
import DeleteModal from "../DeleteModal"

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
    return (<p>Error</p>);
  } else {

    return (
      <div>
        <nav className='categories'>
          {categories.map((category, index) => (
            <Link key={index} to='/activities'>
              <div
                key={index}
                className={category.active ? 'active item' : 'item'}
                onClick={() => onCategorySelect(category.id)}
              >
                {category.name}
              </div>
            </Link>
          ))}
        </nav>

        <div className="ui segment category actions">
          <CategoryButtons setAction={(method) => {
            return onCategoryActionSet(method);
          }}/>

          <div className={actions.categoriesAction === 'add' ? 'add active' : 'add inactive'}>
            <CategoryForm type="create" onSubmit={(category) => {
              return handleCategoryCreate(category);
            }}/>
          </div>

          <div className={actions.categoriesAction === 'edit' ? 'edit active' : 'edit inactive'}>
            <CategoryForm category={category} type="edit" onSubmit={(category, id) => {
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
