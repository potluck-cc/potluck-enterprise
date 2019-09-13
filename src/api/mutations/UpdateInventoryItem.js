import gql from "graphql-tag";

export default gql`
  mutation UpdateInventoryItem(
    $id: ID!
    $thc: String
    $cbd: String
    $options: AWSJSON
    $productType: ProductType
    $quantity: Float
    $product: String
    $image: AWSURL
    $description: String
    $strainType: StrainType
    $price: Float
    $isCannabisProduct: Boolean
  ) {
    updateInventoryItem(
      input: {
        id: $id
        quantity: $quantity
        thc: $thc
        cbd: $cbd
        options: $options
        productType: $productType
        quantity: $quantity
        product: $product
        image: $image
        description: $description
        strainType: $strainType
        price: $price
        isCannabisProduct: $isCannabisProduct
      }
    ) {
      id
      quantity
      productType
      thc
      cbd
      image
      description
      strainType
      displayName
      price
      isCannabisProduct
      options {
        amount
        weight
      }
      product {
        id
        name
        searchField
      }
    }
  }
`;
