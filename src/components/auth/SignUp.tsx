import Avatar from "@material-ui/core/Avatar";
import Paper from "@material-ui/core/Paper";
import withStyles, { WithStyles } from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";
import LockIcon from "@material-ui/icons/LockOutlined";
import * as React from "react";

import SignUpForm from "@/components/auth/SignUpForm";

const decorate = withStyles(({ palette, spacing }) => ({
  avatar: {
    backgroundColor: palette.secondary.main,
    margin: spacing.unit,
  },
  paper: {
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    marginTop: spacing.unit * 8,
    padding: `${spacing.unit * 2}px ${spacing.unit * 3}px ${spacing.unit * 3}px`,
  },
}));

interface ISignUp {
  errors?: any;
}

const SignUp = decorate(({ classes }: ISignUp & WithStyles<any>) => (
  <React.Fragment>
    <Paper className={classes.paper}>
      <Avatar className={classes.avatar}>
        <LockIcon />
      </Avatar>
      <Typography variant="headline">Sign up</Typography>
      <SignUpForm />
    </Paper>
  </React.Fragment>
));

export default SignUp;