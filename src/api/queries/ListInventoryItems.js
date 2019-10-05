import gql from "graphql-tag";

export default gql`
  query ListInventoryItems($storeId: ID!, $nextToken: String) {
    getStoreInventory(nextToken: $nextToken, storeId: $storeId) {
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
        createdAt
        storeId
        options {
          amount
          weight
        }
        price
        product {
          id
          name
          slug
        }
      }
      nextToken
    }
  }
`;
