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
