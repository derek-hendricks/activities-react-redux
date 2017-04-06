"use strict";
const express = require('express');
const debug = require('debug')('app:server');
const path = require('path');
const webpack = require('webpack');
const webpackConfig = require('../config/webpack.config');
const project = require('../config/project.config');
const compress = require('compression');
const cors = require('cors');

const graphqlHTTP = require('express-graphql');
const GraphQLSchema = require('graphql').GraphQLSchema;
const GraphQLObjectType = require('graphql').GraphQLObjectType;
const GraphQLNonNull = require('graphql').GraphQLNonNull;
const GraphQLID = require('graphql').GraphQLID;
const GraphQLString = require('graphql').GraphQLString;

const types = require('./src/types');
const loaders = require('./src/loaders');

const app = express();
app.use(compress());

const RootQuery = new GraphQLObjectType({
  name: 'RootQuery',
  description: 'The root query',
  fields: {
    categoryList: {
      type: types.CategoriesType,
      resolve() {
        return loaders.getCategories();
      }
    },
    categoryInterface: {
      type: types.CategoryInterface,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID)
        }
      },
      resolve(source, args) {
        return loaders.getNodeById(args.id);
      }
    }
  }
});

const RootMutation = new GraphQLObjectType({
  name: 'RootMutation',
  description: 'Activity Root Mutation',
  fields: {
    createActivity: {
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
      resolve(source, args, context) {
        return loaders.createActivity(args, context).then((result) => {
          return loaders.nodeLoaders[result.table].load(result.id);
        });
      }
    },
    deleteActivity: {
      type: types.ActivityType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID)
        }
      },
      resolve(source, args) {
        return loaders.deleteRow(args);
      }
    },
    UPDATE_ACTIVITY_MUTATION: {
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
      resolve(source, args, context) {
        return loaders.updateRow(args, context).then(() => {
          return loaders.getNodeById(args.id);
        })
      }
    }
  }
});

const Schema = new GraphQLSchema({
  types: [types.CategoriesType, types.CategoryType, types.CategoryInterface, types.ActivityType],
  query: RootQuery,
  mutation: RootMutation
});

app.use('/graphql', cors(), graphqlHTTP(() => ({
  schema: Schema,
  graphiql: true
})));

if (project.env === 'development') {
  const compiler = webpack(webpackConfig);

  debug('Enabling webpack dev and HMR middleware');
  app.use(require('webpack-dev-middleware')(compiler, {
    publicPath: webpackConfig.output.publicPath,
    contentBase: project.paths.client(),
    hot: true,
    quiet: project.compiler_quiet,
    noInfo: project.compiler_quiet,
    lazy: false,
    stats: project.compiler_stats
  }));

  app.use(require('webpack-hot-middleware')(compiler, {
    path: '/__webpack_hmr'
  }));

  app.use(express.static(project.paths.public()));

  app.use('*', function (req, res, next) {
    const filename = path.join(compiler.outputPath, 'index.html');
    compiler.outputFileSystem.readFile(filename, (err, result) => {
      if (err) {
        return next(err)
      }
      res.set("content-type", "text/html");
      res.send(result);
      res.end()
    })
  })
} else {
  app.use(express.static(project.paths.dist()))
}

module.exports = app;
