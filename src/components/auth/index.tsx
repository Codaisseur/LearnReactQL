import * as React from "react";
import { Query } from "react-apollo";
import { Redirect } from "react-router";

import { authQuery } from "@/components/auth/queries";
import SignUp from "@/components/auth/SignUp";

interface IAuthContainer {
  loading?: boolean;
  signedIn?: boolean;
  error?: any;
}

export class AuthContainer extends React.Component<IAuthContainer> {
  public render() {
    if (this.props.signedIn) {
      return <Redirect to="/apply" />;
    }

    if (this.props.error) {
      return <p>Error!</p>;
    }

    return <SignUp />;
  }
}

const mapDataToProps = ({ data, loading, error }: any) => {
  const props: IAuthContainer = {
    error,
    loading,
    signedIn: data && data.state.authenticated,
  };

  return <AuthContainer { ...props } />;
};

export default () => (
  <Query errorPolicy="ignore" query={authQuery}>
    {mapDataToProps}
  </Query>
);
