"use strict";
const DataLoader = require('dataloader');
const database = require('./database');
const tables = require('./tables');

const createNodeLoader = (table) => {
  return new DataLoader((ids) => {
    const query = table.select(table.star()).where(table.id.in(ids)).toQuery();

    return database.getSql(query).then((rows) => {
      rows.forEach((row) => {
        row.__tableName = table.getName();
      });
      return rows;
    }).catch(error => error)
  });
};

const nodeLoaders = {
  categories: createNodeLoader(tables.categories),
  activities: createNodeLoader(tables.activities),
};

const dbIdToNodeId = (dbId, tableName) => {
  return `${tableName}:${dbId}`;
};

const dbIdNodeId = (data) => {
  return data.replace(/ /g, '').split(':');
};

const getNodeById = (data) => {
  const nodeId = dbIdNodeId(data);
  return nodeLoaders[nodeId[0]].load(nodeId[1]);
};

const clearCacheById = (data) => {
  const nodeId = dbIdNodeId(data);
  return nodeLoaders[nodeId[0]].clear(nodeId[1]);
};

const setProperties = (obj, property) => {
  const keys = Object.keys(obj);
  const data = {};
  for (const key of keys) {
    const keyIsProperty = key === property;
    const valueIsNotUpdated = !obj[key].trim();
    const doesNotHaveProperty = !Object.prototype.hasOwnProperty.call(obj, property);
    if (keyIsProperty || valueIsNotUpdated || doesNotHaveProperty) {
      continue;
    }
    data[key] = obj[key];
  }

  return data;
};

const getCategories = () => {
  const table = tables.categories;
  const query = tables.categories.select(table.star()).toQuery();

  return database.getSql(query).then((rows) => ({
    categories: rows.map((row) => ({
      id: row.id,
      name: row.name,
      description: row.description
    }))
  }));
};

const getActivities = (source) => {
  const table = tables.activities;
  const query = table.select(table.star()).from(table).where(table.categoryId.equals(source.id)).order(table.createdAt.desc).toQuery();

  return database.getSql(query).then((rows) => (
    rows.map((row) => ({
      id: row.id,
      name: row.name,
      about: row.about,
      categoryId: row.categoryId,
      createdAt: row.createdAt,
      date: row.date,
      location: row.location,
      __tableName: table.getName()
    }))
  ));
};

const deleteCategory = (data) => {
  const table = tables.categories;
  const db = dbIdNodeId(data.id);
  const query = { text: `delete from ${db[0]} where id = ${db[1]};` };

  return database.getSql(query).then(() => {
    return {
      id: data.id,
      __tableName: table.getName(),
      __typename: "categories"
    }
  })
};

const deleteRow = (data) => {
  const db = data.id.split(":");
  const query = { text: `delete from ${db[0]} where id = ${db[1]};` };

  return database.getSql(query).then((res) => {
    clearCacheById(data.id);
    return data;
  }).catch(error => error)
};

const deleteActivity = (data) => {
  const table = tables.activities;
  const db = dbIdNodeId(data.id);
  const query = { text: `delete from ${db[0]} where id = ${db[1]};` };

  return database.getSql(query).then(() => {
    return {
      id: data.id,
      __tableName: table.getName()
    }
  })
};

const updateQuery = (table, id, data) => {
  let query = `update ${table} set `;
  const rowKeys = Object.keys(data);
  for (const key of rowKeys) {
    const lastField = rowKeys[rowKeys.length - 1] === key;
    query = query.concat(`${key} = "${data[key]}"${lastField ? '' : ', '}`);
  }

  return query.concat(` where id = ${id};`);
};

const updateRow = (data) => {
  const row = setProperties(data, "id");
  const db = dbIdNodeId(data.id);
  const query = { text: updateQuery(db[0], db[1], row) };

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
    return dbIdToNodeId(ids[0].id, table);
  }).catch(error => ({ error }))
};


const createActivity = (data) => {
  const activity = {
    name: data.name,
    categoryId: data.categoryId,
    about: data.about,
    location: data.location,
    date: data.date
  };
  const query = tables.activities.insert([activity]).toQuery();
  return insertRow(tables.activities.getName(), query);
};

const createCategory = (category) => {
  const query = tables.categories.insert([category]).toQuery();
  return insertRow(tables.categories.getName(), query);
};

const deleteCategoryActivities = (data) => {
  const db = dbIdNodeId(data.id);
  const query = { text: `delete from activities where categoryId = ${db[1]};` };
  const activities = data.activities.replace(/ /g, '').split(",");

  return database.getSql(query).then(() => {
    for (let i = 0, len = activities.length; i < len; i++) {
      clearCacheById(`activities: ${activities[i]}`);
    }
    return ({
      id: data.id,
      __tableName: "categories",
      __typename: "categories"
    })
  }).catch(error => ({ error }))
};

module.exports = {
  getCategories,
  getActivities,
  getNodeById,
  createActivity,
  createCategory,
  deleteActivity,
  deleteRow,
  deleteCategory,
  deleteCategoryActivities,
  updateRow,
  nodeLoaders
};
