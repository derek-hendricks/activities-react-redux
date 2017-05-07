const project = require('../config/project.config');
const server = require('../server/main');



if ("development" === project.env) {
  server.listen(project.server_port);
  const debug = require('debug')('app:bin:dev-server');
  debug(`Server is now running at http://localhost:${project.server_port}.`)
}


