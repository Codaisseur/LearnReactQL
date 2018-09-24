import gql from "graphql-tag";

export const authQuery = gql`
{
  state @client {
    authenticated
  }
}
`;

export const meQuery = gql`
  query {
    me {
      id
      profile {
        id
        first_name
        last_name
      }
      student
      admin
      teacher
    }
  }
`;
