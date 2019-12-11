import gql from "graphql-tag";

export default gql`
  query GetOrdersWithCode($storeId: ID!, $code: String!) {
    getOrderByStoreAndCode(storeId: $storeId, code: $code) {
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
          productType
          isCannabisProduct
          quantity
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
