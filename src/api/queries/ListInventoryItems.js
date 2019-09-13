import gql from "graphql-tag";

export default gql`
  query ListInventoryItems($nextToken: String) {
    listInventories(
      nextToken: $nextToken
      filter: { store: { eq: "851e40a3-b63b-4f7d-be37-3cf4065c08b5" } }
    ) {
      items {
        id
        quantity
        productType
        thc
        cbd
        image
        description
        strainType
        displayName
        isCannabisProduct
        options {
          amount
          weight
        }
        price
        product {
          id
          name
          searchField
        }
      }
      nextToken
    }
  }
`;
