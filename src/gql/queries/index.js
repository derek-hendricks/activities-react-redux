import gql from 'graphql-tag'

export const categoriesQuery = gql`
  query CATEGORIES_QUERY {
    categoryList {
      categories {
        id
        description
        name
      }
    }
  }`;

export const activitiesQuery = gql`
  query ACTIVITIES_QUERY($id: ID!) {
    categoryInterface(id: $id) {
      ... on Category {
        id,
        activities {
          id
          name
          about
          date
          location
          categoryId
        }
      }
    }
  }`;

export const activityQuery = gql`
  query ACTIVITY_QUERY($id: ID!) {
    categoryInterface(id: $id) {
      ... on Activity {
        id
        name
        about
        date
        location
        categoryId
      }
    }
  }`;
