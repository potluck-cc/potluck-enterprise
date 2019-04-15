import React, { Component } from "react";
import "./layout.scss";
import "./scss/fonts.scss";

import { Sidebar, Topbar } from "./layout";
import { Menu, Profile, Home, Orders } from "./pages";

import { BrowserRouter as Router, Route } from "react-router-dom";

const routes = [
  {
    title: "menu",
    path: "/",
    icon: "ContextMenu",
    exact: true,
    main: () => <Menu />
  },
  {
    title: "orders",
    path: "/orders",
    icon: "Shop",
    main: () => <Orders />
  },
  {
    title: "profile",
    path: "/profile",
    icon: "ContactCardSettings",
    main: () => <Profile />
  }
];

class App extends Component {
  state = {
    authed: false
  };

  _login = () => this.setState({ authed: true });

  render() {
    const { authed } = this.state;

    // return !authed ? (
    //   <Home login={this._login} />
    // ) : (
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
