import React from "react";

import { Text } from "office-ui-fabric-react/lib/Text";

const renderProducts = products =>
  products.map((product, index) => (
    <div className="purchase" key={index}>
      <span className="purchase__item">
        <Text variant="large">{`${product.product.name} (${
          product.quantity
        })`}</Text>
      </span>
      <div className="purchase__details">
        <span className="weight">
          <Text variant="large">
            {product.isCannabisProduct
              ? product.productType
              : `${product.option.weight.charAt(0).toUpperCase() +
                  product.option.weight.slice(1)} (${product.productType})`}
          </Text>
        </span>
      </div>
      <span className="purchase__total">
        <Text variant="large">{`$${
          product.isCannabisProduct ? product.price : product.option.amount
        }`}</Text>
      </span>
    </div>
  ));

export default ({ products }) => (
  <div className="items">
    <div className="items__header">
      <span className="title">
        <Text variant="xLarge">Order Details</Text>
      </span>
    </div>
    <div className="items__body">{renderProducts(products)}</div>
  </div>
);
