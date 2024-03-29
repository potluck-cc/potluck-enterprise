import React, { Fragment, useEffect } from "react";
import { Storage } from "aws-amplify";
import { useForm, useStorage, useAuth } from "@potluckmarket/ella";
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
import { Image, ImageFit } from "office-ui-fabric-react/lib/Image";
import { Panel, PanelType } from "office-ui-fabric-react/lib/Panel";
import DefaultImage from "assets/images/potluck_default.png";

function InformationDialog({
  dispensary,
  closePanel,
  hidden,
  renderAlert,
  onSave
}) {
  const fields = [
    {
      type: "text",
      fieldName: "name",
      value: dispensary.name ? dispensary.name : "",
      dirty: false,
      touched: false,
      required: true,
      error: false
    },
    {
      type: "text",
      fieldName: "street",
      value: dispensary.street ? dispensary.street : "",
      dirty: false,
      touched: false,
      required: true,
      error: false
    },
    {
      type: "text",
      fieldName: "zip",
      value: dispensary.zip ? dispensary.zip : "",
      dirty: false,
      touched: false,
      required: true,
      error: false
    },
    {
      type: "text",
      fieldName: "city",
      value: dispensary.city ? dispensary.city : "",
      dirty: false,
      touched: false,
      required: true,
      error: false
    },
    {
      type: "text",
      fieldName: "phone",
      value: dispensary.phone ? dispensary.phone : "",
      dirty: false,
      touched: false,
      required: false,
      error: false
    },
    {
      type: "text",
      fieldName: "link",
      value: dispensary.link ? dispensary.link : null,
      dirty: false,
      touched: false,
      required: false,
      error: false
    },
    {
      type: "hidden",
      fieldName: "logo",
      value: dispensary.logo ? dispensary.logo : "",
      dirty: false,
      touched: false,
      required: false,
      error: false
    }
  ];

  const {
    state,
    updateField,
    validate,
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
        updateFieldByName("logo", generateImageLink(imageFiles[0].name));
      }
    }
  }

  function plusify(str) {
    return str.replace(/ /g, "+");
  }

  async function geoLocate({ street, city, state }) {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${plusify(
      street
    )},${plusify(city)},${plusify(
      state
    )}&key=AIzaSyB30Evgnn_D16ZtL5qCRFzUJrj5sGY2dUo`;

    const res = await fetch(url);
    const { results } = (await res.json()) || null;

    if (results) {
      const {
        geometry: { location }
      } = results[0];

      return location || null;
    } else {
      return null;
    }
  }

  function createValidLink(link) {
    if (!link.includes("http://") || !link.includes("https://")) {
      return `http://${link}`;
    } else {
      return link;
    }
  }

  async function handleSubmit() {
    validate();

    try {
      if (!areRequiredFieldsDirty()) {
        if (imageFiles.type) {
          await saveImage("public");
        }

        const { street, city, zip, state, link } = generateFieldValues();

        if (
          street !== dispensary.street ||
          city !== dispensary.city ||
          zip !== dispensary.zip
        ) {
          const { lat, lng } =
            (await geoLocate({ street, city, state })) || null;

          await onSave({
            ...generateFieldValues(),
            latitude: lat,
            longitude: lng,
            link: link && link.length ? createValidLink(link) : null
          });
        } else {
          await onSave({
            ...generateFieldValues(),
            link: link && link.length ? createValidLink(link) : null
          });
        }

        closePanel();
      } else {
        return null;
      }
    } catch (e) {
      console.log(e);
      renderAlert();
    }
  }

  useEffect(() => {
    state.fields.forEach((field, index) => {
      if (dispensary[field.fieldName]) {
        updateField(index, dispensary[field.fieldName]);
      }
    });
  }, [dispensary]);

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
            : dispensary.logo
            ? dispensary.logo
            : DefaultImage
        }
        imageFit={ImageFit.contain}
        alt={dispensary.name}
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
        buttonText="Upload Logo"
        onChange={(imageFiles, imagePreview) =>
          handleUpload(imageFiles, imagePreview)
        }
        imgExtension={[".jpg", ".png"]}
        maxFileSize={5242880}
        label="Max file size: 5mb, accepted: jpg | png"
      />

      {state.fields.map((field, index) => {
        if (field.type === "hidden") {
          return (
            <input
              type={field.type}
              value={field.value}
              onChange={e => updateField(index, e.target.value)}
            />
          );
        }
        return (
          <TextField
            key={index}
            label={field.fieldName}
            defaultValue={field.value}
            type={field.type}
            onChange={e => updateField(index, e.target.value)}
            required={field.required}
            errorMessage={field.error && "This field is required!"}
          />
        );
      })}
    </Panel>
  );
}

export default InformationDialog;
