"use strict";
const express = require('express');
const bodyParser = require('body-parser');
const debug = require('debug')('app:server');
const path = require('path');
const webpack = require('webpack');
const webpackConfig = require('../config/webpack.config');
const project = require('../config/project.config');
const compress = require('compression');
const cors = require('cors');
const graphqlHTTP = require('express-graphql');
const methodOverride = require('method-override');

const app = express();

const schema = require('./src/schema').Schema;

app.use(compress());

app.use('/graphql', cors(), graphqlHTTP(() => ({
  schema,
  graphiql: "development" === project.env
})));

if ("development" === project.env) {
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

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

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

  app.use(express.static(project.paths.dist()));

  app.use(express.static(project.paths.public()));

  app.use(methodOverride());

  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render("error", {
      message: err.message,
      error: err
    });
  });

  app.set("view cache", true);
  app.set("x-powered-by", false);

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json({ type: "application/json" }));

  app.get("*", (req, res) => {
    res.sendFile(path.join(`${project.paths.dist()}/index.html`));
  });
}

module.exports = app;
