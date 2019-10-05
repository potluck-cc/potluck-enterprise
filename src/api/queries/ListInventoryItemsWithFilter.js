import gql from "graphql-tag";

export default gql`
  query ListInventoryItems(
    $storeId: ID!
    $nextToken: String
    $productType: String
  ) {
    getStoreInventory(
      storeId: $storeId
      nextToken: $nextToken
      filter: { productType: { eq: $productType } }
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
