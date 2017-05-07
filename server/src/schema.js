const GraphQLSchema = require('graphql').GraphQLSchema;
const GraphQLObjectType = require('graphql').GraphQLObjectType;

const types = require('./types');
const queries = require('./queries');
const mutations = require('./mutations');

const RootQuery = new GraphQLObjectType({
  name: 'RootQuery',
  description: 'The root query',
  fields: {
    categoryList: queries.categoryList,
    categoryInterface: queries.categoryInterface
  }
});

const RootMutation = new GraphQLObjectType({
  name: 'RootMutation',
  description: 'Activity Root Mutation',
  fields: {
    CREATE_ACTIVITY_MUTATION: mutations.createActivity,
    CREATE_CATEGORY_MUTATION: mutations.createCategory,
    UPDATE_ACTIVITY_MUTATION: mutations.updateActivity,
    UPDATE_CATEGORY_MUTATION: mutations.updateCategory,
    DELETE_ACTIVITY_MUTATION: mutations.deleteActivity,
    DELETE_CATEGORY_MUTATION: mutations.deleteCategory
  }
});

const schema = new GraphQLSchema({
  types: [
    types.CategoriesType,
    types.CategoryType,
    types.CategoryInterface,
    types.ActivitiesType
  ],
  query: RootQuery,
  mutation: RootMutation
});

module.exports = schema;
