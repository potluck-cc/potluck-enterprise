import React from "react";
import { Text } from "office-ui-fabric-react/lib/Text";

export default ({
  itemIndex,
  orderNumber,
  itemCount,
  orderTotal,
  orderTime
}) => (
  <div className="list__cell" data-selection-index={itemIndex}>
    <div className="list__data">
      <span className="order-num">
        <Text variant="large">{`Order #${orderNumber}`}</Text>
      </span>
      <span className="order-details">
        <span className="items-num">
          <Text variant="medium">{`${itemCount} items`}</Text>
        </span>
        <span className="total">
          <Text variant="medium">{`$${orderTotal}`}</Text>
        </span>
      </span>
    </div>
    <div className="list__time">
      <span className="time">
        <Text variant="medium">{orderTime}</Text>
      </span>
    </div>
  </div>
);
