import React from "react";
import { PrimaryButton } from "office-ui-fabric-react/lib/Button";

import { Text } from "office-ui-fabric-react/lib/Text";

export default ({
  orderNumber,
  customerName,
  customerPhone,
  total,
  itemCount,
  time
}) => (
  <div className="details">
    <div className="details__header">
      <span className="order-num">
        <Text variant="xLarge">{`Order #${orderNumber}`}</Text>
      </span>
      <span className="order-customer">
        <span className="name">
          <Text variant="large">{customerName}</Text>
        </span>
        <span className="phone">
          <Text variant="medium">{customerPhone}</Text>
        </span>
      </span>
    </div>
    <div className="details__body">
      <span className="total">
        <Text variant="xxLarge">{`$${total}`}</Text>
      </span>
      <span className="count">
        <Text variant="xLarge">{`${itemCount} items`}</Text>
      </span>
      <span className="time">
        <Text variant="large">{time}</Text>
      </span>
      <div className="actions">
        <PrimaryButton
          style={{ marginLeft: "8px", backgroundColor: "#9b111e" }}
          onClick={() => {}}
        >
          Decline
        </PrimaryButton>

        <PrimaryButton style={{ marginLeft: "8px" }} onClick={() => {}}>
          Accept
        </PrimaryButton>
      </div>
    </div>
  </div>
);
