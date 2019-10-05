import gql from "graphql-tag";

export default gql`
  mutation DeleteProductFromInventory(
    $storeId: ID!
    $createdAt: AWSTimestamp!
  ) {
    deleteInventoryItem(input: { storeId: $storeId, createdAt: $createdAt }) {
      id
    }
  }
`;
