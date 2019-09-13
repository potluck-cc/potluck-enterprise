import React from "react";

import { Text } from "office-ui-fabric-react/lib/Text";
import { Image, ImageFit } from "office-ui-fabric-react/lib/Image";
import {
  PrimaryButton,
  DefaultButton
} from "office-ui-fabric-react/lib/Button";
import { OverflowSet } from "office-ui-fabric-react/lib/OverflowSet";
import { IconButton } from "office-ui-fabric-react/lib/Button";
import DefaultImage from "../../assets/images/potluck_default.png";
import Badge from "../../layout/sidebar/Badge";

const _onRenderOverflowButton = overflowItems => {
  const buttonStyles = {
    root: {
      minWidth: 0,
      padding: "0 4px",
      alignSelf: "stretch",
      height: "auto"
    }
  };
  return (
    <IconButton
      styles={buttonStyles}
      menuIconProps={{ iconName: "More" }}
      menuProps={{ items: overflowItems }}
    />
  );
};

const CartItem = ({ item, remove, editItemInCart }) => (
  <div className="cart__item">
    <Image
      src={item.image || DefaultImage}
      imageFit={ImageFit.contain}
      alt={item.product.name}
      height={50}
      width={50}
    />
    <div className="details">
      <Text variant="large">{`${item.product.name} (${item.quantity})`}</Text>
      <Text variant="large">{`${item.option.weight.charAt(0).toUpperCase() +
        item.option.weight.slice(1)} / ${item.productType}`}</Text>
    </div>
    <div className="total">
      <Text variant="large">${item.option.amount * item.quantity}</Text>
    </div>
    <div className="actions">
      <OverflowSet
        overflowItems={[
          {
            key: "item4",
            name: "Edit Item",
            onClick: editItemInCart
          },
          {
            key: "item5",
            name: "Remove Item",
            onClick: remove
          }
        ]}
        onRenderOverflowButton={_onRenderOverflowButton}
      />
    </div>
  </div>
);

export default ({
  cart,
  cancel,
  remove,
  editItemInCart,
  initiateCheckout,
  totalItems,
  cartTotal,
  subtotal,
  discount = "",
  discountTypeIsPercentage,
  initiateSetDiscount,
  tax
}) => (
  <div className="cart">
    <div className="cart__header">
      <Text variant="xLarge">Cart</Text>
      <Badge orderCount={totalItems || 0} />
    </div>
    <div className="cart__items">
      {cart.map((item, index) => (
        <CartItem
          key={item.id}
          item={item}
          remove={() => remove(index)}
          editItemInCart={() => editItemInCart(item)}
        />
      ))}
    </div>
    <div className="cart__actions">
      <div className="total">
        <Text variant="xxLarge">Subtotal: {subtotal}</Text>
        <Text variant="xxLarge">Tax: {tax}</Text>
        <Text variant="xxLarge">
          Discount: {""}
          {discount}
        </Text>
        <Text variant="xxLarge">Total: {cartTotal}</Text>
      </div>
      <div className="buttons">
        <PrimaryButton
          style={{ marginLeft: "8px" }}
          onClick={initiateCheckout}
          disabled={totalItems > 0 ? false : true}
        >
          Checkout
        </PrimaryButton>
        <PrimaryButton
          style={{ marginLeft: "8px" }}
          disabled={totalItems > 0 ? false : true}
          onClick={() => {
            initiateSetDiscount();
            initiateCheckout();
          }}
        >
          Discount
        </PrimaryButton>
        <DefaultButton
          style={{
            marginLeft: "8px",
            backgroundColor: "rgb(155, 17, 30)",
            color: "white"
          }}
          onClick={cancel}
          disabled={totalItems > 0 ? false : true}
        >
          Cancel
        </DefaultButton>
      </div>
    </div>
  </div>
);
