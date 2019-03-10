import React, { Fragment } from "react";

import { TextField } from "office-ui-fabric-react/lib/TextField";
import { PrimaryButton } from "office-ui-fabric-react/lib/Button";
import {
  Dropdown,
  DropdownMenuItemType
} from "office-ui-fabric-react/lib/Dropdown";
export default () => (
  <Fragment>
    <TextField label="Name" />
    <Dropdown
      placeholder="Select an Option"
      label="Strain Type"
      options={[
        {
          key: "Header",
          text: "Strain Type",
          itemType: DropdownMenuItemType.Header
        },
        { key: "A", text: "Sativa" },
        { key: "B", text: "Indica" },
        { key: "C", text: "Hybrid" },
        { key: "D", text: "High CBD" }
      ]}
      required={true}
    />
    <TextField label="THC%" />
    <TextField label="CBD%" />
    <PrimaryButton style={{ marginTop: "20px" }}>
      Upload New Image
    </PrimaryButton>
  </Fragment>
);
