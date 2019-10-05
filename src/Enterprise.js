import React, { useContext, useEffect } from "react";
import { Route } from "react-router-dom";
import { Menu, Profile } from "pages";
import { Sidebar, Topbar } from "layout";
import { useLazyAppSyncQuery, OperationType } from "@potluckmarket/ella";
import AppContext from "AppContext";
import client from "client";
import GetDispensary from "api/queries/GetDispensary";
import { Spinner, SpinnerSize } from "office-ui-fabric-react/lib/Spinner";
// import OrderSubscription from "api/subscriptions/OrderSubscription";
// import moment from "moment";

export default function Enterprise({
  match: {
    params: { id }
  }
}) {
  const {
    activeStore,
    setActiveStore,
    user: { username }
  } = useContext(AppContext);

  const [res, loading, fetchDispensary] = useLazyAppSyncQuery({
    client,
    document: GetDispensary,
    fetchPolicy: "network-only",
    operationType: OperationType.query
  });

  const routes = [
    {
      title: "menu",
      path: `/${id}/menu`,
      icon: "ContextMenu",
      exact: true,
      main: () => <Menu />
    },
    // {
    //   title: "orders",
    //   path: `/${id}/orders`,
    //   icon: "Shop",
    //   badge: true,
    //   main: () => <Orders />
    // },
    {
      title: "settings",
      path: `/${id}/settings`,
      icon: "ContactCardSettings",
      main: () => <Profile />
    }
  ];

  useEffect(() => {
    if (!activeStore) {
      fetchDispensary({ id, companyId: username });
    }
  }, []);

  useEffect(() => {
    if (res && Object.keys(res).length && res["getStore"]) {
      const { getStore } = res;

      setActiveStore(getStore);
    }
  }, [res]);

  // const [newOrders, setOrders] = useState([]);

  // const [orderCount, setOrderCount] = useState(0);

  // const [orderSubscription] = useAppSyncQuery({
  //   client,
  //   operationType: "subscribe",
  //   document: OrderSubscription,
  //   variables: {
  //     storeID: storeId,
  //     status: "new",
  //     date: moment().format("M/D/YY")
  //   },
  //   next: ({ data: { onCreateOrder } }) => {
  //     if (window.location.pathname === "/orders") {
  //       setOrders([onCreateOrder]);
  //     } else {
  //       setOrderCount(orderCount => orderCount + 1);
  //     }
  //   }
  // });

  // function clearOrderCount() {
  //   setOrderCount(0);
  // }

  // function clearNewOrders() {
  //   setOrders([]);
  // }

  // function killNewOrdersSubscription() {
  //   if (orderSubscription) {
  //     orderSubscription.unsubscribe();
  //   }
  // }

  if (loading || !activeStore) {
    return (
      <div className="spinner-container">
        <Spinner size={SpinnerSize.large} style={{ marginTop: 100 }} />
      </div>
    );
  }

  return (
    <div className="app">
      <Topbar />
      {/* <Sidebar routes={routes} orderCount={orderCount} /> */}
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
  );
}
