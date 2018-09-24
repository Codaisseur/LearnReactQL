// Client entry point

// ----------------------------------------------------------------------------
// IMPORTS

/* NPM */

import {
  createGenerateClassName,
  createMuiTheme,
  MuiThemeProvider,
} from "@material-ui/core/styles";

// Create browser history, for navigation a la single page apps
import createBrowserHistory from "history/createBrowserHistory";

// React, our UI engine
import * as React from "react";

// HOC for enabling Apollo GraphQL `<Query>` and `<Mutation>`
import { ApolloProvider } from "react-apollo";

// Attach React to the browser DOM
import * as ReactDOM from "react-dom";

import JssProvider from "react-jss/lib/JssProvider";

// Single page app routing
import { Router } from "react-router-dom";

/* Local */

// Our main component, and the starting point for server/browser loading
import Root from "@/components/root";

// Helper function that creates a new Apollo client per request
import { createClient } from "@/graphql/apollo";

// ... and the actual Styled Components theme
import defaultTheme from "@/themes/default";

// ----------------------------------------------------------------------------

// Create Apollo client
const client = createClient();

// Create a browser history
const history = createBrowserHistory();

// Create a theme
const theme = createMuiTheme(defaultTheme);

// Create a new class name generator.
const generateClassName = createGenerateClassName();

class Main extends React.Component {
  // Remove the server-side injected CSS.
  public componentDidMount() {
    const jssStyles = document.getElementById("jss-server-side");
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
  }

  public render() {
    return <Root />;
  }
}

// Render
ReactDOM.hydrate(
  <JssProvider generateClassName={generateClassName}>
    <MuiThemeProvider theme={theme}>
    <ApolloProvider client={client}>
      <Router history={history}>
        <Main />
      </Router>
    </ApolloProvider>
    </MuiThemeProvider>
  </JssProvider>,
  document.getElementById("root"),
);
