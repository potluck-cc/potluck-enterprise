import gql from "graphql-tag";

export default gql`
  subscription ReceiveOrders($storeId: ID!) {
    onCreateOrder(storeId: $storeId) {
      storeId
      id
      createdAt
      expectedCompletionDate
      total
      code
      totalDisplayValue
      status
      pos
      subtotal
      subtotalDisplayValue
      tax
      taxDisplayValue
      discount
      discountDisplayValue
      customer {
        id
        firstname
        lastname
        phone
        street
        city
        state
        stateId
        medCard
        marketToken
        marketWebToken
      }
      products {
        item {
          id
          quantity
          productType
          isCannabisProduct
          price
          product {
            id
            name
          }
        }
        quantity
        requestedGrams
        option {
          amount
          weight
        }
      }
    }
  }
`;
