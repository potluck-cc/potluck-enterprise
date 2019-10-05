import gql from "graphql-tag";

export default gql`
  mutation CreateProduct($name: String!, $slug: String!) {
    createProduct(input: { name: $name, slug: $slug }) {
      id
      name
      slug
    }
  }
`;
