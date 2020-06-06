import gql from "graphql-tag";

export default gql`
  mutation CreateStore(
    $name: String!
    $street: String!
    $state: State!
    $city: String!
    $zip: String!
    $latitude: Float!
    $longitude: Float!
    $companyId: ID!
    $metadata: String!
    $slug: String!
  ) {
    createStore(
      input: {
        name: $name
        street: $street
        state: $state
        city: $city
        zip: $zip
        latitude: $latitude
        longitude: $longitude
        companyId: $companyId
        slug: $slug
        metadata: $metadata
      }
    ) {
      id
      name
      state
      city
      zip
      street
    }
  }
`;
