const {
  GraphQLString,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLList,
  GraphQLID,
  GraphQLBoolean,
  GraphQLInt,
  GraphQLInterfaceType
} = require('graphql');

const getActivitiesPage = require('./loaders/activities').getActivitiesPage;
const { dbIdToNodeId } = require('./loaders/utils');
const { getNodeById } = require('./loaders/nodeLoaders');

let CategoryType, ActivityType;

const CategoryInterface = new GraphQLInterfaceType({
  name: 'CategoryInterface',
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLID)
    }
  },
  resolveType: ({ __tableName }) => {
    if (__tableName === "categories") {
      return CategoryType;
    }
    return ActivityType;
  }
});

ActivityType = new GraphQLObjectType({
  name: 'Activity',
  interfaces: [ CategoryInterface ],
  fields: () => {
    return {
      id: {
        type: new GraphQLNonNull(GraphQLID),
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
  }
});

const CategoryListInfoType = new GraphQLObjectType({
  name: 'CategoryListInfo',
  fields: () => {
    return {
      hasNextPage: {
        type: new GraphQLNonNull(GraphQLBoolean)
      },
      hasPreviousPage: {
        type: new GraphQLNonNull(GraphQLBoolean)
      },
      startCursor: {
        type: GraphQLString,
      },
      endCursor: {
        type: GraphQLString,
      }
    }
  }
});

const ActivityEdgeType = new GraphQLObjectType({
  name: 'ActivityEdge',
  fields: () => {
    return {
      cursor: {
        type: new GraphQLNonNull(GraphQLString)
      },
      node: {
        type: new GraphQLNonNull(ActivityType)
      }
    }
  }
});

const ActivitiesConnectionType = new GraphQLObjectType({
  name: 'ActivitiesConnection',
  fields: () => {
    return {
      pageInfo: {
        type: new GraphQLNonNull(CategoryListInfoType)
      },
      edges: {
        type: new GraphQLList(ActivityEdgeType)
      }
    }
  }
});

const activityEdges = (rows) => {
  return rows.map((row) => {
    const nodeId = dbIdToNodeId(row.id, row.__tableName);

    return getNodeById(nodeId).then((node) => {
      return {
        node,
        cursor: row.__cursor,
      };
    });
  });
};

CategoryType = new GraphQLObjectType({
  name: 'Category',
  interfaces: [ CategoryInterface ],
  fields: () => {
    return {
      id: {
        type: new GraphQLNonNull(GraphQLID),
        resolve({ __tableName, id }) {
          return dbIdToNodeId(id, __tableName);
        }
      },
      name: {
        type: new GraphQLNonNull(GraphQLString)
      },
      description: {
        type: GraphQLString
      },
      createdAt: {
        type: GraphQLString
      },
      activitiesPage: {
        type: ActivitiesConnectionType,
        args: {
          before: {
            type: GraphQLString
          },
          after: {
            type: GraphQLString
          },
          first: {
            type: new GraphQLNonNull(GraphQLInt)
          }
        },
        resolve(source, args) {
          return getActivitiesPage(source, args).then(({ rows, pageInfo }) => (
            Promise.all(activityEdges(rows)).then((edges) => ({
              edges,
              pageInfo
            }))
          ))
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
        type: new GraphQLNonNull(GraphQLString)
      },
      description: {
        type: GraphQLString
      },
      createdAt: {
        type: GraphQLString
      }
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
  ActivityType,
  ActivityEdgeType,
  CategoryWithoutInterfaceType,
  CategoryListInfoType,
  ActivitiesConnectionType
};
