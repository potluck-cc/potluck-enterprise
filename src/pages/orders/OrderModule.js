import React from "react";

import { PrimaryButton } from "office-ui-fabric-react/lib/Button";
import { Text } from "office-ui-fabric-react/lib/Text";
import { Spinner, SpinnerSize } from "office-ui-fabric-react/lib/Spinner";

export default ({ order, updateOrder, updatingOrder }) => (
  <div className="details">
    <div className="details__header">
      <span className="order-num">
        <Text variant="xLarge">{`Order ID: ${order.id.split("-")[0]}`}</Text>
      </span>
      <span className="order-customer">
        <span className="detail">
          <Text variant="large">
            {order.user
              ? `${order.user.firstname} ${order.user.lastname}`
              : "Garden State Dispensary"}
          </Text>
        </span>
        <span className="detail">
          <Text variant="medium">{order.user ? order.user.phone : null}</Text>
        </span>
        <span className="detail">
          <Text variant="medium">
            {order.user ? order.user.patientID : null}
          </Text>
        </span>
      </span>
    </div>
    <div className="details__body">
      <span className="total">
        <Text variant="xLarge">Discount: {`$${order.discount}`}</Text>
        <Text variant="xLarge">Tax: {order.taxDisplayValue}</Text>
        <Text variant="xLarge">Subtotal: {order.subtotalDisplayValue}</Text>
        <Text variant="xLarge">Total: {order.totalDisplayValue}</Text>
      </span>
      <span className="time">
        <Text variant="xLarge">
          {order.pickup ? `Pickup Time: ${order.time}` : "Delivery Order"}
        </Text>
      </span>
      {updatingOrder ? (
        <Spinner size={SpinnerSize.large} />
      ) : (
        <div className="actions">
          {order.status !== "rejected" ? (
            <PrimaryButton
              style={{ marginLeft: "8px", backgroundColor: "#9b111e" }}
              onClick={() => updateOrder({ id: order.id, status: "rejected" })}
            >
              Decline
            </PrimaryButton>
          ) : null}

          {order.status !== "accepted" ? (
            <PrimaryButton
              style={{ marginLeft: "8px" }}
              onClick={() => updateOrder({ id: order.id, status: "accepted" })}
            >
              Accept
            </PrimaryButton>
          ) : null}
        </div>
      )}
    </div>
  </div>
);
