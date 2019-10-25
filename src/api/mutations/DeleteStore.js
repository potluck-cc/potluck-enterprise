import gql from "graphql-tag";

export default gql`
  mutation DeleteStore($companyId: ID!, $id: ID!) {
    deleteStore(input: { companyId: $companyId, id: $id }) {
      id
    }
  }
`;
