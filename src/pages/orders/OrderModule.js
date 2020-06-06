import React, { useState, Fragment, useContext } from "react";
import AppContext from "AppContext";
import { PrimaryButton } from "office-ui-fabric-react/lib/Button";
import { Text } from "office-ui-fabric-react/lib/Text";
import { Spinner, SpinnerSize } from "office-ui-fabric-react/lib/Spinner";
import { Link } from "office-ui-fabric-react/lib/Link";
import { Dialog, DialogType } from "office-ui-fabric-react/lib/Dialog";
import { Image } from "office-ui-fabric-react/lib/Image";
import ProductList from "./ProductList";
import { dateFormat } from "@potluckmarket/ella";
import moment from "moment";
import { sendPushNotification } from "./sendPushNotification";
import UpdateInventoryItemStock from "api/mutations/UpdateInventoryItemStock";
import client from "client";
import { appsyncFetch, OperationType } from "@potluckmarket/ella";

export default function({ order, updateOrder, updatingOrder }) {
  const { activeStore } = useContext(AppContext);
  const [isModalHidden, setIsModalHidden] = useState(true);
  const [activeIdentificationType, setActiveIdentificationType] = useState({
    stateDL: false,
    medicalCard: false
  });

  function _updateOrder({ status }) {
    updateOrder({
      storeId: order.storeId,
      code: order.code,
      status
    });
  }

  function updateUserWithNotification(status) {
    let notifications = [];

    if (order.customer.marketToken) {
      notifications.push({
        pushToken: order.customer.marketToken,
        message: `Your order has been ${status}.`
      });
    }

    if (order.customer.marketWebToken) {
      notifications.push({
        pushToken: order.customer.marketWebToken,
        message: `Your order has been ${status}.`
      });
    }

    if (notifications.length) {
      sendPushNotification(notifications);
    }
  }

  function renderStatusStyle(status) {
    const style = {
      backgroundColor: null
    };

    if (status === "new") {
      style.backgroundColor = "orange";
    } else if (status === "accepted") {
      style.backgroundColor = "#146EBE";
    } else if (status === "rejected") {
      style.backgroundColor = "#FA6772";
    } else {
      style.backgroundColor = "#219647";
    }

    return style;
  }

  function adjustOrderItemsStock(operator = null) {
    return order.products.forEach(orderItem => {
      appsyncFetch({
        client,
        document: UpdateInventoryItemStock,
        operationType: OperationType.mutation,
        variables: {
          storeId: activeStore.id,
          id: orderItem.item.id,
          quantity: orderItem.item.isCannabisProudct
            ? orderItem.quantity
            : orderItem.requestedGrams,
          operator
        }
      });
    });
  }

  return (
    <div className="order-module-order-details">
      <div className="data">
        <div className="sales-data">
          <Text variant="xLarge">Order #{order.code}</Text>

          <Text variant="xxLarge">{order.totalDisplayValue}</Text>

          <div className="order-status" style={renderStatusStyle(order.status)}>
            <div className="order-status-indicator"></div>

            <Text className="order-status-text">{order.status}</Text>
          </div>

          <div className="dates">
            <div className="date">
              <div className="icon-container">
                <div className="icon calendar" />
              </div>
              <div className="details">
                <Text variant="medium">Order Date</Text>
                <Text variant="large">
                  {moment.unix(order.createdAt).format(dateFormat)}
                </Text>
              </div>
            </div>
            <div className="date">
              <div className="icon-container">
                <div className="icon route" />
              </div>
              <div className="details">
                <Text variant="medium">Pickup Date</Text>
                <Text variant="large">
                  {moment.unix(order.expectedCompletionDate).format(dateFormat)}
                </Text>
              </div>
            </div>
          </div>

          <div className="actions">
            {updatingOrder ? (
              <div style={{ backgroundColor: "white" }}>
                <Spinner size={SpinnerSize.large} />
              </div>
            ) : (
              <Fragment>
                <PrimaryButton
                  onClick={() => {
                    try {
                      if (order.status === "completed") {
                        adjustOrderItemsStock();
                      }
                      _updateOrder({ status: "rejected" });

                      updateUserWithNotification("rejected");
                    } catch (e) {
                      console.log(e);
                    }
                  }}
                >
                  Decline
                </PrimaryButton>

                {order.status !== "completed" && (
                  <PrimaryButton
                    onClick={() => {
                      try {
                        if (order.status === "accepted") {
                          adjustOrderItemsStock("+");
                        }

                        _updateOrder({
                          status:
                            order.status === "accepted"
                              ? "completed"
                              : "accepted"
                        });

                        updateUserWithNotification(
                          order.status === "accepted" ? "completed" : "accepted"
                        );
                      } catch (e) {
                        console.log(e);
                      }
                    }}
                    style={{
                      backgroundColor:
                        order.status === "accepted" ? "#219647" : null,
                        borderColor:  order.status === "accepted" ? "#219647" : null
                    }}
                  >
                    {order.status === "accepted" ? "Complete" : "Accept"}
                  </PrimaryButton>
                )}
              </Fragment>
            )}
          </div>
        </div>

        <div className="customer-data">
          <div className="data-container">
            <Text variant="xxLarge">Customer</Text>
            <Text variant="large">{`${order.customer.firstname} ${order.customer.lastname}`}</Text>
            <Text variant="large">{order.customer.phone}</Text>
            <Link
              onClick={() => {
                setActiveIdentificationType({
                  stateDL: true,
                  medicalCard: false
                });
                setIsModalHidden(false);
              }}
            >
              View State Identification
            </Link>
            <Link
              onClick={() => {
                setActiveIdentificationType({
                  stateDL: false,
                  medicalCard: true
                });
                setIsModalHidden(false);
              }}
            >
              Medical Marijuana Card
            </Link>
          </div>
        </div>
      </div>

      <div className="product-list">
        <div className="categories">
          <Text variant="large">Quantity</Text>
          <Text variant="large">Item</Text>
          <Text variant="large">Price</Text>
          <Text variant="large">Total</Text>
        </div>

        <ProductList products={order.products} />
      </div>

      <Dialog
        hidden={isModalHidden}
        onDismiss={() => setIsModalHidden(true)}
        dialogContentProps={{
          type: DialogType.normal,
          title: activeIdentificationType.stateDL
            ? "State Identification"
            : "Medical Marijuana Card"
        }}
        modalProps={{
          isBlocking: false
        }}
        containerClassName="id-dialog"
      >
        <Image
          src={
            activeIdentificationType.stateDL
              ? order.customer.stateId
              : order.customer.medCard
          }
          alt="Example implementation with no image fit property and no height or width is specified."
          className="product-image"
        />
      </Dialog>
    </div>
  );
}
