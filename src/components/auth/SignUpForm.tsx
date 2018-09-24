import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import withStyles, { WithStyles } from "@material-ui/core/styles/withStyles";
import * as React from "react";
import { Mutation, MutationFn } from "react-apollo";

import { setAuthenticatedMutation, signInMutation, signUpMutation } from "@/components/auth/mutations";
import { storeToken } from "@/graphql/apollo";

const decorate = withStyles(({ spacing }) => ({
  paper: {
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    marginTop: spacing.unit * 8,
    padding: `${spacing.unit * 2}px ${spacing.unit * 3}px ${spacing.unit * 3}px`,
  },
  submit: {
    marginTop: spacing.unit * 3,
  },
}));

interface ISignUpForm {
  errors?: any;
  onSubmit: MutationFn;
  setAuthenticated: MutationFn;
  signIn: MutationFn;
}

interface ISignUpFormState {
  email?: string;
  firstName?: string;
  lastName?: string;
  password?: string;
}

const SignUpForm = decorate(
  class extends React.Component<ISignUpForm & WithStyles<any>, ISignUpFormState> {

  public state: ISignUpFormState = {
    email: "",
    firstName: "",
    lastName: "",
    password: "",
  };

  public handleSubmit = (event: any) => {
    event.preventDefault();

    const { onSubmit, setAuthenticated, signIn } = this.props;
    const { email, firstName, lastName, password } = this.state;

    onSubmit({
      variables: {
        email,
        firstName,
        lastName,
        password,
      },
    })
      .then(() => (
        signIn({
          variables: {
            email,
            password,
          },
        })
      ))
      .then((res: any) => storeToken(res.data.signIn.token))
      .then(() => setAuthenticated())
      .catch(console.error);
  }

  public handleChange = (field: "firstName" | "lastName" | "email" | "password") => (event: any) => {
    this.setState({
      [field]: event.target.value,
    });
  }

  public render() {
    const { classes } = this.props;
    const { email, firstName, lastName, password } = this.state;

    return (
      <form className={classes.form} onSubmit={this.handleSubmit}>
        <FormControl margin="normal" required fullWidth>
          <InputLabel htmlFor="firstName">Name</InputLabel>
          <Input
            id="firstName"
            name="firstName"
            autoComplete="firstName"
            autoFocus
            value={firstName}
            onChange={this.handleChange("firstName")}
          />
        </FormControl>
        <FormControl margin="normal" required fullWidth>
          <InputLabel htmlFor="lastName">Last Name</InputLabel>
          <Input
            id="lastName"
            name="lastName"
            autoComplete="lastName"
            value={lastName}
            onChange={this.handleChange("lastName")}
          />
        </FormControl>
        <FormControl margin="normal" required fullWidth>
          <InputLabel htmlFor="email">Email Address</InputLabel>
          <Input
            id="email"
            name="email"
            autoComplete="email"
            type="email"
            value={email}
            onChange={this.handleChange("email")}
          />
        </FormControl>
        <FormControl margin="normal" required fullWidth>
          <InputLabel htmlFor="password">Password</InputLabel>
          <Input
            name="password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={this.handleChange("password")}
          />
        </FormControl>
        <Button
          type="submit"
          fullWidth
          variant="raised"
          color="primary"
          className={classes.submit}
        >
          Sign Up
        </Button>
      </form>
    );
  }
});

const mapMutationsToProps = (signUp: MutationFn<any>) => (
  <Mutation mutation={signInMutation}>
    {(signIn: MutationFn) => (
      <Mutation mutation={setAuthenticatedMutation}>
        {(setAuthenticated: MutationFn<any>) => (
          <SignUpForm onSubmit={signUp} setAuthenticated={setAuthenticated} signIn={signIn} />
        )}
      </Mutation>
    )}
  </Mutation>
);

export default () => (
  <Mutation mutation={signUpMutation}>{mapMutationsToProps}</Mutation>
);
