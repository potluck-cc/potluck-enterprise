import React, { Fragment, useState, useEffect } from "react";
import { CannabisWeightValues } from "@potluckmarket/ella";
import "./AddToCartModal.scss";

import { Modal } from "office-ui-fabric-react/lib/Modal";
import { Text } from "office-ui-fabric-react/lib/Text";
import { Icon } from "office-ui-fabric-react/lib/Icon";
import {
  DefaultButton,
  PrimaryButton
} from "office-ui-fabric-react/lib/Button";

const renderWeightOptions = (
  options,
  weight,
  setWeight,
  disabledWeightOptions,
  setQuantity
) =>
  options.map(option => {
    const isOptionDisabled = disabledWeightOptions.find(
      disabledOption => disabledOption === option.weight
    );

    if (isOptionDisabled) {
      return null;
    }

    return (
      <Fragment>
        <div
          className={
            weight.weight === option.weight ? "option selected" : "option"
          }
          onClick={() => {
            setWeight({ weight: option.weight, amount: option.amount });
            setQuantity(1);
          }}
        >
          <div className="option__weight">
            <Text variant="large">{option.weight}</Text>
          </div>
          <div className="option__amount">
            <Text variant="large">${option.amount}</Text>
          </div>
        </div>
      </Fragment>
    );
  });

export default ({
  open = false,
  weightValues,
  closeModal = () => {},
  addToCart = () => {},
  activeProduct = {}
}) => {
  const [quantity, setQuantity] = useState(1);
  const [weight, setWeight] = useState({
    weight: activeProduct.options[0].weight,
    amount: activeProduct.options[0].amount
  });

  useEffect(() => {
    setQuantity(activeProduct.option ? activeProduct.quantity : 1);
    setWeight({
      weight: activeProduct.option
        ? activeProduct.option.weight
        : activeProduct.options[0].weight,
      amount: activeProduct.option
        ? activeProduct.option.amount
        : activeProduct.options[0].amount
    });
  }, [activeProduct]);

  const setProductAndThenAddToCart = () => {
    addToCart({
      id: activeProduct.id,
      image: activeProduct.image,
      productType: activeProduct.productType,
      product: activeProduct.product,
      quantity: quantity,
      option: weight,
      options: activeProduct.options,
      stock: activeProduct.quantity
    });

    closeModal();
  };

  const insufficientQuantity =
    (activeProduct.stock ? activeProduct.stock : activeProduct.quantity) < 3.5;

  const isIncreaseQuantityDisabled =
    weightValues[weight.weight] * (quantity + 1) >
    (activeProduct.stock ? activeProduct.stock : activeProduct.quantity);

  const disabledWeightOptions = [];

  for (let weight in weightValues) {
    if (
      weightValues[weight] >
      (activeProduct.stock ? activeProduct.stock : activeProduct.quantity)
    ) {
      disabledWeightOptions.push(weight);
    }
  }

  return (
    <Modal isOpen={open} isBlocking containerClassName="modal">
      <div className="modal__heading">
        <Text variant="xxLarge">
          {activeProduct.product && activeProduct.product.name}
        </Text>
        <Text variant="xLarge">
          {activeProduct.product && activeProduct.productType}
        </Text>
      </div>
      <div className="modal__options">
        {activeProduct.product &&
          renderWeightOptions(
            activeProduct.options,
            weight,
            setWeight,
            disabledWeightOptions,
            setQuantity
          )}
      </div>
      <div className="modal__quantity">
        <div
          className="action"
          onClick={() => setQuantity(quantity - 1 > 0 ? quantity - 1 : 1)}
        >
          <Icon iconName="Remove" />
        </div>
        <div className="quantity">
          <Text variant="xxLarge">{quantity}</Text>
        </div>
        <div
          className="action"
          onClick={
            isIncreaseQuantityDisabled
              ? () => {}
              : () => setQuantity(quantity + 1)
          }
        >
          <Icon iconName="Add" />
        </div>
      </div>
      <div className="modal__actions">
        <PrimaryButton
          style={{ marginLeft: "8px" }}
          onClick={setProductAndThenAddToCart}
          disabled={insufficientQuantity}
        >
          {insufficientQuantity
            ? "Insufficient Quantity In Stock"
            : "Add to Cart"}
        </PrimaryButton>
        <DefaultButton style={{ marginLeft: "8px" }} onClick={closeModal}>
          Cancel
        </DefaultButton>
      </div>
    </Modal>
  );
};
