// Server entrypoint

// ----------------------------------------------------------------------------
// IMPORTS

/* NPM */
import "cross-fetch/polyfill";

import {
  createGenerateClassName,
  createMuiTheme,
  MuiThemeProvider,
} from "@material-ui/core/styles";

import { Context } from "koa";

import * as React from "react";
import { ApolloProvider, getDataFromTree } from "react-apollo";

// React utility to transform JSX to HTML (to send back to the client)
import * as ReactDOMServer from "react-dom/server";

// <Helmet> component for retrieving <head> section, so we can set page
// title, meta info, etc along with the initial HTML
import Helmet from "react-helmet";

import { SheetsRegistry } from "react-jss";
import JssProvider from "react-jss/lib/JssProvider";

import { StaticRouter } from "react-router";

/* Local */
import Root from "@/components/root";
import { createClient } from "@/graphql/apollo";
import Output from "@/lib/output";
import defaultTheme from "@/themes/default";
import Html from "@/views/ssr";

// ----------------------------------------------------------------------------

// Types
export interface IRouterContext {
  status?: number;
  url?: string;
}

export default function(output: Output) {

  // Create Koa middleware to handle React requests
  return async (ctx: Context) => {

    // Create a new Apollo client
    const client = createClient(ctx);

    // Create a sheetsRegistry instance.
    const sheetsRegistry = new SheetsRegistry();

    // Create a sheetsManager instance.
    const sheetsManager = new Map();

    // Create a theme instance.
    const theme = createMuiTheme(defaultTheme);

    // Create a fresh 'context' for React Router
    const routerContext: IRouterContext = {};

    // Create a new class name generator.
    const generateClassName = createGenerateClassName();

    const components = (
      <JssProvider registry={sheetsRegistry} generateClassName={generateClassName}>
        <MuiThemeProvider theme={theme} sheetsManager={sheetsManager}>
          <ApolloProvider client={client}>
            <StaticRouter location={ctx.request.url} context={routerContext}>
              <Root />
            </StaticRouter>
          </ApolloProvider>
        </MuiThemeProvider>
      </JssProvider>
    );

    // Render the Apollo tree
    await getDataFromTree(components);

    // Handle redirects
    if ([301, 302].includes(routerContext.status!)) {
      // 301 = permanent redirect, 302 = temporary
      ctx.status = routerContext.status!;

      // Issue the new `Location:` header
      ctx.redirect(routerContext.url!);

      // Return early -- no need to set a response body
      return;
    }

    // Handle 404 Not Found
    if (routerContext.status === 404) {
      // By default, just set the status code to 404. You can
      // modify this section to do things like log errors to a
      // third-party, or redirect users to a dedicated 404 page

      ctx.status = 404;
      ctx.body = "Not found";

      return;
    }

    // Create the React render via React Helmet
    const reactRender = ReactDOMServer.renderToString(
      <Html
        css={output.client.main("css")!}
        helmet={Helmet.renderStatic()}
        js={output.client.main("js")!}
        styles={sheetsRegistry.toString()}
        window={{
          __APOLLO_STATE__: client.extract(),
        }}>
        {components}
      </Html>,
    );

    // Set the return type to `text/html`, and stream the response back to
    // the client
    ctx.type = "text/html";
    ctx.body = `<!DOCTYPE html>${reactRender}`;
  };
}
