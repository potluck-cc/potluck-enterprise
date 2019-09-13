import React, { useEffect, useState } from "react";
import {
  useForm,
  useStorage,
  appsyncFetch,
  CannabisWeights
} from "@potluckmarket/ella";

import { Panel, PanelType } from "office-ui-fabric-react/lib/Panel";

import {
  DefaultButton,
  PrimaryButton
} from "office-ui-fabric-react/lib/Button";

import { Storage } from "aws-amplify";

import client from "client";
import GetOneProduct from "api/queries/GetOneProduct";
import CreateProduct from "api/mutations/CreateProduct";
import CreateInventoryItem from "api/mutations/CreateInventoryItem";
import UpdateInventoryItem from "api/mutations/UpdateInventoryItem";
import DeleteInventoryItem from "api/mutations/DeleteInventoryItem";

import InputFields from "./InputFields";

import { Spinner, SpinnerSize } from "office-ui-fabric-react/lib/Spinner";

import Alert from "react-s-alert";
import "react-s-alert/dist/s-alert-default.css";
import "react-s-alert/dist/s-alert-css-effects/jelly.css";

function EditProducPanel({
  _hidePanel,
  showPanel,
  activeProduct,
  newProduct,
  updateProductState
}) {
  const [isCannabisProduct, setIsCannabisProduct] = useState(false);
  const [loading, isLoading] = useState(false);

  let fields = [
    {
      type: "text",
      fieldName: "name",
      value: "",
      defaultValue: "",
      dirty: false,
      touched: false,
      required: true,
      error: false
    },
    {
      type: "text",
      fieldName: "strainType",
      value: "",
      defaultValue: "",
      dirty: false,
      touched: false,
      required: true,
      error: false
    },
    {
      type: "text",
      fieldName: "productType",
      value: "",
      defaultValue: "",
      dirty: false,
      touched: false,
      required: true,
      error: false
    },
    {
      type: "text",
      fieldName: "thc",
      value: "",
      defaultValue: "",
      dirty: false,
      touched: false,
      required: true,
      error: false
    },
    {
      type: "text",
      fieldName: "cbd",
      value: "",
      defaultValue: "",
      dirty: false,
      touched: false,
      required: true,
      error: false
    },
    {
      type: "text",
      fieldName: "quantity",
      value: "",
      defaultValue: "",
      dirty: false,
      touched: false,
      required: true,
      error: false
    },
    {
      type: "text",
      fieldName: "description",
      value: "",
      defaultValue: "",
      dirty: false,
      touched: false,
      required: false,
      errror: false
    },
    {
      type: "text",
      fieldName: "price",
      value: "",
      defaultValue: "",
      dirty: false,
      touched: false,
      required: false,
      error: false
    },
    {
      type: "hidden",
      fieldName: "image",
      value: "",
      defaultValue: "",
      dirty: false,
      touched: false,
      required: false,
      error: false
    },
    {
      type: "list",
      fieldName: "options",
      value: [],
      defaultValue: [
        { weight: CannabisWeights.eighth, amount: "" },
        { weight: CannabisWeights.quarter, amount: "" },
        { weight: CannabisWeights.half, amount: "" },
        { weight: CannabisWeights.ounce, amount: "" }
      ],
      dirty: false,
      touched: false,
      required: true,
      error: false
    }
  ];

  const [
    form,
    {
      updateField,
      generateFieldValues,
      updateFieldByName,
      areRequiredFieldsDirty,
      mutateFieldPropertyValue
    }
  ] = useForm(fields);

  const {
    imageFiles,
    imagePreview,
    uploadImage,
    saveImage,
    generateImageLink,
    clearState
  } = useStorage(
    Storage,
    "https://s3.amazonaws.com/potluckenterpriseapp-userfiles-mobilehub-408727706/public/",
    e => renderErrorAlert()
  );

  useEffect(() => {
    // initializeFieldState();
    populateFields();
  }, [activeProduct]);

  useEffect(() => {
    if (isCannabisProduct) {
      mutateFieldPropertyValue("price", "required", true);
      mutateFieldPropertyValue("options", "required", false);
    } else {
      mutateFieldPropertyValue("price", "required", false);
      mutateFieldPropertyValue("options", "required", true);
    }
  }, [isCannabisProduct]);

  // function initializeFieldState() {
  //   if (newProduct) {
  //     setIsCannabisProduct(false);
  //     mutateFieldPropertyValue("price", "required", false);
  //     mutateFieldPropertyValue("options", "required", true);
  //   } else if (activeProduct) {
  //     setIsCannabisProduct(activeProduct.isCannabisProduct);
  //     mutateFieldPropertyValue(
  //       "price",
  //       "required",
  //       activeProduct.isCannabisProduct ? true : false
  //     );
  //     mutateFieldPropertyValue(
  //       "options",
  //       "required",
  //       activeProduct.isCannabisProduct ? false : true
  //     );
  //   } else {
  //     setIsCannabisProduct(true);
  //     updateField("options", null);
  //     mutateFieldPropertyValue("price", "required", true);
  //     mutateFieldPropertyValue("options", "required", false);
  //   }
  // }

  function renderErrorAlert(
    alertMessage = "Something went wrong! Please try again!"
  ) {
    Alert.error(alertMessage, {
      position: "top-right",
      effect: "jelly",
      offset: 100,
      timeout: "none"
    });
  }

  function handleUpload(imageFiles, imagePreview) {
    if (imageFiles.length) {
      uploadImage(imageFiles[0], imagePreview);
      updateFieldByName("image", generateImageLink(imageFiles[0].name));
    }
  }

  function populateFields() {
    clearState();

    if (activeProduct.product) {
      form.fields.forEach((field, index) => {
        if (activeProduct[field.fieldName]) {
          updateField(index, activeProduct[field.fieldName]);
        } else if (
          field.fieldName === "name" ||
          field.fieldName === "strainType"
        ) {
          updateField(index, activeProduct.product[field.fieldName]);
        } else {
          updateField(index, field.defaultValue);
        }
      });
    } else {
      form.fields.forEach((field, index) => {
        updateField(index, field.defaultValue);
      });
    }
  }

  function onRenderFooterContent() {
    return loading ? (
      <Spinner size={SpinnerSize.large} />
    ) : (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <PrimaryButton
          onClick={() => _onSave()}
          style={{
            marginRight: "8px",
            color: "#fff"
          }}
        >
          Save
        </PrimaryButton>
        <DefaultButton onClick={_hidePanel}>Cancel</DefaultButton>
        <PrimaryButton
          style={{
            marginLeft: "8px",
            backgroundColor: "red"
          }}
          onClick={async () => {
            isLoading(true);
            const itemToRemove = await deleteInventoryItem();
            updateProductState(itemToRemove, "delete");
            isLoading(false);
            _hidePanel();
          }}
        >
          Delete
        </PrimaryButton>
      </div>
    );
  }

  async function findProduct(query) {
    const product = await appsyncFetch({
      client,
      document: GetOneProduct,
      operationType: "query",
      fetchPolicy: "network-only",
      variables: { query }
    });

    if (product.listProducts && product.listProducts.items.length) {
      return product.listProducts.items[0].id; // this must change. we need more logic to determine which produt we're going to focus on per operation.
    } else {
      return null;
    }
  }

  async function createProduct(values) {
    const newProduct = await appsyncFetch({
      client,
      document: CreateProduct,
      operationType: "mutation",
      variables: { ...values }
    });

    return newProduct.createProduct ? newProduct.createProduct.id : null;
  }

  async function createInventoryItem(values) {
    const newInventoryItem = await appsyncFetch({
      client,
      document: CreateInventoryItem,
      operationType: "mutation",
      variables: { ...values }
    });

    return newInventoryItem.createInventoryItem
      ? newInventoryItem.createInventoryItem
      : null;
  }

  async function editInventoryItem(values) {
    const updatedInventoryItem = await appsyncFetch({
      client,
      document: UpdateInventoryItem,
      operationType: "mutation",
      variables: { ...values }
    });

    return updatedInventoryItem.updateInventoryItem
      ? updatedInventoryItem.updateInventoryItem
      : null;
  }

  async function deleteInventoryItem() {
    const deletedInventoryItem = await appsyncFetch({
      client,
      document: DeleteInventoryItem,
      operationType: "mutation",
      variables: { id: activeProduct.id }
    });

    return deletedInventoryItem.deleteInventoryItem
      ? deletedInventoryItem.deleteInventoryItem
      : null;
  }

  function parseFormValues(formValues) {
    let changedValues = { ...formValues };

    changedValues.searchField = formValues.name
      .replace(/ /g, "_")
      .toLowerCase();

    changedValues.isCannabisProduct = isCannabisProduct;

    for (let key in changedValues) {
      if (!changedValues[key]) {
        delete changedValues[key];
      }

      if (key === "options") {
        if (isCannabisProduct) {
          changedValues.options = null;
        } else {
          changedValues.options = JSON.stringify(changedValues.options);
        }
      }
    }

    return changedValues;
  }

  async function _onSave() {
    if (!areRequiredFieldsDirty()) {
      isLoading(true);

      if (imageFiles.type) {
        await saveImage();
      }

      const updatedFormValues = parseFormValues(generateFieldValues());

      try {
        if (newProduct) {
          const foundProductID = await findProduct(
            updatedFormValues.searchField
          );

          if (foundProductID) {
            updatedFormValues.product = foundProductID;
          } else {
            const newProductID = await createProduct({
              name: updatedFormValues.name,
              searchField: updatedFormValues.searchField
            });

            updatedFormValues.product = newProductID;
          }
          const newInventoryItem = await createInventoryItem({
            ...updatedFormValues,
            store: "851e40a3-b63b-4f7d-be37-3cf4065c08b5"
          });

          updateProductState(newInventoryItem, null);
        } else {
          const updatedInventoryItem = await editInventoryItem({
            ...updatedFormValues,
            id: activeProduct.id
          });

          updateProductState(updatedInventoryItem, "edit");
        }
      } catch {
        renderErrorAlert();
      }
      isLoading(false);
      _hidePanel();
    } else {
      isLoading(false);
    }
  }

  return (
    <Panel
      isOpen={showPanel}
      type={PanelType.smallFixedFar}
      onDismiss={_hidePanel}
      closeButtonAriaLabel="Close"
      onRenderFooterContent={onRenderFooterContent}
    >
      <InputFields
        updateField={updateFieldByName}
        onDrop={(imageFiles, imagePreview) => {
          handleUpload(imageFiles, imagePreview);
        }}
        state={generateFieldValues()}
        error={areRequiredFieldsDirty()}
        errorMessage={"This field is required!"}
        imagePreview={imagePreview}
        isCannabisProduct={isCannabisProduct}
        setIsCannabisProduct={setIsCannabisProduct}
      />
      <Alert stack={{ limit: 3 }} />
    </Panel>
  );
}

export default EditProducPanel;
