import React from "react";
import { Text } from "office-ui-fabric-react/lib/Text";

export default ({
  productName,
  productType,
  productWeight,
  total,
  quantity
}) => (
  <div className="items">
    <div className="items__header">
      <span className="title">
        <Text variant="xLarge">Order Details</Text>
      </span>
    </div>
    <div className="items__body">
      <div className="purchase">
        <span className="purchase__item">
          <Text variant="large">{`${productName} (${quantity})`}</Text>
        </span>
        <div className="purchase__details">
          <span className="productType">
            <Text variant="large">{productType}</Text>
          </span>
          <span className="weight">
            <Text variant="large">{productWeight}</Text>
          </span>
        </div>
        <span className="purchase__total">
          <Text variant="large">{`$${total}`}</Text>
        </span>
      </div>
    </div>
  </div>
);
