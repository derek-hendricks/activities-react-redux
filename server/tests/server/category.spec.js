const graphql = require('graphql');
const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const GraphQLNonNull = graphql.GraphQLNonNull;
const GraphQLID = graphql.GraphQLID;
const GraphQLString = graphql.GraphQLString;
const GraphQLList = graphql.GraphQLList;

const loaders = require('../../src/loaders');
const types = Object.assign({}, require('../../src/types'));

const CategoryInterface = types.CategoryInterface;
const CategoryType = types.CategoryType;

chai.use(sinonChai);
const sandbox = sinon.sandbox.create();
const expect = chai.expect;

describe('Type: Category', () => {
  before(() => sandbox.stub(loaders, 'getActivities'));
  after(() => sandbox.restore());

  it('Should have CategoryType field of id (GraphQLNonNull GraphQLID)', () => {
    expect(CategoryType.getFields()).to.have.property('id');
    expect(CategoryType.getFields().id.type.constructor).equals(GraphQLNonNull);
    expect(CategoryType.getFields().id.type).deep.equals(new GraphQLNonNull(GraphQLID));
  });

  it('Should have CategoryType field of id that resolves formatted id', () => {
    expect(CategoryType.getFields().id.resolve({
      __tableName: 'categories', id: "1"
      }
    )).to.equal('categories: 1');
  });

  it('Should have CategoryType field of name (GraphQLNonNull GraphQLString)', () => {
    expect(CategoryType.getFields()).to.have.property('name');
    expect(CategoryType.getFields().name.type.constructor).equals(GraphQLNonNull);
    expect(CategoryType.getFields().name.type).deep.equals(new GraphQLNonNull(GraphQLString));
  });

  it('Should have CategoryType field of description (GraphQLString)', () => {
    expect(CategoryType.getFields()).to.have.property('description');
    expect(CategoryType.getFields().description.type).deep.equals(GraphQLString);
  });

  it('Should have CategoryType field of createdAt (GraphQLString)', () => {
    expect(CategoryType.getFields()).to.have.property('createdAt');
    expect(CategoryType.getFields().createdAt.type).deep.equals(GraphQLString);
  });

  it('Should have CategoryType field of activities GraphQLList', () => {
    expect(CategoryType.getFields()).to.have.property('activities');
    expect(CategoryType.getFields().activities.type.constructor).equals(GraphQLList);
  });

  it('Should not call getActivities if activities field resolve not called', () => {
    expect(CategoryType.getFields()).to.have.property('activities');
    expect(loaders.getActivities).to.not.have.been.called;
  });

  it('Should call getActivities if no id provided to activities field resolve', () => {
    const source = { id: "2" };
    CategoryType.getFields().activities.resolve();
    expect(loaders.getActivities).to.have.been.called;
    expect(loaders.getActivities).to.not.have.been.calledWith(source);
  });

  it('Should call getActivities with id if id provided to activities field resolve', () => {
    const source = { id: "2" };
    CategoryType.getFields().activities.resolve(source);
    expect(loaders.getActivities).to.have.been.called;
    expect(loaders.getActivities).to.have.been.calledWith(source);
  });
});
