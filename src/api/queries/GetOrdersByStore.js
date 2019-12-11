import gql from "graphql-tag";

export default gql`
  query GetOrders($storeId: ID!, $from: AWSTimestamp!, $to: AWSTimestamp!) {
    getOrdersByStoreAndDate(storeId: $storeId, from: $from, to: $to) {
      items {
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
            price
            quantity
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
      nextToken
    }
  }
`;
