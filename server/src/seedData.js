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
  const promises = [tables.categories, tables.activities].map(function (table) {
    return function () {
      return database.getSql(table.create().toQuery());
    };
  });

  return sequencePromises(promises);
}

function insertData() {
  const queries = [
    tables.categories.insert(data.categories).toQuery(),
    tables.activities.insert(data.activities).toQuery()
  ];

  const promises = queries.map(function (query) {
    return function () {
      return database.getSql(query);
    };
  });

  return sequencePromises(promises);
}

createDatabase().then(function () {
  return insertData();
}).then(function () {
  console.log({ done: true });
});
