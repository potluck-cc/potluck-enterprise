import gql from "graphql-tag";

export default gql`
  query GetDispensary($id: ID!) {
    getStore(id: $id) {
      id
      hours {
        startTime
        endTime
        day
      }
      name
      phone
      latitude
      longitude
      state
      city
      link
      zip
      street
      logo
      storefrontImage
      pickup
      delivery
      maxDays
    }
  }
`;
