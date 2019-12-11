import gql from "graphql-tag";

export default gql`
  query ListInventoryItems(
    $storeId: ID!
    $metadata: String
    $nextToken: String
  ) {
    getStoreInventoryWithFilters(
      storeId: $storeId
      nextToken: $nextToken
      metadata: $metadata
    ) {
      items {
        id
        quantity
        productType
        strainType
        thc
        cbd
        image
        description
        createdAt
        storeId
        isCannabisProduct
        price
        options {
          amount
          weight
        }
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
