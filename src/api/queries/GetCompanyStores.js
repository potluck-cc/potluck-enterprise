import gql from "graphql-tag";

export default gql`
  query GetStores($companyId: ID!) {
    getCompanyStores(companyId: $companyId) {
      items {
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
  }
`;
