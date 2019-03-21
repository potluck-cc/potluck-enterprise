import React, { Component } from "react";

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
import { Image } from "office-ui-fabric-react/lib/Image";

import ImageUploader from "react-images-upload";

export default class InformationDialog extends Component {
  state = {
    name: "",
    address: "",
    phone: "",
    image: ""
  };

  updateField = (field, value) => this.setState({ [field]: value });

  _onSave = () => {
    const { onSave, closeDialog } = this.props;
    onSave(this.state);
    closeDialog("infoDialog");
  };

  _onDrop = (pictureFiles, pictureDataURLs) => {
    this.setState({
      image: pictureDataURLs[0]
    });
  };

  render() {
    const { hidden, closeDialog, store = {} } = this.props;
    const { image } = this.state;

    return (
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
        <Image
          src={image ? image : store.image}
          alt={store.name}
          height={200}
          styles={{
            root: {
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }
          }}
        />
        <TextField
          label="Dispensary Name"
          defaultValue={store.name}
          onChange={e => this.updateField("name", e.target.value)}
        />
        <TextField
          label="Address"
          defaultValue={store.address}
          onChange={e => this.updateField("address", e.target.value)}
        />
        <TextField
          label="Phone Number"
          defaultValue={store.phone}
          onChange={e => this.updateField("phone", e.target.value)}
        />
        <ImageUploader
          withIcon={true}
          buttonText="Upload New Image"
          onChange={this._onDrop}
          imgExtension={[".jpg", ".png"]}
          maxFileSize={5242880}
        />
        <DialogFooter>
          <PrimaryButton onClick={this._onSave} text="Save" />
          <DefaultButton
            onClick={() => closeDialog("infoDialog")}
            text="Cancel"
          />
        </DialogFooter>
      </Dialog>
    );
  }
}
