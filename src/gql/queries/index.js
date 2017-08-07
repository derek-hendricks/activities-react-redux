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
        createdAt
      }
    }
  }`;

export const gqlActivities = (operation) => {
  return gql`query ${operation}($id: ID!, $first: Int!, $before: String, $after: String)  {
    categoryInterface(id: $id) {
    ... on Category {
        id,
          activitiesPage(first: $first, before: $before, after: $after) {
          pageInfo {
            hasNextPage
            hasPreviousPage
            startCursor
            endCursor
          }
          edges {
            cursor
            node {
              id
              name
              about
              location
              date
              createdAt
              categoryId
            }
          }
        }
      }
    }
  }`
};
