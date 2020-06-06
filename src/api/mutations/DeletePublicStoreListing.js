import gql from "graphql-tag";

export default gql`
  mutation DeletePublicListing($id: ID!, $companyId: ID!) {
    deletePublicStoreListing(input: { id: $id, companyId: $companyId }) {
      message
    }
  }
`;
