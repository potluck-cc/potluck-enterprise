import React, { Component } from "react";
import "./layout.scss";
import "./scss/fonts.scss";

import { Sidebar, Topbar } from "./layout";
import { Menu, Profile, Home } from "./pages";

import { BrowserRouter as Router, Route } from "react-router-dom";

const routes = [
  // {
  //   path: "/",
  //   exact: true,
  //   title: "home",
  //   icon: "Dialpad",
  //   main: () => <Home />
  // },
  {
    title: "menu",
    path: "/menu",
    icon: "ContextMenu",
    main: () => <Menu />
  },
  {
    title: "profile",
    path: "/profile",
    icon: "ContactCardSettings",
    main: () => <Profile />
  }
];

class App extends Component {
  render() {
    return (
      <Router>
        <div className="app">
          <Topbar />
          <Sidebar routes={routes} />
          {routes.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              exact={route.exact}
              component={route.main}
            />
          ))}
        </div>
      </Router>
    );
  }
}

export default App;
