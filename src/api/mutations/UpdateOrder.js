import gql from "graphql-tag";

export default gql`
  mutation UpdateOrder($storeId: ID!, $code: String!, $status: OrderStatus) {
    updateOrder(input: { storeId: $storeId, code: $code, status: $status }) {
      id
      createdAt
      storeId
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
