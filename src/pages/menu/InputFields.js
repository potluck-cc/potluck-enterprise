import React, { Fragment, useEffect } from "react";
import ImageUploader from "react-images-upload";

import { TextField } from "office-ui-fabric-react/lib/TextField";
import {
  Dropdown,
  DropdownMenuItemType
} from "office-ui-fabric-react/lib/Dropdown";
import { Image } from "office-ui-fabric-react/lib/Image";

import DefaultImage from "assets/images/potluck_default.png";

export default ({
  updateField,
  onDrop,
  error,
  errorMessage,
  imagePreview,
  isCannabisProduct,
  setIsCannabisProduct,
  state: {
    name,
    strainType,
    productType,
    thc,
    cbd,
    image,
    quantity,
    options,
    description,
    price
  }
}) => {
  useEffect(() => {
    if (productType) {
      if (productType === "Flower" || productType === "PreRolls") {
        setIsCannabisProduct(false);
      } else {
        setIsCannabisProduct(true);
      }
    }
  }, [productType]);

  function updateOption(optionName, value) {
    const updatedOptions = options.map(option => {
      if (option.weight === optionName) {
        return { ...option, amount: value };
      } else {
        return option;
      }
    });

    updateField("options", updatedOptions);
  }

  return (
    <Fragment>
      <Image
        src={imagePreview ? imagePreview : image ? image : DefaultImage}
        alt="Selected Product"
        height={
          (image && image.length) || (imagePreview && imagePreview.length)
            ? 200
            : 100
        }
        styles={{
          root: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }
        }}
      />
      <ImageUploader
        withIcon={true}
        buttonText="Upload Product Image"
        onChange={onDrop}
        imgExtension={[".jpg", ".png"]}
        maxFileSize={5242880}
        label="Max file size: 5mb, accepted: jpg | png"
      />
      <TextField
        label="Name"
        defaultValue={name}
        onChange={e => updateField("name", e.target.value)}
        required
        errorMessage={error && errorMessage}
      />
      <Dropdown
        placeholder="Select an Option"
        label="Strain Type"
        options={[
          {
            key: "Header",
            text: "Strain Type",
            itemType: DropdownMenuItemType.Header
          },
          { key: "Sativa", text: "Sativa" },
          { key: "Indica", text: "Indica" },
          { key: "Hybrid", text: "Hybrid" },
          { key: "CBD", text: "High CBD" }
        ]}
        required
        selectedKey={strainType}
        onChange={(e, item) => updateField("strainType", item.key)}
        errorMessage={error && errorMessage}
      />
      <Dropdown
        placeholder="Select an Option"
        label="Product Type"
        options={[
          {
            key: "Header",
            text: "Product Type",
            itemType: DropdownMenuItemType.Header
          },
          { key: "Flower", text: "Flower" },
          { key: "Edible", text: "Edible" },
          { key: "Concentrate", text: "Concentrate" },
          { key: "Topical", text: "Topical" },
          { key: "PreRolls", text: "Pre-rolls" }
        ]}
        required
        selectedKey={productType}
        onChange={(e, item) => updateField("productType", item.key)}
        errorMessage={error && errorMessage}
      />
      <TextField
        label="THC%"
        value={thc}
        onChange={e => updateField("thc", e.target.value)}
        suffix="%"
        className="textfield_small"
        required
        errorMessage={error && errorMessage}
      />
      <TextField
        label="CBD%"
        value={cbd}
        onChange={e => updateField("cbd", e.target.value)}
        suffix="%"
        className="textfield_small"
        required
        errorMessage={error && errorMessage}
      />
      <TextField
        label="Description"
        value={description}
        multiline
        rows={3}
        onChange={e => updateField("description", e.target.value)}
      />

      {isCannabisProduct ? (
        <TextField
          label="Price"
          onChange={e => updateField("price", e.target.value)}
          prefix="$"
          defaultValue={price}
          className="textfield_small"
          required
          errorMessage={error && errorMessage}
        />
      ) : (
        <Fragment>
          <TextField
            label="Price Per Eighth"
            onChange={e => updateOption("eighth", e.target.value)}
            prefix="$"
            value={options[0] && options[0].amount}
            className="textfield_small"
            errorMessage={error && errorMessage}
            required
          />
          <TextField
            label="Price Per Quarter"
            onChange={e => updateOption("quarter", e.target.value)}
            prefix="$"
            defaultValue={options[1] && options[1].amount}
            className="textfield_small"
            errorMessage={error && errorMessage}
            required
          />
          <TextField
            label="Price Per Half"
            onChange={e => updateOption("half", e.target.value)}
            prefix="$"
            defaultValue={options[2] && options[2].amount}
            className="textfield_small"
            errorMessage={error && errorMessage}
            required
          />
          <TextField
            label="Price Per Ounce"
            onChange={e => updateOption("ounce", e.target.value)}
            prefix="$"
            defaultValue={options[3] && options[3].amount}
            className="textfield_small"
            errorMessage={error && errorMessage}
            required
          />
        </Fragment>
      )}

      <TextField
        label="In Stock"
        onChange={e => updateField("quantity", e.target.value)}
        suffix={productType === "Flower" ? "grams" : "items"}
        defaultValue={quantity}
        className="textfield_medium"
        required
        errorMessage={error && errorMessage}
      />
    </Fragment>
  );
};
