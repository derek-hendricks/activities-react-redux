const database = require('./database');
const tables = require('./tables');

const getCategories = () => {
  const table = tables.categories;
  const query = table.select(table.star()).toQuery();

  return database.getSql(query).then((rows) => {
    const categories = rows.map((row) => {
      return {
        id: row.id,
        name: row.name,
        description: row.description
      }
    });

    return {categories};
  });

};

module.exports = {
  getCategories: getCategories
};
