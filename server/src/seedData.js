const data = require('./data');
const tables = require('./tables');
const database = require('./database');

function sequencePromises(promises) {
  return promises.reduce((promise, promiseFunction) => {
    return promise.then(() => {
      return promiseFunction();
    });
  }, Promise.resolve());
}

function createDatabase() {
  const dataList = [ tables.categories, tables.activities ];
  const promises = dataList.map((table) => {
    return () => {
      const query = table.create().toQuery();

      return database.getSql(query);
    };
  });

  return sequencePromises(promises);
}

function insertData() {
  const queries = [
    tables.categories.insert(data.categories).toQuery(),
    tables.activities.insert(data.activities).toQuery()
  ];

  const promises = queries.map((query) => {
    return () => {
      return database.getSql(query);
    };
  });

  return sequencePromises(promises);
}

createDatabase().then(function () {
  return insertData();
}).then(() => {
  console.log({ created: true })
}).catch((error) => {
  console.log({ error });
});
