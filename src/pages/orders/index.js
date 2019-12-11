import React, { Fragment, useContext, useState, useEffect } from "react";
import AppContext from "AppContext";
import OrderContext from "OrderContext";

import { useLazyAppSyncQuery } from "@potluckmarket/ella";
import "./orders.scss";

import Alert from "react-s-alert";
import "react-s-alert/dist/s-alert-default.css";
import "react-s-alert/dist/s-alert-css-effects/jelly.css";

import { Spinner, SpinnerSize } from "office-ui-fabric-react/lib/Spinner";

import InfiniteScroll from "react-infinite-scroll-component";

import OrderHeader from "./OrderHeader";
import OrderCell from "./OrderCell";
import OrderModule from "./OrderModule";
import OrderModuleHeader from "./OrderModuleHeader";
import {
  isMobile,
  isTablet,
  isIOS,
  isMobileSafari,
  isIOS13
} from "react-device-detect";

import client from "client";
import GetOrdersByStore from "api/queries/GetOrdersByStore";
import GetOrdersByStoreWithFilter from "api/queries/GetOrdersByStoreAndDateWithStatusFilter";
import GetOrdersByStoreAndCode from "api/queries/GetOrdersByStoreAndCode";
import UpdateOrder from "api/mutations/UpdateOrder";

import { Panel, PanelType } from "office-ui-fabric-react/lib/Panel";

import moment from "moment";

const initialDateRange = {
  from: moment()
    .startOf("week")
    .unix(),
  to: moment()
    .endOf("week")
    .unix()
};

function Orders() {
  const appContext = useContext(AppContext);
  const orderContext = useContext(OrderContext);
  const [status, setStatus] = useState(null);
  const [refetch, isRefetch] = useState(false);
  const [activeSearchCode, setActiveSearchCode] = useState(null);
  const [orderCards, setOrderCards] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState({});
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [dateRange, setDateRange] = useState(initialDateRange);
  const mobileView = isMobile || isTablet || isIOS13;

  const [listOrdersRes, fetchOrdersLoading, fetchOrders] = useLazyAppSyncQuery({
    client,
    operationType: "query",
    document: GetOrdersByStore,
    fetchPolicy: "no-cache",
    handleError: () => renderErrorAlert()
  });

  const [
    listOrdersWithStatusFilterRes,
    loadingFilteredOrders,
    fetchOrdersWithStatusFilter
  ] = useLazyAppSyncQuery({
    client,
    operationType: "query",
    document: GetOrdersByStoreWithFilter,
    fetchPolicy: "network-only",
    handleError: () => renderErrorAlert()
  });

  const [
    listOrdersByCodeRes,
    loadingListOrdersByCode,
    fetchOrdersByCode
  ] = useLazyAppSyncQuery({
    client,
    operationType: "query",
    document: GetOrdersByStoreAndCode,
    fetchPolicy: "network-only",
    handleError: () => renderErrorAlert()
  });

  const [updateOrderRes, updateOrderLoading, updateOrder] = useLazyAppSyncQuery(
    {
      client,
      operationType: "mutation",
      document: UpdateOrder,
      handleError: () => renderErrorAlert()
    }
  );

  function renderErrorAlert(
    alertMessage = "Something went wrong! Please try again!"
  ) {
    Alert.error(alertMessage, {
      position: "top-right",
      effect: "jelly",
      offset: 100,
      timeout: "none"
    });
  }

  function fetchMoreOrders() {
    if (
      listOrdersRes.getOrdersByStoreAndDate &&
      listOrdersRes.getOrdersByStoreAndDate.nextToken
    ) {
      const { from, to } = dateRange;

      const variables = {
        from,
        to,
        status,
        nextToken: listOrdersRes.getOrdersByStoreAndDate.nextToken,
        fetchPolicy: "no-cache"
      };

      fetchOrders(variables);
    }
  }

  function initializeOrderPage() {
    const { from, to } = dateRange;

    fetchOrders({
      storeId: appContext.activeStore.id,
      from,
      to,
      nextToken: null
    });
  }

  function initializeOrderPageWithFilter() {
    const { to, from } = dateRange;

    fetchOrdersWithStatusFilter({
      storeId: appContext.activeStore.id,
      nextToken: null,
      to,
      from,
      status
    });
  }

  function createOrderCards(orders = []) {
    let newOrderCards = [];

    orders.map(order => {
      return newOrderCards.push(
        <OrderCell
          key={order.id}
          order={order}
          selected={order.id === selectedOrder.id}
          _onClick={() => {
            if (mobileView) {
              setSelectedOrder(order);
              setIsPanelOpen(true);
            } else {
              setSelectedOrder(order);
            }
          }}
        />
      );
    });

    return newOrderCards;
  }

  function onFetchOrders({ update = false, orders }) {
    if (orders) {
      setOrderCards(currentOrderCards => {
        if (refetch || update) {
          return createOrderCards(orders);
        }

        return [...currentOrderCards, ...createOrderCards(orders)];
      });
    }
  }

  function onUpdateOrder(order) {
    if (Object.keys(order).length) {
      setOrderCards(currentOrderCards =>
        currentOrderCards.map(orderCard => {
          if (orderCard.key === order.id) {
            return (
              <OrderCell
                key={order.id}
                order={order}
                selected={order.id === selectedOrder.id}
                _onClick={() => {
                  if (isMobile) {
                    setSelectedOrder(order);
                    setIsPanelOpen(true);
                  } else {
                    setSelectedOrder(order);
                  }
                }}
              />
            );
          } else {
            return {
              ...orderCard,
              props: {
                ...orderCard.props,
                selected: false
              }
            };
          }
        })
      );

      setSelectedOrder(order);
    }
  }

  function addIncomingOrdersFromSubscription() {
    if (
      status !== "completed" &&
      status !== "accepted" &&
      status !== "rejected" &&
      orderContext.orders.length &&
      Object.values(dateRange)[0] === Object.values(initialDateRange)[0] &&
      Object.values(dateRange)[1] === Object.values(initialDateRange)[1]
    ) {
      const incomingSubscriptionOrders = createOrderCards(orderContext.orders);
      setOrderCards(currentOrderCards => [
        ...incomingSubscriptionOrders,
        ...currentOrderCards
      ]);
    }
  }

  useEffect(() => {
    orderContext.clearOrders();
    orderContext.clearOrderCount();
  }, []);

  useEffect(() => {
    initializeOrderPage();
  }, []);

  useEffect(() => {
    if (updateOrderRes && updateOrderRes.updateOrder) {
      onUpdateOrder(updateOrderRes.updateOrder);
    }
  }, [updateOrderRes]);

  useEffect(() => {
    addIncomingOrdersFromSubscription();
  }, [orderContext.orders]);

  useEffect(() => {
    if (Object.keys(onFetchOrders).length) {
      onFetchOrders({ update: true });
      isRefetch(false);
    }

    if (Object.keys(selectedOrder) && !mobileView) {
      onUpdateOrder(selectedOrder);
    }
  }, [selectedOrder]);

  useEffect(() => {
    if (status) {
      isRefetch(true);
      initializeOrderPageWithFilter();
    }
  }, [status]);

  useEffect(() => {
    if (
      listOrdersWithStatusFilterRes &&
      listOrdersWithStatusFilterRes.getOrdersByStoreAndDate &&
      listOrdersWithStatusFilterRes.getOrdersByStoreAndDate.items &&
      loadingFilteredOrders === false
    ) {
      onFetchOrders({
        orders: listOrdersWithStatusFilterRes.getOrdersByStoreAndDate.items
      });

      isRefetch(false);
    }
  }, [listOrdersWithStatusFilterRes, fetchOrdersLoading]);

  useEffect(() => {
    if (
      listOrdersRes &&
      listOrdersRes.getOrdersByStoreAndDate &&
      listOrdersRes.getOrdersByStoreAndDate.items &&
      fetchOrdersLoading === false
    ) {
      onFetchOrders({
        orders: listOrdersRes.getOrdersByStoreAndDate.items
      });

      isRefetch(false);
    }
  }, [listOrdersRes, fetchOrdersLoading]);

  useEffect(() => {
    isRefetch(true);

    if (status) {
      initializeOrderPageWithFilter();
    } else {
      initializeOrderPage();
    }
  }, [dateRange]);

  useEffect(() => {
    if (activeSearchCode) {
      isRefetch(true);

      fetchOrdersByCode({
        storeId: appContext.activeStore.id,
        code: activeSearchCode
      });
    }
  }, [activeSearchCode]);

  useEffect(() => {
    if (
      listOrdersByCodeRes &&
      listOrdersByCodeRes.getOrderByStoreAndCode &&
      loadingListOrdersByCode === false
    ) {
      onFetchOrders({
        orders: [listOrdersByCodeRes.getOrderByStoreAndCode]
      });

      isRefetch(false);
    }
  }, [listOrdersByCodeRes, loadingListOrdersByCode]);

  return (
    <div className={mobileView ? "orders  mobile-view" : "orders"}>
      <div className="orders-list" id="ordersList">
        <OrderHeader
          onCheckboxChange={setStatus}
          setStatus={setStatus}
          selectedCheckbox={status}
          setActiveSearchCode={setActiveSearchCode}
          setDateRange={setDateRange}
        />

        <InfiniteScroll
          hasMore={
            listOrdersRes && listOrdersRes.getOrdersByStoreAndDate
              ? listOrdersRes.getOrdersByStoreAndDate.nextToken
              : false
          }
          dataLength={orderCards.length}
          scrollableTarget="ordersList"
          scrollThreshold={0.5}
          next={() => fetchMoreOrders()}
          loader={
            <Spinner
              size={SpinnerSize.large}
              style={{
                marginTop: 70,
                width: "100%",
                height: 196
              }}
            />
          }
        >
          {refetch
            ? [
                <Spinner
                  size={SpinnerSize.large}
                  style={{
                    marginTop: 100,
                    width: "100%",
                    height: 196
                  }}
                />
              ]
            : orderCards}
        </InfiniteScroll>
      </div>

      <div
        className="selected-order"
        style={{
          border: Object.keys(selectedOrder).length ? null : "none",
          boxShadow: Object.keys(selectedOrder).length ? null : "none",
          display: mobileView ? "none" : null
        }}
      >
        {Object.keys(selectedOrder).length ? (
          !mobileView ? (
            <Fragment>
              <OrderModuleHeader close={() => setSelectedOrder({})} />
              <OrderModule
                order={selectedOrder}
                time={selectedOrder.time}
                updateOrder={updateOrder}
                updatingOrder={updateOrderLoading}
                mobileView={mobileView}
              />
            </Fragment>
          ) : (
            <Panel
              closeButtonAriaLabel="Close"
              isOpen={isPanelOpen}
              onDismiss={() => {
                setIsPanelOpen(false);
                setSelectedOrder({});
              }}
              type={PanelType.large}
              className="order-panel"
              isLightDismiss
            >
              <div className="selected-order selected-order-mobile">
                <OrderModule
                  order={selectedOrder}
                  time={selectedOrder.time}
                  updateOrder={updateOrder}
                  updatingOrder={updateOrderLoading}
                  mobileView={mobileView}
                />
              </div>
            </Panel>
          )
        ) : null}
      </div>
      <Alert stack={{ limit: 1 }} />
    </div>
  );
}

export default Orders;
