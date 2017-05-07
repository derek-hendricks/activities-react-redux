const project = require('../config/project.config');
const server = require('../server/main');
const sqlite = require('sqlite');

const sqlite3 = require('sqlite3').cached;
const db = new sqlite3.Database('./db.sqlite');


if ("development" === project.env) {
  server.listen(project.server_port);
  const debug = require('debug')('app:bin:dev-server');
  debug(`Server is now running at http://localhost:${project.server_port}.`)
} else {
  server.listen(project.server_port);
  // sqlite.open('../server/src/db.sqlite', { Promise }).then(function () {
  //   server.listen(project.server_port, () => {
  //     console.log(`listening on project.server_port`);
  //   });
  // }).catch(function (err) {
  //   console.log(err)
  // });

}


