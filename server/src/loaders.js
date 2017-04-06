"use strict";
const DataLoader = require('dataloader');
const database = require('./database');
const tables = require('./tables');

const createNodeLoader = (table) => {
  return new DataLoader((ids) => {
    const query = table
      .select(table.star())
      .where(table.id.in(ids))
      .toQuery();

    return database.getSql(query).then((rows) => {
      rows.forEach((row) => {
        row.__tableName = table.getName();
      });
      return rows;
    }).catch((err) => {
    });
  });
};

const nodeLoaders = {
  categories: createNodeLoader(tables.categories),
  activities: createNodeLoader(tables.activities),
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


const removeProperties = (obj, property) => {
  const keys = Object.keys(obj);
  let data = {};
  for (let key of keys) {
    if (key === property) continue;
    if ( !obj[key].trim()) continue;
    if (!Object.prototype.hasOwnProperty.call(obj, property)) continue;
    data[key] = obj[key];
  }
  return data;
};

const getCategories = () => {
  const query = tables.categories.select(tables.categories.star()).toQuery();
  return database.getSql(query).then((rows) => {
    const categories = rows.map((row) => {
      return {
        id: row.id,
        name: row.name,
        description: row.description
      };
    });

    return {
      categories
    }
  });
};

const getCategoryActivities = () => {
  const query = tables.categories
    .select(tables.categories.id, tables.categories.name, tables.activities.name, tables.activities.categoryId)
    .from(
      tables.categories.leftJoin(tables.activities)
        .on(tables.categories.id.equals(tables.activities.categoryId))
    ).toQuery();

  return database.getSql(query).then((rows) => {
    const categories = rows.map((row) => {
      return {
        categoryDescription: row.categoryDescription,
        categoryId: row.categoryId,
        id: row.id,
        name: row.name,
        about: row.about,
        createdAt: row.createdAt,
        date: row.date,
        location: row.location
      }
    });

    return { categories };
  });
};

const getActivities = (source) => {
  const table = tables.activities;
  const query = table.select(table.star())
    .from(table)
    .where(table.categoryId.equals(source.id))
    .order(table.createdAt.desc)
    .toQuery();

  return database.getSql(query).then((rows) => {
    return rows.map((row) => {
      return {
        id: row.id,
        name: row.name,
        about: row.about,
        categoryId: row.categoryId,
        createdAt: row.createdAt,
        date: row.date,
        location: row.location
      }
    });
  });
};

const deleteRow = (data) => {
  const db = data.id.split(":");
  const query = { text: `delete from ${db[0]} where id = ${db[1]};` };

  return database.getSql(query).then(() => {
    return data;
  }).then(() => {
    clearCacheById(data.id);
  }).catch((e) => {
    return e;
  })
};

const updateQuery = (db, data) => {
  let query = `update ${db[0]} set `;
  const activityKeys = Object.keys(data);
  for (let key of activityKeys) {
    const lastField = activityKeys[activityKeys.length - 1] === key;
    query = query.concat(`${key} = "${data[key]}"${lastField ? '' : ', '}`);
  }

  return query.concat(` where id = ${db[1].trim()};`);
};

const updateRow = (data) => {
  const activity = removeProperties(data, "id");
  const db = data.id.split(":");
  const query = { text: updateQuery(db, activity) };

  return database.getSql(query).then(() => {
    return clearCacheById(data.id);
  }).catch((e) => {
    return e;
  })
};

const createActivity = (activity) => {
  const query = tables.activities.insert([
    {
      name: activity.name,
      categoryId: activity.categoryId,
      about: activity.about,
      location: activity.location,
      date: activity.date
    }
  ]).toQuery();

  return database.getSql(query).then(() => {
    return database.getSql({
      text: 'SELECT last_insert_rowid() AS id FROM activities LIMIT 1'
    });
  }).then((activity) => {
    return {
      table: tables.activities.getName(),
      id: activity[0].id
    }
  });
};

module.exports = {
  getCategories,
  getActivities,
  getNodeById,
  getCategoryActivities,
  createActivity,
  deleteRow,
  updateRow,
  nodeLoaders
};
