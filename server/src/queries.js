const {
  GraphQLNonNull,
  GraphQLID
} = require('graphql');

const {
  CategoriesType,
  CategoryInterface
} = require('./types');

const { getNodeById } = require('./loaders/nodeLoaders');
const { getCategories } = require('./loaders/categories');

const categoryList = {
  type: CategoriesType,
  resolve() {
    return getCategories();
  }
};

const categoryInterface = {
  type: CategoryInterface,
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLID)
    }
  },
  resolve(_, args) {
    return getNodeById(args.id);
  }
};

module.exports = {
  categoryList,
  categoryInterface
};

