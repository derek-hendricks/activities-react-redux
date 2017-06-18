const graphql = require('graphql');
const expect = require('chai').expect;

const loaders = require('../../src/loaders');
const types = require('../../src/types');

const GraphQLNonNull = graphql.GraphQLNonNull;
const GraphQLID = graphql.GraphQLID;
const GraphQLString = graphql.GraphQLString;

const CategoryWithoutInterfaceType = types.CategoryWithoutInterfaceType;

describe('Type: CategoryWithoutInterfaceType', () => {
  it('Should have CategoryWithoutInterfaceType field of id (GraphQLNonNull GraphQLID)', () => {
    expect(CategoryWithoutInterfaceType.getFields()).to.have.property('id');
    expect(CategoryWithoutInterfaceType.getFields().id.type.constructor).equals(GraphQLNonNull);
    expect(CategoryWithoutInterfaceType.getFields().id.type).deep.equals(new GraphQLNonNull(GraphQLID));
  });

  it('Should have CategoryWithoutInterfaceType field of name (GraphQLNonNull GraphQLString)', () => {
    expect(CategoryWithoutInterfaceType.getFields()).to.have.property('name');
    expect(CategoryWithoutInterfaceType.getFields().name.type.constructor).equals(GraphQLNonNull);
    expect(CategoryWithoutInterfaceType.getFields().name.type).deep.equals(new GraphQLNonNull(GraphQLString));
  });

  it('Should have CategoryWithoutInterfaceType field of description (GraphQLString)', () => {
    expect(CategoryWithoutInterfaceType.getFields()).to.have.property('description');
    expect(CategoryWithoutInterfaceType.getFields().description.type).deep.equals(GraphQLString);
  });

  it('Should have CategoryWithoutInterfaceType field of createdAt (GraphQLString)', () => {
    expect(CategoryWithoutInterfaceType.getFields()).to.have.property('createdAt');
    expect(CategoryWithoutInterfaceType.getFields().createdAt.type).deep.equals(GraphQLString);
  });
});
