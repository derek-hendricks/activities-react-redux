"use strict";
const mockServer = require('graphql-tools').mockServer;
const chai = require('chai');
const faker = require('faker');
const schema = require('./../schema');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);
const expect = chai.expect;

const Activity = {
  id: faker.random.uuid(),
  name: faker.name.findName(),
  categoryId: "1",
  createdAt: faker.date.past(),
  date: faker.date.future(),
  about: faker.lorem.sentence(),
  location: faker.address.streetAddress(),
  typename: 'Activity'
};

const Categories = [{
  id: "2",
  name: faker.name.findName(),
  description: faker.name.findName(),
  createdAt: faker.name.findName(),
  typename: 'Category',
  activities: []
}, {
  id: "1",
  name: faker.name.findName(),
  description: faker.name.findName(),
  createdAt: faker.name.findName(),
  typename: 'Category',
  activities: [Activity, Activity, Activity]
}];

const server = mockServer(schema, {
  CategoryInterface: (_, source) => {
    return Categories.filter((category) => category.id === source.id)[0]
  },
  Activity: () => {
    return Activity;
  }
});

const queryString = `{
    categoryInterface(id: "1") {
      ... on Category {
        id,
        activities {
          id
          categoryId
          name
          about
          date
          location
          createdAt
        }
      }
    }
  }`;

describe("Schema: categoryInterface query", () => {
  it("Response is an object that contains a data property", (done) => {
    server.query(queryString).then((response) => {
      expect(response).to.be.an('object');
      expect(response).to.have.property('data');
      done();
    });
  });
});

it("Data is an object that contains categoryList property", (done) => {
  server.query(queryString).then((response) => {
    expect(response.data).to.be.an('object');
    expect(response.data).to.have.property('categoryInterface');
    done();
  });
});

it("categoryInterface is an object that contains activities property", (done) => {
  server.query(queryString).then((response) => {
    expect(response.data.categoryInterface).to.be.an('object');
    expect(response.data.categoryInterface).to.have.property('activities');
    done();
  });
});

it("activities is an array", (done) => {
  server.query(queryString).then((response) => {
    expect(response.data.categoryInterface.activities).to.be.an('array');
    done();
  });
});

it("activities array contains object with properties: 'id', 'name', 'categoryId', 'date', 'about', 'location'", (done) => {
  server.query(queryString).then((response) => {
    expect(response.data.categoryInterface.activities[0]).to.be.an('object')
      .that.includes.all.keys('id', 'name', 'categoryId', 'date', 'about', 'location');
    done();
  });
});

it("activity object contains 'id', 'name', 'categoryId', 'date', 'about', 'location' string values", (done) => {
  server.query(queryString).then((response) => {
    const activity = response.data.categoryInterface.activities[0];
    expect(activity.id).to.be.a('string');
    expect(activity.name).to.be.a('string');
    expect(activity.categoryId).to.be.a('string');
    expect(activity.about).to.be.a('string');
    expect(activity.date).to.be.a('string');
    expect(activity.location).to.be.a('string');
    expect(activity.createdAt).to.be.a('string');
    done();
  });

  it("activities categoryId equals categoryInterface id", (done) => {
    server.query(queryString).then((response) => {
      const activity = response.data.categoryInterface.activities[0];
      const category = response.data.categoryInterface;
      expect(activity.categoryId).to.equal(category.id);
      done();
    });
  });
});
