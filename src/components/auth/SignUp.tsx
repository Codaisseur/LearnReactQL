import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import Paper from "@material-ui/core/Paper";
import withStyles, { WithStyles } from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";
import LockIcon from "@material-ui/icons/LockOutlined";
import * as React from "react";

const decorate = withStyles(({ palette, spacing }) => ({
  avatar: {
    backgroundColor: palette.secondary.main,
    margin: spacing.unit,
  },
  form: {
    marginTop: spacing.unit,
    width: "100%", // Fix IE11 issue.
  },
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

interface ISignUp {
  errors?: any;
}

const SignUp = decorate(({ classes, errors }: ISignUp & WithStyles<any>) => (
  <React.Fragment>
    <Paper className={classes.paper}>
      <Avatar className={classes.avatar}>
        <LockIcon />
      </Avatar>
      <Typography variant="headline">Sign in</Typography>
      <form className={classes.form}>
        <FormControl margin="normal" required fullWidth>
          {errors && errors.email && <InputLabel error>{errors.email}</InputLabel>}
          <InputLabel htmlFor="email">Email Address</InputLabel>
          <Input id="email" name="email" autoComplete="email" autoFocus />
        </FormControl>
        <FormControl margin="normal" required fullWidth>
          {errors && errors.password && <InputLabel error>{errors.password}</InputLabel>}
          <InputLabel htmlFor="password">Password</InputLabel>
          <Input
            name="password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
        </FormControl>
        <Button
          type="submit"
          fullWidth
          variant="raised"
          color="primary"
          className={classes.submit}
        >
          Sign in
        </Button>
      </form>
    </Paper>
  </React.Fragment>
));

export default SignUp;
