const graphql = require('graphql');
const expect = require('chai').expect;
const GraphQLList = require('graphql').GraphQLList;

const CategoriesType = require('../../src/types').CategoriesType;
const loaders = require('../../src/loaders');

describe('Type: Categories', () => {
  it('Should have CategoryType field of categories GraphQLList', () => {
    expect(CategoriesType.getFields()).to.have.property('categories');
    expect(CategoriesType.getFields().categories.type.constructor).equals(GraphQLList);
  });
});
