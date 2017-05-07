const sqlite3 = require('sqlite3').cached;
const db = new sqlite3.Database('./db.sqlite');

function getSql (query)  {
  return new Promise(function(resolve, reject) {
    db.all(query.text, query.values, function (err, rows) {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

module.exports = {
  db,
  getSql
};



