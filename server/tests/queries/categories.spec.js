"use strict";
const mockServer = require('graphql-tools').mockServer;
const chai = require('chai');


const schema = require('./../schema');
const server = mockServer(schema);

const expect = chai.expect;

const categoriesQuery = function () {
  const categories = `{
      categoryList {
        categories {
          id
          description
          name
          createdAt
        }
      }
    }`;
  return server.query(categories);
};

describe("Integration: CategoryList query", () => {
  it("Response is an object that contains data property", function (done) {
    categoriesQuery().then((response) => {
      expect(response).to.be.an('object');
      expect(response).to.have.property('data');
      done();
    });
  });

  it("Data is an object that contains categoryList property", function (done) {
    categoriesQuery().then((response) => {
      const data = categoriesResponseProperties(response).data;
      expect(data).to.be.an('object');
      expect(data).to.have.property('categoryList');
      done();
    });
  });

  it("CategoryList is an object that contains categories property", function (done) {
    categoriesQuery().then((response) => {
      const categoryList = categoriesResponseProperties(response).categoryList;
      expect(categoryList).to.be.an('object');
      expect(categoryList).to.have.property('categories');
      done();
    });
  });

  it("Categories is an array", function (done) {
    categoriesQuery().then((response) => {
      const categories = categoriesResponseProperties(response).categories;
      expect(categories).to.be.an('array');
      done();
    });
  });

  it("Categories array contains object with properties: id, name, description", function (done) {
    categoriesQuery().then((response) => {
      const category = categoriesResponseProperties(response).categories[0];
      expect(category).to.be.an('object')
        .that.includes.all.keys('id', 'name', 'description', 'createdAt');
      done();
    });
  });

  it("Category object contains id, name, description, and createdAt string values", function (done) {
    categoriesQuery().then((response) => {
      const category = categoriesResponseProperties(response).categories[0];
      expect(category.id).to.be.a('string');
      expect(category.id.length).to.not.equal(0);
      expect(category.name).to.be.a('string');
      expect(category.name.length).to.not.equal(0);
      expect(category.description).to.be.a('string');
      expect(category.description.length).to.not.equal(0);
      expect(category.createdAt).to.be.a('string');
      expect(category.createdAt.length).to.not.equal(0);
      done();
    });
  });
});

function categoriesResponseProperties(response) {
  const data = response.data;
  const categoryList = (data || {}).categoryList;
  const categories = (categoryList || {}).categories;

  return { data, categoryList, categories }
}

