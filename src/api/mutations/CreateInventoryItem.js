import gql from "graphql-tag";

export default gql`
  mutation CreateInventoryItem(
    $product: String!
    $productType: ProductType!
    $store: String!
    $quantity: Float!
    $options: AWSJSON
    $thc: String
    $cbd: String
    $image: AWSURL
    $description: String
    $strainType: StrainType
    $price: Float
    $isCannabisProduct: Boolean
  ) {
    createInventoryItem(
      input: {
        product: $product
        productType: $productType
        store: $store
        quantity: $quantity
        options: $options
        thc: $thc
        cbd: $cbd
        image: $image
        description: $description
        strainType: $strainType
        price: $price
        isCannabisProduct: $isCannabisProduct
      }
    ) {
      id
      image
      productType
      quantity
      description
      strainType
      isCannabisProduct
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
