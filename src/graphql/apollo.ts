// Apollo GraphQL client

// ----------------------------------------------------------------------------
// IMPORTS

/* NPM */
import { InMemoryCache, NormalizedCacheObject } from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";
import { ApolloLink } from "apollo-link";
import { setContext } from "apollo-link-context";
import { onError } from "apollo-link-error";
import { HttpLink } from "apollo-link-http";
import { Context } from "koa";

/* Local */
import createState from "./state";

export const API_URL = process.env.NODE_ENV === "production" ? "https://crystal.codaisseur.com" : "http://localhost:4000";
export const JWT_TOKEN_KEY = "CodaisseurJWT";

// ----------------------------------------------------------------------------

export function createClient(ctx?: Context): ApolloClient<NormalizedCacheObject> {

  // Create the cache first, which we'll share across Apollo tooling.
  // This is an in-memory cache. Since we'll be calling `createClient` on
  // universally, the cache will survive until the HTTP request is
  // responded to (on the server) or for the whole of the user's visit (in
  // the browser)
  const cache = new InMemoryCache();

  // If we're in the browser, we'd have received initial state from the
  // server. Restore it, so the client app can continue with the same data.
  if (!SERVER) {
    cache.restore((window as any).__APOLLO_STATE__);
  }

  // Return a new Apollo Client back, with the cache we've just created,
  // and an array of 'links' (Apollo parlance for GraphQL middleware)
  // to tell Apollo how to handle GraphQL requests
  return new ApolloClient({
    cache,
    link: ApolloLink.from([

      // General error handler, to log errors back to the console.
      // Replace this in production with whatever makes sense in your
      // environment. Remember you can use the global `SERVER` variable to
      // determine whether you're running on the server, and record errors
      // out to third-party services, etc
      onError(({ graphQLErrors, networkError }) => {
        if (graphQLErrors) {
          graphQLErrors.map(({ message, locations, path }) =>
            console.log(
              `[GraphQL error]: Message: ${message}, Location: ${JSON.stringify(locations)}, Path: ${path}`,
            ),
          );
        }
        if (networkError) {
          console.log(`[Network error]: ${networkError}`);
        }
      }),

      setContext(() => {
        let token: string | null = null;

        if (SERVER) {
          const authorization = ctx &&
            ctx.req.headers.authorization &&
            ctx.req.headers.authorization.match(/Bearer (.*)/);

          if (authorization) {
            token = authorization[1];
          }
        }

        if (!SERVER) {
          token = window.localStorage.getItem(JWT_TOKEN_KEY);
        }

        if (token) {
          console.log(token);

          return {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          };
        }

        return {};
      }),

      // Connect local Apollo state. This is our primary mechanism for
      // managing 'flux'/local app data, in lieu of Redux or MobX
      createState(cache),

      new HttpLink({
        credentials: "same-origin",
        uri: API_URL,
      }),
    ]),
    // On the server, enable SSR mode
    ssrMode: SERVER,
  });
}
