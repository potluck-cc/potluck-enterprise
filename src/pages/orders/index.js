import React, { Fragment, useContext, useState, useEffect } from "react";
import AppContext from "AppContext";

import { useLazyAppSyncQuery, useTime } from "@potluckmarket/ella";
import "./orders.scss";

import Alert from "react-s-alert";
import "react-s-alert/dist/s-alert-default.css";
import "react-s-alert/dist/s-alert-css-effects/jelly.css";

import { Spinner, SpinnerSize } from "office-ui-fabric-react/lib/Spinner";

import InfiniteScroll from "react-infinite-scroll-component";

import OrderHeader from "./OrderHeader";
import OrderCell from "./OrderCell";
import OrderModule from "./OrderModule";
import OrderDetails from "./OrderDetails";

import client from "client";
import ListOrders from "api/queries/ListOrders";
import UpdateOrder from "api/mutations/UpdateOrder";

const useForceUpdate = () => useState()[1];

function Orderss() {
  const appContext = useContext(AppContext);

  const [status, setStatus] = useState("new");
  const [refetch, isRefetch] = useState(false);
  const [orderCards, setOrderCards] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState({});
  const [date, omit, todayAsAJSDate, { selectDate }] = useTime();
  const [selectedJSDate, setJSDate] = useState(todayAsAJSDate);

  const forceUpdate = useForceUpdate();

  const [listOrdersRes, fetchOrdersLoading, fetchOrders] = useLazyAppSyncQuery({
    client,
    operationType: "query",
    document: ListOrders,
    fetchPolicy: "no-cache",
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
    if (listOrdersRes.listOrders && listOrdersRes.listOrders.nextToken) {
      const variables = {
        date,
        status,
        nextToken: listOrdersRes.listOrders.nextToken,
        fetchPolicy: "no-cache"
      };

      fetchOrders(variables);
    }
  }

  function initializeOrderPage() {
    fetchOrders({ date, status, nextToken: null });
    appContext.clearNewOrders();
    appContext.clearOrderCount();
  }

  function createOrderCards(orders = []) {
    let newOrderCards = [];

    orders.map(order => {
      return newOrderCards.push(
        <OrderCell
          key={order.id}
          order={order}
          selected={order.id === selectedOrder.id}
          _onClick={() => setSelectedOrder(order)}
        />
      );
    });

    return newOrderCards;
  }

  function onFetchOrders(update = false) {
    if (
      listOrdersRes &&
      listOrdersRes.listOrders &&
      listOrdersRes.listOrders.items
    ) {
      setOrderCards(currentOrderCards => {
        if (refetch || update) {
          return createOrderCards(listOrdersRes.listOrders.items);
        }

        return [
          ...currentOrderCards,
          ...createOrderCards(listOrdersRes.listOrders.items)
        ];
      });
    }
  }

  function onUpdateOrder() {
    if (Object.keys(updateOrderRes).length) {
      setOrderCards(currentOrderCards =>
        currentOrderCards.filter(
          orderCard => orderCard.key !== updateOrderRes.updateOrder.id
        )
      );
    }

    setSelectedOrder({});
  }

  function onSelectDate(date) {
    selectDate(date);
    setJSDate(date);
  }

  function addIncomingOrdersFromSubscription() {
    if (status === "new" && selectedJSDate === todayAsAJSDate) {
      const incomingSubscriptionOrders = createOrderCards(appContext.orders);

      if (incomingSubscriptionOrders.length) {
        setOrderCards(new Set([...incomingSubscriptionOrders, ...orderCards]));
      }
    }
  }

  useEffect(() => {
    initializeOrderPage();
  }, []);

  useEffect(() => {
    fetchOrders({ date, status, nextToken: null });
    isRefetch(true);
  }, [status, date]);

  useEffect(() => {
    onFetchOrders();
    isRefetch(false);
  }, [listOrdersRes]);

  useEffect(() => {
    onUpdateOrder();
  }, [updateOrderRes]);

  useEffect(() => {
    addIncomingOrdersFromSubscription();
  }, [appContext.orders]);

  useEffect(() => {
    if (Object.keys(onFetchOrders).length) {
      onFetchOrders(true);
    }
  }, [selectedOrder]);

  return (
    <div className="orders">
      <div className="orders__list" id="ordersList">
        <OrderHeader
          onCheckboxChange={setStatus}
          onSelectDate={onSelectDate}
          rawDate={selectedJSDate}
          selectedCheckbox={status}
        />
        <InfiniteScroll
          hasMore={
            listOrdersRes && listOrdersRes.listOrders
              ? listOrdersRes.listOrders.nextToken
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
          {orderCards}
        </InfiniteScroll>
      </div>
      <div className="orders__data">
        {Object.keys(selectedOrder).length ? (
          <Fragment>
            <OrderModule
              order={selectedOrder}
              time={selectedOrder.time}
              updateOrder={updateOrder}
              updatingOrder={updateOrderLoading}
            />

            <OrderDetails products={selectedOrder.products} />
          </Fragment>
        ) : null}
      </div>
      <Alert stack={{ limit: 1 }} />
    </div>
  );
}

export default Orderss;
