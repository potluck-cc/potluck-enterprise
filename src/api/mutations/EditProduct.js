import gql from "graphql-tag";

export default gql`
  mutation UpdateProduct($id: ID!, $name: String, $searchField: String) {
    updateProduct(input: { id: $id, name: $name, searchField: $searchField }) {
      id
      name
      searchField
    }
  }
`;
