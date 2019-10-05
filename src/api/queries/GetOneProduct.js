import gql from "graphql-tag";

export default gql`
  query ListProducts($slug: String!) {
    getProduct(slug: $slug) {
      slug
    }
  }
`;
