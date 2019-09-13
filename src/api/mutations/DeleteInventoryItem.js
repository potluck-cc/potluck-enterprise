import gql from "graphql-tag";

export default gql`
  mutation DeleteProductFromInventory($id: ID!) {
    deleteInventoryItem(input: { id: $id }) {
      id
    }
  }
`;
