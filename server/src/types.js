"use strict";
const GraphQLString = require('graphql').GraphQLString;
const GraphQLObjectType = require('graphql').GraphQLObjectType;
const GraphQLNonNull = require('graphql').GraphQLNonNull;
const GraphQLList = require('graphql').GraphQLList;
const GraphQLID = require('graphql').GraphQLID;
const GraphQLInterfaceType = require('graphql').GraphQLInterfaceType;

const loaders = require('./loaders');
const tables = require('./tables');

let CategoryType, ActivitiesType;

const CategoryInterface = new GraphQLInterfaceType({
  name: 'CategoryInterface',
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLID)
    }
  },
  resolveType: (source) => {
    if (source.__tableName === "categories") {
      return CategoryType;
    } else if (source.__tableName === "activities") {
      return ActivitiesType;
    } else if (source.__tableName === "activity") {
      return ActivitiesType;
    }
  }
});

ActivitiesType = new GraphQLObjectType({
  name: 'Activity',
  interfaces: [CategoryInterface],
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    name: {
      type: new GraphQLNonNull(GraphQLString)
    },
    categoryId: {
      type: new GraphQLNonNull(GraphQLID)
    },
    createdAt: {
      type: new GraphQLNonNull(GraphQLString)
    },
    date: {
      type: GraphQLString
    },
    about: {
      type: GraphQLString
    },
    location: {
      type: GraphQLString
    }
  }
});

CategoryType = new GraphQLObjectType({
  name: 'Category',
  interfaces: [CategoryInterface],
  fields: () => {
    return {
      id: {
        type: new GraphQLNonNull(GraphQLID),
        resolve(source) {
          return `${source.__tableName}: ${source.id}`;
        }
      },
      name: {
        type: new GraphQLNonNull(GraphQLString)
      },
      description: {
        type: GraphQLString
      },
      activities: {
        type: new GraphQLList(ActivitiesType),
        resolve(source) {
          return loaders.getActivities(source);
        }
      }
    }
  }
});

const CategoryWithoutInterfaceType = new GraphQLObjectType({
  name: 'CategoryWithoutInterface',
  fields: () => {
    return {
      id: {
        type: new GraphQLNonNull(GraphQLID)
      },
      name: {
        type: new GraphQLNonNull(GraphQLID)
      },
      description: {
        type: GraphQLString
      },
    }
  }
});

const CategoriesType = new GraphQLObjectType({
  name: 'Categories',
  fields: () => {
    return {
      categories: {
        type: new GraphQLList(CategoryWithoutInterfaceType)
      }
    }
  }
});

module.exports = {
  CategoryType,
  CategoriesType,
  CategoryInterface,
  ActivitiesType
};
