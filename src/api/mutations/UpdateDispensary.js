import gql from "graphql-tag";

export default gql`
  mutation UpdateDispensary(
    $companyId: ID!
    $id: ID!
    $name: String
    $street: String
    $city: String
    $zip: String
    $phone: AWSPhone
    $latitude: Float
    $longitude: Float
    $link: AWSURL
    $hours: AWSJSON
    $logo: AWSURL
    $storefrontImage: AWSURL
    $pickup: Boolean
    $maxDays: Int
    $public: Boolean
  ) {
    updateStore(
      input: {
        companyId: $companyId
        id: $id
        name: $name
        street: $street
        city: $city
        zip: $zip
        phone: $phone
        latitude: $latitude
        longitude: $longitude
        link: $link
        hours: $hours
        logo: $logo
        storefrontImage: $storefrontImage
        pickup: $pickup
        maxDays: $maxDays
        public: $public
      }
    ) {
      id
      companyId
      name
      street
      city
      state
      zip
      phone
      latitude
      longitude
      slug
      link
      logo
      storefrontImage
      pickup
      delivery
      maxDays
      public
      hours {
        startTime
        endTime
        day
      }
    }
  }
`;
