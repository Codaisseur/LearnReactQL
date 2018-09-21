// Root entry point

// ----------------------------------------------------------------------------
// IMPORTS

/* NPM */
import CssBaseline from "@material-ui/core/CssBaseline";
import withStyles, { WithStyles } from "@material-ui/core/styles/withStyles";
import * as React from "react";
import Helmet from "react-helmet";
import { hot } from "react-hot-loader";
import { Route, Switch } from "react-router-dom";

/* Local */

// Styles - import for side-effects
import "@/global/styles";

// Components
import ScrollTop from "@/components/helpers/scrollTop";

// Routes
import routes from "@/data/routes";

// ----------------------------------------------------------------------------
const decorate = withStyles(({ spacing, breakpoints }) => ({
  layout: {
    display: "block", // Fix IE11 issue.
    marginLeft: spacing.unit * 3,
    marginRight: spacing.unit * 3,
    [breakpoints.up(400 + spacing.unit * 3 * 2)]: {
      marginLeft: "auto",
      marginRight: "auto",
      width: 400,
    },
    width: "auto",
  },
}));

const Root = decorate(({ classes }: WithStyles<any>) => (
  <React.Fragment>
    <CssBaseline />
    <Helmet>
      <title>Codaisseur - Admissions</title>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500" />
    </Helmet>
    <ScrollTop>
      <main className={classes.layout}>
        <Switch>
          {routes.map(route => (
            <Route key={route.path} {...route} />
          ))}
        </Switch>
      </main>
    </ScrollTop>
  </React.Fragment>
));

export default hot(module)(Root);
