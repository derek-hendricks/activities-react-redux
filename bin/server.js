const project = require('../config/project.config');
const server = require('../server/main');

const port = project.server_port;
const server_host = project.server_host;

server.app.listen(port);

if ("development" === project.env) {
  const debug = require('debug')('app:bin:dev-server');

  server.developmentSetup();
  debug(`Server is now running at ${server_host}:${port}.`);
} else {

  server.productionSetup();
}
