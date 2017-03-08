const sql = require('sql');

sql.setDialect('sqlite');

const categories = sql.define({
  name: 'categories',
  columns: [{
    name: 'id',
    dataType: 'INTEGER',
    primaryKey: true
  }, {
    name: 'name',
    dataType: 'text'
  }, {
    name: 'description',
    dataType: 'text'
  }]
});

module.exports = {
  categories: categories
};


