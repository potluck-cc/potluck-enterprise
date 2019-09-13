import gql from "graphql-tag";

export default gql`
  mutation CreateProduct($name: String!, $searchField: String!) {
    createProduct(input: { name: $name, searchField: $searchField }) {
      id
      name
      searchField
    }
  }
`;
