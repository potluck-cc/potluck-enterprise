import gql from "graphql-tag";

export default gql`
  mutation CreateInventoryItem(
    $product: String!
    $productType: ProductType!
    $quantity: Float!
    $options: AWSJSON
    $thc: String
    $cbd: String
    $image: AWSURL
    $description: String
    $strainType: StrainType
    $price: Float
    $isCannabisProduct: Boolean
    $storeId: ID!
    $createdAt: AWSTimestamp!
    $updatedAt: AWSTimestamp
    $latitude: Float
    $longitude: Float
  ) {
    createInventoryItem(
      input: {
        product: $product
        productType: $productType
        quantity: $quantity
        options: $options
        thc: $thc
        cbd: $cbd
        image: $image
        description: $description
        strainType: $strainType
        price: $price
        isCannabisProduct: $isCannabisProduct
        storeId: $storeId
        createdAt: $createdAt
        updatedAt: $updatedAt
        latitude: $latitude
        longitude: $longitude
      }
    ) {
      id
      image
      productType
      quantity
      description
      strainType
      isCannabisProduct
      storeId
      createdAt
      product {
        name
      }
      price
      options {
        amount
        weight
      }
      thc
      cbd
    }
  }
`;
