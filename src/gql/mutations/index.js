import gql from 'graphql-tag';

export const categoryCreate = gql`
  mutation CREATE_CATEGORY_MUTATION($name: String!) {
    CREATE_CATEGORY_MUTATION(name: $name) {
      __typename
      name
      id
    }
  }`;

export const categoryDelete = gql`
  mutation DELETE_CATEGORY_MUTATION($id: ID!, $activities: String) {
    DELETE_CATEGORY_MUTATION(id: $id, activities: $activities) {
      __typename
      id
    }
  }`;

export const categoryUpdate = gql`
  mutation UPDATE_CATEGORY_MUTATION($id: ID!, $name: String, $description: String) {
    UPDATE_CATEGORY_MUTATION(id: $id, name: $name, description: $description) {
      __typename
      id
    }
  }`;

export const createActivity = gql`
  mutation CREATE_ACTIVITY_MUTATION($name: String!, $categoryId: String!, $about: String, $location: String, $date: String) {
    CREATE_ACTIVITY_MUTATION(name: $name, categoryId: $categoryId, about: $about, location: $location, date: $date) {
      __typename
      name
      id
      categoryId
      about
      location
      date
      createdAt
    }
  }`;

export const activityDelete = gql`
  mutation DELETE_ACTIVITY_MUTATION($id: ID!) {
    DELETE_ACTIVITY_MUTATION(id: $id) {
      __typename
      id
    }
  }`;

export const activityUpdate = gql`
  mutation UPDATE_ACTIVITY_MUTATION($id: ID!, $name: String, $categoryId: String, $about: String, $location: String, $date: String) {
    UPDATE_ACTIVITY_MUTATION(id: $id, name: $name, about: $about, location: $location, date: $date, categoryId: $categoryId) {
      __typename
      id
    }
  }`;
