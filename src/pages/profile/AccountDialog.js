import React from "react";
import { Dialog, DialogType } from "office-ui-fabric-react/lib/Dialog";
import { PrimaryButton } from "office-ui-fabric-react/lib/Button";

function AccountSettings({ closeDialog, hidden, renderAlert }) {
  return (
    <Dialog
      hidden={hidden}
      onDismiss={() => closeDialog()}
      dialogContentProps={{
        type: DialogType.largeHeader,
        title: "Dispensary Information"
      }}
      modalProps={{
        isBlocking: false,
        containerClassName: "ms-dialogMainOverride-info"
      }}
    >
      <PrimaryButton>Sign Out</PrimaryButton>
    </Dialog>
  );
}

export default AccountSettings;
