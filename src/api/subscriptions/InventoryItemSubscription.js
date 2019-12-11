import gql from "graphql-tag";

export default gql`
  subscription UpdateInventoryItemStock($id: ID!) {
    onUpdateInventoryItemStock(id: $id) {
      id
      quantity
    }
  }
`;
