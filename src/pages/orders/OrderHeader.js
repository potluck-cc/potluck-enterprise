import React from "react";
import { Text } from "office-ui-fabric-react/lib/Text";

export default ({ _onClick, groupName, groupCount }) => (
  <div className="list__header" onClick={_onClick}>
    <span className="list__title">
      <Text variant="large">{groupName}</Text>
    </span>
    <span className="list__count">
      <Text variant="medium">{groupCount}</Text>
    </span>
  </div>
);
