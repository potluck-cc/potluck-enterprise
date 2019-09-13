import gql from "graphql-tag";

export default gql`
  mutation UpdateOrder($id: ID!, $status: OrderStatus) {
    updateOrder(input: { id: $id, status: $status }) {
      id
    }
  }
`;
