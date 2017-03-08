const express = require('express');
const debug = require('debug')('app:server');
const path = require('path');
const webpack = require('webpack');
const webpackConfig = require('../config/webpack.config');
const project = require('../config/project.config');
const compress = require('compression');
const app = express();
const cors = require('cors');
const graphqlHTTP = require('express-graphql');
const GraphQLSchema = require('graphql').GraphQLSchema;
const GraphQLObjectType =  require('graphql').GraphQLObjectType;

app.use(compress());

const CategoriesType = require('./src/types').CategoriesType;
const CategoryType = require('./src/types').CategoryType;
const loaders = require('./src/loaders');

const RootQuery = new GraphQLObjectType({
  name: 'RootQuery',
  description: 'The root query',
  fields: {
    categoryList: {
      type: CategoriesType,
      resolve(source, args, context, info) {
        return loaders.getCategories();
      }
    }
  }
});

const Schema = new GraphQLSchema({
  types: [CategoriesType, CategoryType],
  query: RootQuery
});

app.use('/graphql', cors(), graphqlHTTP(() => ({
  schema: Schema,
  graphiql: true
})));

if (project.env === 'development') {
  const compiler = webpack(webpackConfig);

  debug('Enabling webpack dev and HMR middleware');
  app.use(require('webpack-dev-middleware')(compiler, {
    publicPath  : webpackConfig.output.publicPath,
    contentBase : project.paths.client(),
    hot         : true,
    quiet       : project.compiler_quiet,
    noInfo      : project.compiler_quiet,
    lazy        : false,
    stats       : project.compiler_stats
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
      res.set('content-type', 'text/html');
      res.send(result);
      res.end()
    })
  })
} else {
  app.use(express.static(project.paths.dist()))
}

module.exports = app;
