import React, { useState } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { useAppSyncQuery } from "@potluckmarket/ella";
import moment from "moment";

import "layout.scss";
import "scss/fonts.scss";

import AppContext from "AppContext";
import { Sidebar } from "layout";
import { Menu, Profile, Orders } from "pages";

import client from "client";
import OrderSubscription from "api/subscriptions/OrderSubscription";

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
    badge: true,
    main: () => <Orders />
  },
  {
    title: "profile",
    path: "/profile",
    icon: "ContactCardSettings",
    main: () => <Profile />
  }
];

function App() {
  const [newOrders, setOrders] = useState([]);
  const [orderCount, setOrderCount] = useState(0);

  const [orderSubscription] = useAppSyncQuery({
    client,
    operationType: "subscribe",
    document: OrderSubscription,
    variables: {
      storeID: "851e40a3-b63b-4f7d-be37-3cf4065c08b5",
      status: "new",
      date: moment().format("M/D/YY")
    },
    next: ({ data: { onCreateOrder } }) => {
      if (window.location.pathname === "/orders") {
        setOrders([onCreateOrder]);
      } else {
        setOrderCount(orderCount => orderCount + 1);
      }
    }
  });

  function clearOrderCount() {
    setOrderCount(0);
  }

  function clearNewOrders() {
    setOrders([]);
  }

  function killNewOrdersSubscription() {
    if (orderSubscription) {
      orderSubscription.unsubscribe();
    }
  }

  return (
    <Router>
      <AppContext.Provider
        value={{
          orderCount,
          orders: newOrders,
          clearOrderCount,
          clearNewOrders,
          killNewOrdersSubscription
        }}
      >
        <div className="app">
          {/* <Topbar /> */}
          <Sidebar routes={routes} orderCount={orderCount} />
          {routes.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              exact={route.exact}
              component={route.main}
            />
          ))}
        </div>
      </AppContext.Provider>
    </Router>
  );
}

export default App;
