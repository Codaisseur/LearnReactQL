import gql from "graphql-tag";

export const setAuthenticatedMutation =  gql`
  mutation SetAuthenticated {
    setAuthenticated @client {
      authenticated
    }
  }
`;

export const signUpMutation = gql`
  mutation SignUp(
    $firstName: String!
    $lastName: String!
    $email: String!
    $password: String!
   ) {
    signUp(data: {
      first_name: $firstName
      last_name: $lastName
      email: $email
      password: $password
      password_confirmation: $password
    }) {
      id
      email
      profile {
        id
        first_name
        last_name
      }
    }
  }
`;

export interface ISignInInput {
  email?: string;
  password?: string;
}

export interface ISignInResponse {
  data: {
    signIn: {
      token: string;
    };
  };
}

export const signInMutation = gql`
  mutation SignIn(
    $email: String!
    $password: String!
   ) {
    signIn(data: {
      email: $email
      password: $password
    }) {
      token
    }
  }
`;
