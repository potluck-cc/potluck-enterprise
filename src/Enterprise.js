import React, { useContext, useEffect, useState, memo } from "react";
import { Route } from "react-router-dom";
import { Menu, Profile, Orders } from "pages";
import { Sidebar, Topbar } from "layout";
import {
  useLazyAppSyncQuery,
  OperationType,
  useAppSyncQuery
} from "@potluckmarket/ella";
import AppContext from "AppContext";
import OrderContext from "OrderContext";
import client from "client";
import GetDispensary from "api/queries/GetDispensary";
import { Spinner, SpinnerSize } from "office-ui-fabric-react/lib/Spinner";
import OrderSubscription from "api/subscriptions/OrderSubscription";

export default memo(function Enterprise({
  match: {
    params: { id }
  }
}) {
  const {
    activeStore,
    setActiveStore,
    user: { username }
  } = useContext(AppContext);

  const [orders, setOrders] = useState([]);
  const [orderCount, setOrderCount] = useState(0);

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
    {
      title: "orders",
      path: `/${id}/orders`,
      icon: "Shop",
      badge: true,
      main: () => <Orders />
    },
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

  const [orderSubscription] = useAppSyncQuery({
    client,
    operationType: "subscribe",
    document: OrderSubscription,
    variables: {
      storeId: id
    },
    next: ({ data: { onCreateOrder } }) => {
      if (window.location.pathname.includes("/orders")) {
        setOrders([onCreateOrder]);
      } else {
        setOrderCount(orderCount => orderCount + 1);
      }
    }
  });

  function clearOrderCount() {
    setOrderCount(0);
  }

  function clearOrders() {
    setOrders([]);
  }

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
    <OrderContext.Provider
      value={{
        orderCount,
        orders,
        clearOrderCount,
        clearOrders,
        setOrders,
        setOrderCount
      }}
    >
      <div className="app">
        <Topbar />
        <Sidebar routes={routes} orderCount={orderCount} />
        <Route path={`/${id}/menu`} exact component={Menu} />
        <Route path={`/${id}/orders`} exact component={Orders} />
        <Route path={`/${id}/settings`} exact component={Profile} />
      </div>
    </OrderContext.Provider>
  );
});
