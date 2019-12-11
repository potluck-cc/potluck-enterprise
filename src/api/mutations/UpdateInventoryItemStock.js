import gql from "graphql-tag";

export default gql`
  mutation UpdateInventoryItemStock($storeId: ID!, $id: ID!, $quantity: Float, $operator: String) {
    updateStock(input: { storeId: $storeId, id: $id, quantity: $quantity, operator: $operator }) {
      id
      quantity
    }
  }
`;
