// Local GraphQL state

// ----------------------------------------------------------------------------
// IMPORTS

/* NPM */
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloLink } from "apollo-link";
import { ClientStateConfig, withClientState } from "apollo-link-state";

/* Local */

// Queries
import { authQuery } from "@/components/auth/queries";

// ----------------------------------------------------------------------------

// Types

/* STATE */
export interface IState {
  authenticated: boolean;
}

// 'Root', which contains the 'State' key
export interface IRoot {
  state: IState;
}

export default function createState(cache: InMemoryCache): ApolloLink {

  // Helper function to retrieve the state from cache
  function getState(query: any): IState {
    return cache.readQuery<IRoot>({ query }).state;
  }

  // Helper function to write data back to the cache
  function writeState(state: IState) {
    return cache.writeData({ data: { state } });
  }

  const opt: ClientStateConfig = {
    cache,
    resolvers: {
      Mutation: {

        setAuthenticated() {

          const state = getState(authQuery);

          // Create new state. Note that we're assigning this to a new
          // constant, and not simply incrementing the existing `count`
          // key on the state we retrieved. We use this immutable pattern
          // so Apollo can see that we have a brand new object to write
          // to the cache
          const newState = {
            ...state,
            authenticated: true,
          };

          // Write the new count var to the cache
          writeState(newState);

          // ... and return it back to the calling function, which will
          // then become our response data
          return newState;
        },
      },
    },
  };

  if (SERVER) {
    opt.defaults = {
      state: {
        __typename: "State",
        authenticated: false,
      },
    } as IRoot;
  }

  return withClientState(opt);
}
