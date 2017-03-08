'use strict';
const data = require('./data');
const tables = require('./tables');
const database = require('./database');

function sequencePromises(promises) {
  return promises.reduce(function (promise, promiseFunction) {
    return promise.then(function () {
      return promiseFunction();
    });
  }, Promise.resolve());
}

function createDatabase() {
  let promises = [tables.categories].map(function (table) {
    return function () {
      return database.getSql(table.create().toQuery());
    };
  });

  return sequencePromises(promises);
}

function insertData() {
  let categories = data.categories;
  let queries = [tables.categories.insert(categories).toQuery()];

  let promises = queries.map(function (query) {
    return function () {
      return database.getSql(query);
    };
  });

  return sequencePromises(promises);
}

createDatabase().then(function () {
  return insertData();
}).then(function () {
  console.log({done: true});
});
