import React from "react";

import {
  Dialog,
  DialogType,
  DialogFooter
} from "office-ui-fabric-react/lib/Dialog";
import {
  PrimaryButton,
  DefaultButton
} from "office-ui-fabric-react/lib/Button";
import { TextField } from "office-ui-fabric-react/lib/TextField";

export default ({ hidden, closeDialog }) => (
  <Dialog
    hidden={hidden}
    onDismiss={() => closeDialog("infoDialog")}
    dialogContentProps={{
      type: DialogType.largeHeader,
      title: "Dispensary Information",
      subText: "Lorem ipsum dolor sit amet."
    }}
    modalProps={{
      isBlocking: false,
      containerClassName: "ms-dialogMainOverride"
    }}
  >
    <TextField label="Dispensary Name" defaultValue="Garden State Dispensary" />
    <TextField label="Address" defaultValue="950 US-1, Woodbridge, NJ 07095" />
    <TextField label="Phone Number" defaultValue="(973) 220 - 1995" />
    <DialogFooter>
      <PrimaryButton onClick={() => closeDialog("infoDialog")} text="Save" />
      <DefaultButton onClick={() => closeDialog("infoDialog")} text="Cancel" />
    </DialogFooter>
  </Dialog>
);
