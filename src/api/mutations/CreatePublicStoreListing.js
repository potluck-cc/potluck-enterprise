import gql from "graphql-tag";

export default gql`
  mutation CreatePublicListing(
    $id: ID!
    $companyId: ID!
    $name: String!
    $latitude: Float!
    $longitude: Float!
    $state: State!
    $city: String!
    $slug: String!
    $street: String!
    $zip: String!
    $logo: AWSURL
    $storefrontImage: AWSURL
  ) {
    createPublicStoreListing(
      input: {
        id: $id
        latitude: $latitude
        longitude: $longitude
        name: $name
        logo: $logo
        storefrontImage: $storefrontImage
        slug: $slug
        state: $state
        street: $street
        zip: $zip
        city: $city
        companyId: $companyId
      }
    ) {
      name
    }
  }
`;
