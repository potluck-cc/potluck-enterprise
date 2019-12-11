import React, { useContext } from "react";
import AppContext from "AppContext";
import { Text } from "office-ui-fabric-react/lib/Text";
import { Image } from "office-ui-fabric-react/lib/Image";
import DefaultImage from "assets/images/potluck_default.png";

const renderProducts = (products, logo) =>
  products.map((product, index) => (
    <div className="product" key={index}>
      <div className="product-image-container">
        <Image
          src={product.image || logo || DefaultImage}
          alt="Example implementation with no image fit property and no height or width is specified."
          className="product-image"
          width={50}
          height={50}
        />
        <div className="product-image-badge">
          <Text>{product.quantity}</Text>
        </div>
      </div>

      <Text>{product.item.product.name}</Text>

      <Text>{`$${
        product.item.isCannabisProduct
          ? product.item.price
          : product.option.amount
      }`}</Text>

      <Text>{`$${
        product.item.isCannabisProduct
          ? product.item.price * product.quantity
          : product.option.amount * product.quantity
      }`}</Text>
    </div>
  ));

export default ({ products }) => {
  const {
    activeStore: { logo }
  } = useContext(AppContext);

  return (
    <div className="list-container">
      <div className="products">{renderProducts(products, logo)}</div>
    </div>
  );
};
