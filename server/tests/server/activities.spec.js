const graphql = require('graphql');
const chai = require('chai');

const loaders = require('../../src/loaders');
const types = require('../../src/types');

const GraphQLNonNull = graphql.GraphQLNonNull;
const GraphQLID = graphql.GraphQLID;
const GraphQLString = graphql.GraphQLString;

const CategoryInterface = types.CategoryInterface;
const ActivitiesType = types.ActivitiesType;

const expect = chai.expect;

describe('Type: Activities', () => {
  it('Should have interface field of CategoryInterface', () => {
    expect(ActivitiesType.getInterfaces()[0]).equals(CategoryInterface);
  });

  it('Should have ActivitiesType field of id (GraphQLNonNull GraphQLID)', () => {
    expect(ActivitiesType.getFields()).to.have.property('id');
    expect(ActivitiesType.getFields().id.type.constructor).equals(GraphQLNonNull);
    expect(ActivitiesType.getFields().id.type).deep.equals(new GraphQLNonNull(GraphQLID));
  });

  it('Should have ActivitiesType field of name (GraphQLNonNull GraphQLString)', () => {
    expect(ActivitiesType.getFields()).to.have.property('name');
    expect(ActivitiesType.getFields().name.type.constructor).equals(GraphQLNonNull);
    expect(ActivitiesType.getFields().name.type).deep.equals(new GraphQLNonNull(GraphQLString));
  });

  it('Should have ActivitiesType field of categoryId (GraphQLNonNull GraphQLID)', () => {
    expect(ActivitiesType.getFields()).to.have.property('categoryId');
    expect(ActivitiesType.getFields().categoryId.type.constructor).equals(GraphQLNonNull);
    expect(ActivitiesType.getFields().categoryId.type).deep.equals(new GraphQLNonNull(GraphQLID));
  });

  it('Should have ActivitiesType field of createdAt (GraphQLNonNull GraphQLString)', () => {
    expect(ActivitiesType.getFields()).to.have.property('createdAt');
    expect(ActivitiesType.getFields().createdAt.type.constructor).equals(GraphQLNonNull);
    expect(ActivitiesType.getFields().createdAt.type).deep.equals(new GraphQLNonNull(GraphQLString));
  });

  it('Should have ActivitiesType field of date (GraphQLString)', () => {
    expect(ActivitiesType.getFields()).to.have.property('date');
    expect(ActivitiesType.getFields().date.type).deep.equals(GraphQLString);
  });

  it('Should have ActivitiesType field of about (GraphQLString)', () => {
    expect(ActivitiesType.getFields()).to.have.property('about');
    expect(ActivitiesType.getFields().about.type).deep.equals(GraphQLString);
  });

  it('Should have ActivitiesType field of location (GraphQLString)', () => {
    expect(ActivitiesType.getFields()).to.have.property('location');
    expect(ActivitiesType.getFields().location.type).deep.equals(GraphQLString);
  });
});
