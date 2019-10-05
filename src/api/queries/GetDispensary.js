import gql from "graphql-tag";

export default gql`
  query GetDispensary($companyId: ID!, $id: ID!) {
    getStore(id: $id, companyId: $companyId) {
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
