import React, { Fragment } from "react";

import { TextField } from "office-ui-fabric-react/lib/TextField";
import {
  Dropdown,
  DropdownMenuItemType
} from "office-ui-fabric-react/lib/Dropdown";
import { Image } from "office-ui-fabric-react/lib/Image";

import MenuContext from "./menuContext";

import ImageUploader from "react-images-upload";
import DefaultImage from "../../assets/images/potluck_default.png";

export default ({ updateField, onDrop, image, strainType }) => (
  <MenuContext.Consumer>
    {({ activeProduct }) => (
      <Fragment>
        <Image
          src={
            image
              ? image
              : activeProduct.image
              ? activeProduct.image
              : DefaultImage
          }
          alt="Selected Product"
          height={image.length || activeProduct.image ? 200 : 100}
          styles={{
            root: {
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }
          }}
        />
        <TextField
          label="Name"
          defaultValue={activeProduct.name}
          onChange={e => updateField("name", e.target.value)}
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
          required={true}
          selectedKey={strainType ? strainType : activeProduct.strainType}
          onChange={(e, item) => updateField("strainType", item.key)}
        />
        <TextField
          label="THC%"
          defaultValue={activeProduct.thc}
          onChange={e => updateField("thc", e.target.value)}
        />
        <TextField
          label="CBD%"
          defaultValue={activeProduct.cbd}
          onChange={e => updateField("cbd", e.target.value)}
        />
        <ImageUploader
          withIcon={true}
          buttonText="Upload New Image"
          onChange={onDrop}
          imgExtension={[".jpg", ".png"]}
          maxFileSize={5242880}
          label="Max file size: 5mb, accepted: jpg | png"
        />
      </Fragment>
    )}
  </MenuContext.Consumer>
);
