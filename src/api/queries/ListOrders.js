import gql from "graphql-tag";

export default gql`
  query listOrders($nextToken: String, $date: String, $status: String) {
    listOrders(
      nextToken: $nextToken
      filter: { date: { contains: $date }, status: { contains: $status } }
    ) {
      items {
        id
        total
        code
        totalDisplayValue
        date
        status
        time
        pos
        subtotal
        subtotalDisplayValue
        tax
        taxDisplayValue
        discount
        discountDisplayValue
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
          price
          isCannabisProduct
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
