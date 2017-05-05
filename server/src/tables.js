const sql = require('sql');

sql.setDialect('sqlite');

const categories = sql.define({
  name: 'categories',
  columns: [{
    name: 'id',
    dataType: 'integer',
    primaryKey: true
  }, {
    name: 'name',
    dataType: 'text collate nocase',
    unique: true,
  }, {
    name: 'description',
    dataType: 'text'
  }, {
    name: 'createdAt',
    dataType: 'datetime default current_timestamp'
  }],
  constraint: 'name_unique UNIQUE (name)'
});

const activities = sql.define({
  name: 'activities',
  columns: [{
    name: 'id',
    dataType: 'INTEGER',
    primaryKey: true
  }, {
    name: 'categoryId',
    dataType: 'int'
  }, {
    name: 'name',
    dataType: 'text'
  }, {
    name: 'about',
    dataType: 'text'
  }, {
    name: 'location',
    dataType: 'text'
  }, {
    name: 'createdAt',
    dataType: 'datetime default current_timestamp'
  }, {
    name: 'date',
    dataType: 'datetime'
  }]
});

module.exports = {
  categories,
  activities
};
