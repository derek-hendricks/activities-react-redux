const project = require('../config/project.config');
const server = require('../server/main');

server.listen(project.server_port);

if ("development" === project.env) {
  const debug = require('debug')('app:bin:dev-server');
  debug(`Server is now running at http://localhost:${project.server_port}.`)
}


