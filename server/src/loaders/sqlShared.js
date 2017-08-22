const database = require('../database');

const { clearCacheById } = require('./nodeLoaders');

const {
  dbIdNodeId,
  setProperties,
  dbIdToNodeId
} = require('./utils');

const deleteRow = (data) => {
  const [ table, id ] = dbIdNodeId(data.id);
  const query = { text: `delete from ${table} where id = ${id};` };

  return database.getSql(query).then(() => {
    clearCacheById(data.id);

    return data;
  }).catch(error => error)
};

const updateQuery = (table, id, data) => {
  let query = `update ${table} set `;
  const rowKeys = Object.keys(data);
  for (const key of rowKeys) {
    const lastField = rowKeys[ rowKeys.length - 1 ] === key;
    query = query.concat(`${key} = "${data[ key ]}"${lastField ? '' : ', '}`);
  }

  return query.concat(` where id = ${id};`);
};

const updateRow = (data) => {
  const row = setProperties(data, [ 'id' ]);
  const [ table, id ] = dbIdNodeId(data.id);
  const query = { text: updateQuery(table, id, row) };

  return database.getSql(query).then(() => (
    clearCacheById(data.id)
  )).catch(error => ({ error }))
};

const insertRow = (table, query) => {
  return database.getSql(query).then(() => {
    return database.getSql({
      text: `SELECT last_insert_rowid() AS id FROM ${table} LIMIT 1`
    });
  }).then((ids) => {

    return dbIdToNodeId(ids[ 0 ].id, table);
  }).catch(error => ({ error }))
};

module.exports = {
  updateRow,
  deleteRow,
  updateQuery,
  insertRow
};
