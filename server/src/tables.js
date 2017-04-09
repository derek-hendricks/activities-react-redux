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

// todo:
// create join table so activities and categories have many-to-many relationship

module.exports = {
  categories,
  activities
};
