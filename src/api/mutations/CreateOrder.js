import gql from "graphql-tag";

export default gql`
  mutation CreateOrder(
    $store: String!
    $total: Float!
    $date: String!
    $products: AWSJSON
    $time: String!
    $storeID: String
    $subtotal: Float
    $tax: Float
    $discount: Float
  ) {
    createOrder(
      input: {
        store: $store
        total: $total
        date: $date
        status: accepted
        products: $products
        time: $time
        storeID: $storeID
        pos: true
        subtotal: $subtotal
        tax: $tax
        discount: $discount
        user: "0"
      }
    ) {
      id
      total
      date
      status
      time
      storeID
      pos
      subtotal
      tax
      discount
      user {
        id
        firstname
        lastname
        patientID
        phone
      }
      products {
        product {
          name
        }
        productType
        quantity
        option {
          amount
          weight
        }
      }
    }
  }
`;
