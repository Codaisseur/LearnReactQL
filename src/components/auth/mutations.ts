import gql from "graphql-tag";

export default gql`
  mutation SetAuthenticated {
    setAuthenticated @client {
      authenticated
    }
  }
`;
