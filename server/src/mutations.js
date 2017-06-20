const GraphQLNonNull = require('graphql').GraphQLNonNull;
const GraphQLID = require('graphql').GraphQLID;
const GraphQLString = require('graphql').GraphQLString;

const types = require('./types');
const loaders = require('./loaders');

const createActivity = {
  type: types.ActivityType,
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
    return loaders.createActivity(args).then((nodeId) => {
      return loaders.getNodeById(nodeId);
    });
  }
};

const createCategory = {
  type: types.CategoryType,
  args: {
    name: {
      type: new GraphQLNonNull(GraphQLString)
    },
    description: {
      type: GraphQLString
    }
  },
  resolve(_, args) {
    return loaders.createCategory(args).then((nodeId) => {
      return loaders.getNodeById(nodeId);
    });
  }
};

const updateCategory = {
  type: types.CategoryType,
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
    return loaders.updateRow(args).then((result) => {
      if (result.error) {
        return result.error
      }
      return (
        loaders.getNodeById(args.id)
      )
    })
  }
};

const deleteCategory = {
  type: types.CategoryType,
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    activities: {
      type: GraphQLString
    }
  },
  resolve(_, args) {
    if (!args.activities) {
      return loaders.deleteCategory(args)
    } else {
      return loaders.deleteCategory(args).then(() => {
        return loaders.deleteCategoryActivities(args)
      })
    }
  }
};

const deleteActivity = {
  type: types.ActivityType,
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLID)
    }
  },
  resolve(_, args) {
    return loaders.deleteRow(args);
  }
};

const updateActivity = {
  type: types.ActivityType,
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
    return loaders.updateRow(args).then(() => {
      return loaders.getNodeById(args.id);
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
