const GraphQLNonNull = require('graphql').GraphQLNonNull;
const GraphQLID = require('graphql').GraphQLID;

const types = require('./types');
const loaders = require('./loaders');

const categoryList = {
  type: types.CategoriesType,
  resolve() {
    return loaders.getCategories();
  }
};

const categoryInterface = {
  type: types.CategoryInterface,
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLID)
    }
  },
  resolve(_, args) {
    return loaders.getNodeById(args.id);
  }
};

module.exports = {
  categoryList,
  categoryInterface
};

