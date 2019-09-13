import React, { Fragment, useEffect } from "react";
import { useForm, useStorage } from "@potluckmarket/ella";
import { Storage } from "aws-amplify";
import ImageUploader from "react-images-upload";

import { Spinner, SpinnerSize } from "office-ui-fabric-react/lib/Spinner";
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
import { Toggle } from "office-ui-fabric-react/lib/Toggle";
import { Image, ImageFit } from "office-ui-fabric-react/lib/Image";

import DefaultImage from "assets/images/potluck_default.png";

function StorefrontDialog({
  renderAlert,
  hidden,
  closeDialog,
  dispensary,
  onSave
}) {
  const fields = [
    {
      type: "toggle",
      fieldName: "pickup",
      value: false,
      dirty: false,
      touched: false,
      required: false,
      error: false
    },
    {
      type: "toggle",
      fieldName: "delivery",
      value: false,
      dirty: false,
      touched: false,
      required: false,
      error: false
    },
    {
      type: "text",
      fieldName: "maxDays",
      value: "",
      dirty: false,
      touched: false,
      required: false,
      error: false
    },
    {
      type: "hidden",
      fieldName: "storefrontImage",
      value: "",
      dirty: false,
      touched: false,
      required: false,
      error: false
    }
  ];

  const [
    form,
    {
      updateField,
      generateFieldValues,
      areRequiredFieldsDirty,
      updateFieldByName
    }
  ] = useForm(fields);

  const {
    uploadImage,
    saveImage,
    generateImageLink,
    imageFiles,
    imagePreview,
    loading
  } = useStorage(
    Storage,
    "https://s3.amazonaws.com/potluckenterpriseapp-userfiles-mobilehub-408727706/public/",
    e => renderAlert()
  );

  useEffect(() => {
    form.fields.forEach((field, index) => {
      if (dispensary[field.fieldName]) {
        updateField(index, dispensary[field.fieldName]);
      }
    });
  }, [dispensary]);

  function handleUpload(imageFiles, imagePreview) {
    uploadImage(imageFiles[0], imagePreview);
    updateFieldByName("storefrontImage", generateImageLink(imageFiles[0].name));
  }

  async function handleSubmit() {
    if (!areRequiredFieldsDirty()) {
      if (imageFiles.type) {
        await saveImage();
      }

      await onSave(generateFieldValues());

      closeDialog();
    } else {
      return null;
    }
  }

  return (
    <Dialog
      hidden={hidden}
      onDismiss={() => closeDialog("storefrontDialog")}
      dialogContentProps={{
        type: DialogType.largeHeader,
        title: "Storefront Settings"
      }}
      modalProps={{
        isBlocking: false,
        containerClassName: "ms-dialogMainOverride-info"
      }}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <Image
        src={
          imagePreview
            ? imagePreview
            : dispensary.storefrontImage
            ? dispensary.storefrontImage
            : DefaultImage
        }
        imageFit={ImageFit.contain}
        height={200}
        styles={{
          root: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }
        }}
      />
      <ImageUploader
        withIcon={false}
        buttonText="Upload Storefront Image"
        onChange={(imageFiles, imagePreview) =>
          handleUpload(imageFiles, imagePreview)
        }
        imgExtension={[".jpg", ".png"]}
        maxFileSize={5242880}
        label="Max file size: 5mb, accepted: jpg | png"
      />
      <section className="purchase-options">
        {form.fields.map((field, index) => {
          if (field.type === "hidden") {
            return null;
          }

          if (field.type === "toggle") {
            return (
              <Toggle
                key={index}
                defaultChecked={field.value}
                label={field.fieldName}
                onText="Enabled"
                offText="Disabled"
                onChange={() => updateField(index, !field.value)}
                disabled
              />
            );
          } else {
            return (
              <TextField
                key={index}
                label="Maxiumum Advanced Order"
                className="maxDays"
                defaultValue={field.value}
                onChange={e => updateField(index, e.target.value)}
                suffix="days"
                required={field.required}
                errorMessage={field.error && "This field is required!"}
              />
            );
          }
        })}
      </section>
      <DialogFooter>
        {loading ? (
          <Spinner size={SpinnerSize.large} style={{ marginTop: 30 }} />
        ) : (
          <Fragment>
            <PrimaryButton
              onClick={() => handleSubmit()}
              text="Save"
              style={{ marginRight: 10 }}
            />
            <DefaultButton onClick={() => closeDialog()} text="Cancel" />
          </Fragment>
        )}
      </DialogFooter>
    </Dialog>
  );
}

export default StorefrontDialog;
