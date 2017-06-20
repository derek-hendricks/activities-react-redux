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

export const activitiesPageQuery = gql`
  query ACTIVITIES_PAGE_QUERY($id: ID!, $first: Int, $before: Int, $after: Int)  {
    categoryInterface(id: $id) {
      ... on Category {
        activities(first: $first, before: $before, after: $after) {
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
  }`;
