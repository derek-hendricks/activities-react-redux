const DataLoader = require('dataloader');
const database = require('../database');
const tables = require('../tables');

const { dbIdNodeId } = require('./utils');

const createNodeLoader = (table) => {
  return new DataLoader((ids) => {
    const query = table
      .select(table.star())
      .where(table.id.in(ids))
      .order(table.id.desc)
      .toQuery();

    return database.getSql(query).then((rows) => (
      ids.map((id) => (
        rows.find((row) => {
          row.__tableName = table.getName();
          return id === String(row.id);
        })
      ))
    )).catch(error => ({ error }))
  })
};

const nodeLoaders = {
  categories: createNodeLoader(tables.categories),
  activities: createNodeLoader(tables.activities),
};

const getNodeById = (data) => {
  const [ table, id ] = dbIdNodeId(data);
  return nodeLoaders[ table ].load(id).catch((error) => {
    nodeLoaders[ table ].clear(id);
    throw error;
  });
};

const clearCacheById = (data) => {
  const [ table, id ] = dbIdNodeId(data);
  return nodeLoaders[ table ].clear(id);
};

const clearTableCache = (table) => {
  return nodeLoaders[ table ].clearAll();
};

module.exports = {
  getNodeById,
  nodeLoaders,
  clearCacheById,
  clearTableCache
};
