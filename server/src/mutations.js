const {
  GraphQLString,
  GraphQLNonNull,
  GraphQLID
} = require('graphql');

const { getNodeById } = require('./loaders/nodeLoaders');
const { updateRow } = require('./loaders/sqlShared');

const {
  ActivityType,
  CategoryType
} = require('./types');

const {
  createActivity: activityCreate,
  deleteActivity: activityDelete
} = require('./loaders/activities');

const {
  createCategory: categoryCreate,
  deleteCategory: categoryDelete
} = require('./loaders/categories');

const createActivity = {
  type: ActivityType,
  args: {
    name: {
      type: new GraphQLNonNull(GraphQLString)
    },
    categoryId: {
      type: new GraphQLNonNull(GraphQLString)
    },
    about: {
      type: GraphQLString
    },
    location: {
      type: GraphQLString
    },
    date: {
      type: GraphQLString
    }
  },
  resolve(_, args) {
    return activityCreate(args).then((nodeId) => {
      return getNodeById(nodeId);
    });
  }
};

const createCategory = {
  type: CategoryType,
  args: {
    name: {
      type: new GraphQLNonNull(GraphQLString)
    },
    description: {
      type: GraphQLString
    }
  },
  resolve(_, args) {
    return categoryCreate(args).then((nodeId) => {
      return getNodeById(nodeId);
    });
  }
};

const updateCategory = {
  type: CategoryType,
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    name: {
      type: GraphQLString
    },
    description: {
      type: GraphQLString
    }
  },
  resolve(_, args) {
    return updateRow(args).then((result) => {
      if (result.error) {
        return result.error
      }
      return getNodeById(args.id)
    })
  }
};

const deleteCategory = {
  type: CategoryType,
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    activityIds: {
      type: GraphQLString
    }
  },
  resolve(_, args) {
    return categoryDelete(args);
  }
};

const deleteActivity = {
  type: CategoryType,
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
    },
    categoryId: {
      type: new GraphQLNonNull(GraphQLID)
    }
  },
  resolve(_, args) {
    return activityDelete(args).then(() => {
      return getNodeById(args.categoryId);
    })
  }
};

const updateActivity = {
  type: ActivityType,
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    name: {
      type: GraphQLString
    },
    categoryId: {
      type: GraphQLString
    },
    about: {
      type: GraphQLString
    },
    location: {
      type: GraphQLString
    },
    date: {
      type: GraphQLString
    }
  },
  resolve(_, args) {
    return updateRow(args).then(() => {
      return getNodeById(args.id);
    })
  }
};

module.exports = {
  createActivity,
  createCategory,
  updateCategory,
  deleteCategory,
  deleteActivity,
  updateActivity
};
