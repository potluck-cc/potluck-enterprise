import gql from "graphql-tag";

export default gql`
  mutation DeleteProductFromInventory(
    $storeId: ID!
    $id: ID!
  ) {
    deleteInventoryItem(input: { storeId: $storeId, id: $id }) {
      id
    }
  }
`;
