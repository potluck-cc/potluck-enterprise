import React, { Fragment, useState } from "react";
import "./CheckoutModal.scss";

import { Modal } from "office-ui-fabric-react/lib/Modal";
import { Text } from "office-ui-fabric-react/lib/Text";
import {
  PrimaryButton,
  DefaultButton
} from "office-ui-fabric-react/lib/Button";
import { TextField } from "office-ui-fabric-react/lib/TextField";
import { Toggle } from "office-ui-fabric-react/lib/Toggle";

const Discount = ({
  closeModal = () => {},
  addDiscount = () => {},
  cancelInitiateSetDiscount = () => {},
  discount: initialDiscount,
  discountType
}) => {
  const [discount, setDiscount] = useState(initialDiscount);
  const [discountTypeIsPercentage, setDiscountTypeIsPercentage] = useState(
    discountType
  );

  return (
    <Fragment>
      <div className="modal__heading">
        <Text variant="xxLarge">Discount</Text>
      </div>
      <div>
        {discountTypeIsPercentage ? (
          <TextField
            label="Discount"
            defaultValue={discount}
            onChange={e => setDiscount(e.target.value)}
            required
            type="number"
            // errorMessage={error && errorMessage}
            suffix={discountTypeIsPercentage ? "%" : false}
          />
        ) : (
          <TextField
            label="Discount"
            defaultValue={discount}
            onChange={e => setDiscount(e.target.value)}
            required
            type="number"
            // errorMessage={error && errorMessage}
            prefix={!discountTypeIsPercentage ? "$" : false}
          />
        )}
        <Toggle
          defaultChecked={discountTypeIsPercentage}
          label="Discount Type"
          onText="Percentage"
          offText="Dollar Amount"
          onChange={() =>
            setDiscountTypeIsPercentage(!discountTypeIsPercentage)
          }
        />
      </div>
      <div className="modal__actions">
        <PrimaryButton
          style={{ marginRight: 8 }}
          onClick={() => {
            // if (discount.length < 1) {
            //   setErrorMessage("This field is required!");
            //   return setError(true);
            // }

            addDiscount(discount, discountTypeIsPercentage);
            cancelInitiateSetDiscount();
            closeModal();
          }}
        >
          Add Discount
        </PrimaryButton>
        <DefaultButton
          style={{ marginRight: 8 }}
          onClick={() => {
            cancelInitiateSetDiscount();
            closeModal();
          }}
        >
          Cancel
        </DefaultButton>
      </div>
    </Fragment>
  );
};

const OrderCompleteOptions = ({
  closeModal = () => {},
  nextOrder = () => {},
  printReceipt = () => {}
}) => {
  const [emailReceipt, setEmailReceipt] = useState(false);
  const [email, updateEmail] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  if (emailReceipt) {
    return (
      <Fragment>
        <div className="modal__heading">
          <Text variant="xxLarge">Complete Form</Text>
        </div>
        <div style={{ marginTop: "2rem" }}>
          <TextField
            label="Email"
            defaultValue={email}
            onChange={e => updateEmail(e.target.value)}
            required
            errorMessage={error && errorMessage}
          />
        </div>
        <div className="modal__actions">
          <PrimaryButton
            style={{ marginRight: 8 }}
            onClick={() => {
              if (email.length < 1) {
                setErrorMessage("This field is required!");
                return setError(true);
              }

              setEmailReceipt(false);
              closeModal();
              nextOrder();
            }}
          >
            Submit
          </PrimaryButton>
          <DefaultButton
            style={{ marginRight: 8 }}
            onClick={() => setEmailReceipt(false)}
          >
            Cancel
          </DefaultButton>
        </div>
      </Fragment>
    );
  }

  return (
    <Fragment>
      <div className="modal__heading">
        <Text variant="xxLarge">Order Complete</Text>
      </div>
      <div className="modal__actions">
        <PrimaryButton
          style={{ marginRight: 8 }}
          onClick={() => setEmailReceipt(true)}
        >
          Email Receipt
        </PrimaryButton>
        <PrimaryButton
          style={{ marginRight: 8 }}
          onClick={() => {
            printReceipt();
            closeModal();
            nextOrder();
          }}
        >
          Print Receipt
        </PrimaryButton>
        <PrimaryButton
          style={{ marginRight: 8 }}
          onClick={() => {
            closeModal();
            nextOrder();
          }}
        >
          Next Order
        </PrimaryButton>
      </div>
    </Fragment>
  );
};

const OrderConfirm = ({
  total = 0,
  closeModal = () => {},
  confirmOrder = () => {}
}) => (
  <Fragment>
    <div className="modal__heading">
      <Text variant="mega">Total Due: {total}</Text>
    </div>

    <div className="modal__actions">
      <PrimaryButton style={{ marginRight: 8 }} onClick={confirmOrder}>
        CONFIRM ORDER
      </PrimaryButton>
      <DefaultButton style={{ marginRight: 8 }} onClick={closeModal}>
        Cancel
      </DefaultButton>
    </div>
  </Fragment>
);

function renderContent(type, props) {
  switch (type) {
    case "orderComplete":
      return <OrderCompleteOptions {...props} />;
    case "discount":
      return <Discount {...props} />;
    default:
      return <OrderConfirm {...props} />;
  }
}

export default ({
  total = 0,
  open = false,
  orderComplete = false,
  discount = "",
  isDiscount = false,
  discountType,
  closeModal = () => {},
  confirmOrder = () => {},
  nextOrder = () => {},
  printReceipt = () => {},
  setDiscount = () => {},
  cancelInitiateSetDiscount = () => {}
}) => (
  <Modal
    isOpen={open}
    isBlocking
    containerClassName="modal"
    onDismiss={closeModal}
    styles={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}
  >
    {isDiscount
      ? renderContent("discount", {
          closeModal,
          addDiscount: setDiscount,
          cancelInitiateSetDiscount,
          discount,
          discountType
        })
      : orderComplete
      ? renderContent("orderComplete", { closeModal, nextOrder, printReceipt })
      : renderContent(null, { closeModal, total, confirmOrder })}
    {/* {orderComplete ? (
      <OrderCompleteOptions
        closeModal={closeModal}
        nextOrder={nextOrder}
        printReceipt={printReceipt}
      />
    ) : (
      <OrderConfirm
        closeModal={closeModal}
        total={total}
        confirmOrder={confirmOrder}
      />
    )} */}
  </Modal>
);
