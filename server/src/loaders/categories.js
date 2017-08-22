const database = require('../database');
const tables = require('../tables');

const { insertRow } = require('./sqlShared');

const {
  dbIdNodeId,
  clearCacheById
} = require('./utils');

const CATEGORY_NAME = tables.categories.getName();
const ACTIVITIES_NAME = tables.activities.getName();

const getCategories = () => {
  const query = tables.categories
    .select(tables.categories.star())
    .toQuery();

  return database.getSql(query).then((rows) => ({
    categories: rows.map((category) => {
      category.__tableName = CATEGORY_NAME;

      return category;
    })
  }));
};

const deleteCategoryActivities = (data) => {
  const { id, activityIds } = data;
  const categoryId = dbIdNodeId(id)[ 1 ];
  const query = {
    text: `delete from ${ACTIVITIES_NAME} where categoryId = $1;`,
    values: [ categoryId ]
  };
  const categoryActivities = activityIds.replace(/ /g, '').split(",");

  return database.getSql(query).then(() => {
    for (let i = 0, len = categoryActivities.length; i < len; i++) {
      clearCacheById(`${ACTIVITIES_NAME}: ${categoryActivities[ i ]}`);
    }
  }).catch((error) => {
    return { error };
  })
};

const deleteCategory = (data) => {
  const { id, activityIds } = data;
  const categoryId = dbIdNodeId(id)[ 1 ];
  const query = {
    text: `delete from "${CATEGORY_NAME}" where id = $1;`,
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

const createCategory = (category) => {
  const query = tables.categories.insert([ category ]).toQuery();
  return insertRow(CATEGORY_NAME, query);
};

module.exports = {
  getCategories,
  createCategory,
  deleteCategory,
  deleteCategoryActivities,
};
