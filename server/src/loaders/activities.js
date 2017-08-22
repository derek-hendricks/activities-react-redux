const database = require('../database');
const tables = require('../tables');

const { dbIdNodeId } = require('./utils');
const { clearCacheById } = require('./nodeLoaders');
const { sqlWhereSearchConditions } = require('./sqlUtils');
const { insertRow } = require('./sqlShared');

const ACTIVITIES_NAME = tables.activities.getName();

const activitiesPageRows = (rows, __tableName) => {
  return rows.slice().map((row) => {
    row.__tableName = __tableName;
    row.__cursor = `${row.id}: ${row.createdAt}`;

    return row;
  })
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

const activitiesPageQuery = ({ first, before }, id) => {
  const selectText = `select "${ACTIVITIES_NAME}".* from "${ACTIVITIES_NAME}"`;

  const {
    whereClauseText,
    whereClauseValues
  } = sqlWhereSearchConditions(ACTIVITIES_NAME, id, 'categoryId', before);

  const queryOrderText = `order by "${ACTIVITIES_NAME}"."createdAt" desc`;
  const queryLimitText = `limit ${first + 1}`;

  return {
    text: `${selectText} ${whereClauseText} ${queryOrderText} ${queryLimitText}`,
    values: whereClauseValues
  };
};

const getActivitiesPage = ({ id }, args) => {
  const { first } = args;
  const query = activitiesPageQuery(args, id);

  return database.getSql(query).then((result) => {
    const pageRows = result.slice(0, first);
    const rows = activitiesPageRows(pageRows, ACTIVITIES_NAME);
    const pageInfo = activitiesPageInfo(result, rows, first);

    return {
      rows,
      pageInfo
    }
  });
};

const deleteActivity = (data) => {
  const [ table, id ] = dbIdNodeId(data.id);
  const query = { text: `delete from ${table} where id = ${id};` };

  return database.getSql(query).then(() => {
    clearCacheById(data.id);
    return data;
  }).catch(error => error)
};

const createActivity = (data) => {
  const {
    name, categoryId, about, location, date
  } = data;

  const activity = {
    name,
    categoryId,
    about,
    location,
    date
  };
  const query = tables.activities
    .insert([ activity ])
    .toQuery();

  return insertRow(ACTIVITIES_NAME, query);
};

module.exports = {
  getActivitiesPage,
  createActivity,
  deleteActivity
};
