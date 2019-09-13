import React from "react";
import "./badge.scss";

import { Text } from "office-ui-fabric-react/lib/Text";

export default ({ orderCount }) => (
  <div className="badge" style={{ opacity: orderCount ? 1 : 0 }}>
    <Text variant="large" className="badge__count">
      {orderCount ? orderCount : "0"}
    </Text>
  </div>
);
