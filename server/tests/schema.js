"use strict";
const faker = require('faker');
const graphqlTools = require('graphql-tools');

const schemaString = `
  schema {
    query: RootQuery
    mutation: Mutation
  }
  
  type RootQuery {
    categoryList: Categories
    categoryInterface(id: ID!): CategoryInterface
  }
  
  type Activity implements CategoryInterface {
    id: ID!
    name: String!
    categoryId: ID!
    createdAt: String!
    date: String
    about: String
    location: String
  }

  type Category implements CategoryInterface {
    id: ID!
    name: String!
    description: String
    createdAt: String
    activities: [Activity]
  }

  interface CategoryInterface {
    id: ID!
  }

  type CategoryWithoutInterface {
    id: ID!
    name: String!
    description: String
    createdAt: String
  }

  type Categories {
    categories: [CategoryWithoutInterface]
  }
    
  type Mutation {
    CREATE_ACTIVITY_MUTATION(
      name: String!
      categoryId: String!
      about: String
      location: String
      date: String
    ): Activity
  
    CREATE_CATEGORY_MUTATION(
      name: String! 
      description: String
    ): Category
  
    UPDATE_ACTIVITY_MUTATION(
      id: ID!
      name: String
      categoryId: String
      about: String
      location: String
      date: String
    ): Activity
  
    UPDATE_CATEGORY_MUTATION(
      id: ID!
      name: String
      description: String
    ): Category
  
    DELETE_ACTIVITY_MUTATION(
      id: ID!
    ): Activity
    
    DELETE_CATEGORY_MUTATION(
      id: ID! 
      activities: String
    ): Category
  }
`;

const schema = graphqlTools.makeExecutableSchema({ typeDefs: schemaString });

module.exports = schema;
