import React from "react";
import { Text } from "office-ui-fabric-react/lib/Text";
import moment from "moment";

function renderStatusStyle(status) {
  const style = {
    color: null
  };

  if (status === "new") {
    style.color = "orange";
  } else if (status === "accepted") {
    style.color = "blue";
  } else if (status === "rejected") {
    style.color = "red";
  } else {
    style.color = "#219647";
  }

  return style;
}

export default ({ selected, order, _onClick }) => (
  <div
    className={selected ? "order-cell order-cell--active" : "order-cell"}
    onClick={_onClick}
  >
    <div className="order-date">
      <Text variant="xLarge">
        {moment.unix(order.expectedCompletionDate).format("DD")}
      </Text>
      <Text>{moment.unix(order.expectedCompletionDate).format("MMM YY")}</Text>
    </div>

    <div className="order-name-and-status">
      <Text variant="xLarge">
        {`${order.customer.firstname} ${order.customer.lastname}`}
      </Text>
      <Text style={renderStatusStyle(order.status)}>
        {order.status.toUpperCase()}
      </Text>
    </div>

    <div className="order-total-and-order-number">
      <Text variant="xLarge">{order.totalDisplayValue}</Text>
      <Text>#{order.code}</Text>
    </div>
  </div>
);
