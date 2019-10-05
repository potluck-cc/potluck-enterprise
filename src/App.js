import React, { useState, useEffect, Fragment } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import { Home } from "pages";
import { Signin } from "auth";
import Enterprise from "Enterprise";
import AppContext from "AppContext";

import { Spinner, SpinnerSize } from "office-ui-fabric-react/lib/Spinner";

import Amplify, { Auth } from "aws-amplify";
import config from "./aws-exports";

import "layout.scss";
import "scss/fonts.scss";

Amplify.configure(config);

export default function App() {
  const [initializing, isInitializing] = useState(true);
  const [authenticatedUser, setAuthenticatedUser] = useState(null);
  const [activeStore, setActiveStore] = useState(null);

  useEffect(() => {
    initialize();
  }, []);

  async function initialize() {
    try {
      const user = await Auth.currentAuthenticatedUser();

      if (user) {
        setAuthenticatedUser(user);
      } else {
        setAuthenticatedUser(null);
      }

      isInitializing(false);
    } catch (err) {
      isInitializing(false);
    }
  }

  if (initializing) {
    return <Spinner size={SpinnerSize.large} style={{ marginTop: 100 }} />;
  }

  if (!authenticatedUser && !initializing) {
    return <Signin initializeApp={initialize} />;
  }

  return (
    <Router>
      <AppContext.Provider
        value={{
          initializeApp: initialize,
          user: authenticatedUser,
          activeStore,
          setActiveStore,
          setAuthenticatedUser
        }}
      >
        <Fragment>
          <Route component={Home} path="/" exact />
          <Route component={Enterprise} path="/:id" />
        </Fragment>
      </AppContext.Provider>
    </Router>
  );
}
