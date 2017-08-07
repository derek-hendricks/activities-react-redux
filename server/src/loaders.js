"use strict";
const DataLoader = require('dataloader');
const database = require('./database');
const tables = require('./tables');

const { activities: activitiesTable, categories: categoriesTable } = tables;
const ACTIVITIES_TABLE_NAME = activitiesTable.getName();
const CATEGORY_TABLE_NAME = categoriesTable.getName();

const createNodeLoader = (table) => {
  return new DataLoader((ids) => {
    const query = table
      .select(table.star())
      .where(table.id.in(ids))
      .order(table.id.desc)
      .toQuery();

    return database.getSql(query).then((rows) => {
      return ids.map((id) => {
        return rows.find((row) => {
          row.__tableName = table.getName();
          return id === String(row.id);
        })
      });
    }).catch((error) => {
      return error;
    })
  })
};

const nodeLoaders = {
  categories: createNodeLoader(categoriesTable),
  activities: createNodeLoader(activitiesTable),
};

const dbIdToNodeId = (dbId, tableName) => {
  return `${tableName}:${dbId}`;
};

const dbIdNodeId = (data) => {
  return data.replace(/ /g, '').split(':');
};

const dbIdCreatedAtDate = (data) => {
  return data.replace(/:/, '+').split('+').map((x) => x.trim())[ 1 ];
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

const setProperties = (obj, property) => {
  const keys = Object.keys(obj);
  const data = {};
  for (const key of keys) {
    const keyIsProperty = key === property;
    const valueIsNotUpdated = !obj[ key ].trim();
    const doesNotHaveProperty = !Object.prototype.hasOwnProperty.call(obj, property);
    if (keyIsProperty || valueIsNotUpdated || doesNotHaveProperty) {
      continue;
    }
    data[ key ] = obj[ key ];
  }

  return data;
};

const getCategories = () => {
  const query = categoriesTable
    .select(categoriesTable.star())
    .toQuery();

  return database.getSql(query).then((rows) => ({
    categories: rows.map((data) => {
      const {
        id, name, description, createdAt
      } = data;

      return {
        id,
        name,
        description,
        createdAt,
        __tableName: CATEGORY_TABLE_NAME
      };
    })
  }));
};

const activitiesPageRows = (rows, __tableName) => (
  rows.slice().map((row) => {
    const {
      id, name, about, createdAt, categoryId, location, date
    } = row;

    return {
      id,
      name,
      about,
      categoryId,
      createdAt,
      date,
      location,
      __tableName,
      __cursor: `${id}: ${createdAt}`
    };
  })
);

const activitiesPageQuery = (args, id) => {
  const { first } = args;
  const table = ACTIVITIES_TABLE_NAME;
  const select = {
    text: `select "${table}".* from "${table}" where "${table}"."categoryId" = $1`,
    values: [ id ]
  };
  let dateTime = { text: '' };
  if (args.before) {
    const before = dbIdCreatedAtDate(args.before);
    dateTime = {
      text: `and "${table}"."createdAt" < Datetime($2)`,
      values: [ before ]
    };
  }
  const orderLimit = {
    text: `order by "${table}"."createdAt" desc limit ${first + 1}`,
  };

  return {
    text: `${select.text} ${dateTime.text} ${orderLimit.text}`,
    values: [].concat(select.values, dateTime.values)
  };
};

const activitiesPageInfo = (rows, pageRows, first) => {
  const pageInfo = {
    hasNextPage: rows.length > first,
    hasPreviousPage: false
  };
  if (pageRows.length > 0) {
    const { __cursor: startCursor } = pageRows[ 0 ];
    const { __cursor: endCursor } = pageRows[ pageRows.length - 1 ];

    return Object.assign({}, pageInfo, { startCursor, endCursor });
  }

  return pageInfo;
};

const getActivitiesPage = ({ id }, args) => {
  const { first } = args;
  const query = activitiesPageQuery(args, id);

  return database.getSql(query).then((result) => {
    const pageRows = result.slice(0, first);
    const rows = activitiesPageRows(pageRows, ACTIVITIES_TABLE_NAME);
    const pageInfo = activitiesPageInfo(result, rows, first);
    return { rows, pageInfo }
  });
};

const deleteCategoryActivities = (data) => {
  const { id, activityIds } = data;
  const categoryId = dbIdNodeId(id)[ 1 ];
  const query = {
    text: `delete from ${ACTIVITIES_TABLE_NAME} where categoryId = $1;`,
    values: [ categoryId ]
  };
  const categoryActivities = activityIds.replace(/ /g, '').split(",");

  return database.getSql(query).then(() => {
    for (let i = 0, len = categoryActivities.length; i < len; i++) {
      clearCacheById(`${ACTIVITIES_TABLE_NAME}: ${categoryActivities[ i ]}`);
    }
  }).catch((error) => {
    return { error };
  })
};

const deleteCategory = (data) => {
  const { id, activityIds } = data;
  const categoryId = dbIdNodeId(id)[ 1 ];
  const query = {
    text: `delete from "${CATEGORY_TABLE_NAME}" where id = $1;`,
    values: [ categoryId ]
  };

  return database.getSql(query).then(() => {
    clearCacheById(id);
    if (activityIds) {
      return deleteCategoryActivities(data)
    }
  }).catch((error) => {
    return error;
  })
};

const deleteRow = (data) => {
  const [ table, id ] = dbIdNodeId(data.id);
  const query = { text: `delete from ${table} where id = ${id};` };

  return database.getSql(query).then(() => {
    clearCacheById(data.id);

    return data;
  }).catch(error => error)
};

const deleteActivity = (data) => {
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
  const row = setProperties(data, "id");
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

const createActivity = (data) => {
  const { name, categoryId, about, location, date } = data;
  const activity = {
    name,
    categoryId,
    about,
    location,
    date
  };
  const query = activitiesTable
    .insert([ activity ])
    .toQuery();

  return insertRow(ACTIVITIES_TABLE_NAME, query);
};

const createCategory = (category) => {
  const query = categoriesTable.insert([ category ]).toQuery();
  return insertRow(CATEGORY_TABLE_NAME, query);
};

module.exports = {
  getCategories,
  getNodeById,
  createActivity,
  createCategory,
  deleteActivity,
  deleteCategory,
  deleteCategoryActivities,
  updateRow,
  deleteRow,
  nodeLoaders,
  dbIdToNodeId,
  getActivitiesPage,
  clearCacheById
};
