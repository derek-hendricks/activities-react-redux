const graphql = require('graphql');
const expect = require('chai').expect;

const GraphQLNonNull = require('graphql').GraphQLNonNull;
const GraphQLID = require('graphql').GraphQLID;

const loaders = require('../../src/loaders');
const types = require('../../src/types');

const CategoryInterface = types.CategoryInterface;
const ActivitiesType = types.ActivitiesType;
const CategoryType = types.CategoryType;

describe('Type: CategoryInterface', () => {
  it('Should have an id field of type id (GraphQLNonNull GraphQLID)', () => {
    expect(CategoryInterface.getFields()).to.have.property('id');
    expect(CategoryInterface.getFields().id.type.constructor).equals(GraphQLNonNull);
    expect(CategoryInterface.getFields().id.type).deep.equals(new GraphQLNonNull(GraphQLID));
  });

  it('Should resolve CategoryType', () => {
    expect(CategoryInterface.resolveType({ __tableName: "categories" })).equals(CategoryType)
  });

  it('Should resolve ActivitiesType', () => {
    expect(CategoryInterface.resolveType({ __tableName: "activities" })).equals(ActivitiesType)
  });
});
