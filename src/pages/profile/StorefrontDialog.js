import React, { Fragment, useEffect, useContext } from "react";
import AppContext from "AppContext";
import { useForm, useStorage } from "@potluckmarket/ella";
import { Storage } from "aws-amplify";
import ImageUploader from "react-images-upload";

import { Spinner, SpinnerSize } from "office-ui-fabric-react/lib/Spinner";
import { DialogFooter } from "office-ui-fabric-react/lib/Dialog";
import {
  PrimaryButton,
  DefaultButton
} from "office-ui-fabric-react/lib/Button";
import { TextField } from "office-ui-fabric-react/lib/TextField";
import { Toggle } from "office-ui-fabric-react/lib/Toggle";
import { Image, ImageFit } from "office-ui-fabric-react/lib/Image";
import { Panel, PanelType } from "office-ui-fabric-react/lib/Panel";
import DefaultImage from "assets/images/potluck_default.png";

function StorefrontDialog({
  renderAlert,
  hidden,
  closePanel,
  dispensary,
  onSave
}) {
  const { demo } = useContext(AppContext);

  const fields = [
    {
      type: "toggle",
      fieldName: "pickup",
      value: dispensary ? dispensary.pickup : false,
      dirty: false,
      touched: false,
      required: false,
      error: false,
      disabled: false
    },
    {
      type: "toggle",
      fieldName: "delivery",
      value: false,
      dirty: false,
      touched: false,
      required: false,
      error: false,
      disabled: true
    },
    {
      type: "toggle",
      fieldName: "public",
      value: dispensary ? dispensary.public : false,
      dirty: false,
      touched: false,
      required: false,
      error: false,
      disabled: demo ? true : false
    },
    // {
    //   type: "text",
    //   fieldName: "maxDays",
    //   value: "",
    //   dirty: false,
    //   touched: false,
    //   required: false,
    //   error: false
    // },
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

  const {
    state,
    updateField,
    generateFieldValues,
    areRequiredFieldsDirty,
    updateFieldByName
  } = useForm(fields);

  const {
    uploadImage,
    saveImage,
    generateImageLink,
    imageFiles,
    imagePreview,
    loading
  } = useStorage(
    Storage,
    process.env.NODE_ENV === "development"
      ? "https://s3.amazonaws.com/potluckdev-userfiles-mobilehub-657079931/public/"
      : "https://s3.amazonaws.com/potluckenterpriseapp-userfiles-mobilehub-146449674/public/",
    e => renderAlert()
  );

  useEffect(() => {
    state.fields.forEach((field, index) => {
      if (dispensary[field.fieldName]) {
        updateField(index, dispensary[field.fieldName]);
      }
    });
  }, [dispensary]);

  function doesStringHaveSpecialChars(str) {
    return /[`~!@#$%^&*()|+\-=?;:'" ,<>]/.test(str);
  }

  function handleUpload(imageFiles, imagePreview) {
    if (imageFiles.length) {
      if (doesStringHaveSpecialChars(imageFiles[0].name)) {
        renderAlert(
          "Please ensure that your image's file name does not contain any special characters."
        );
      } else {
        uploadImage(imageFiles[0], imagePreview);
        updateFieldByName("storefrontImage", generateImageLink(imageFiles[0].name));
      }
    }
  }

  async function handleSubmit() {
    if (!areRequiredFieldsDirty()) {
      if (imageFiles.type) {
        await saveImage("public");
      }

      await onSave(generateFieldValues());

      closePanel();
    } else {
      return null;
    }
  }

  return (
    <Panel
      closeButtonAriaLabel="Close"
      isOpen={hidden}
      onDismiss={() => closePanel()}
      type={PanelType.medium}
      isLightDismiss
      onRenderFooterContent={() => (
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
              <DefaultButton onClick={() => closePanel()} text="Cancel" />
            </Fragment>
          )}
        </DialogFooter>
      )}
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
        {state.fields.map((field, index) => {
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
                disabled={field.disabled}
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
    </Panel>
  );
}

export default StorefrontDialog;
