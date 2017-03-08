const GraphQLString = require('graphql').GraphQLString;
const GraphQLObjectType = require('graphql').GraphQLObjectType;
const GraphQLNonNull = require('graphql').GraphQLNonNull;
const GraphQLList = require('graphql').GraphQLList;

const loaders = require('./loaders');
const tables = require('./tables');

const CategoryType = new GraphQLObjectType({
  name: 'Category',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLString)
    },
    description: {
      type: new GraphQLNonNull(GraphQLString)
    },
    name: {
      type: new GraphQLNonNull(GraphQLString)
    }

  })
});

const CategoriesType = new GraphQLObjectType({
  name: 'Categories',
  fields: () => {
    return {
      categories: {type: new GraphQLList(CategoryType)}
    }
  },
  resolve: () => {
    const promise = loaders.getCategories();
    return Promise(promise);
  }
});

module.exports = {
  CategoryType: CategoryType,
  CategoriesType: CategoriesType
};
