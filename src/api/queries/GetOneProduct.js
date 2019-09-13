import gql from "graphql-tag";

export default gql`
  query ListProducts($query: String!) {
    listProducts(filter: { searchField: { eq: $query } }) {
      items {
        id
      }
    }
  }
`;
