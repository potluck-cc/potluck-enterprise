import React from "react";

import { Text } from "office-ui-fabric-react/lib/Text";

export default ({ selected, order, _onClick }) => (
  <div
    className={selected ? "list__cell list__cell--active" : "list__cell"}
    onClick={_onClick}
  >
    <div className="list__data">
      <span className="order-num">
        <Text variant="xLarge">{`${
          order.user
            ? `${order.user.firstname} ${order.user.lastname}`
            : "Garden State Dispensary"
        }`}</Text>
      </span>
      <span className="order-details">
        <span className="total">
          <Text variant="large">{order.totalDisplayValue}</Text>
        </span>
      </span>
    </div>
    <div className="list__time">
      <span className="time">
        <Text variant="medium">{order.time}</Text>
      </span>
    </div>
  </div>
);
