import gql from "graphql-tag";

export default gql`
  subscription ReceiveOrders(
    $storeID: String
    $status: OrderStatus
    $date: String
  ) {
    onCreateOrder(storeID: $storeID, status: $status, date: $date) {
      id
      total
      date
      status
      time
      storeID
    }
  }
`;
