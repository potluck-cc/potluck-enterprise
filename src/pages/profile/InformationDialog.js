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

import DefaultImage from "assets/images/potluck_default.png";

function InformationDialog({
  dispensary,
  closeDialog,
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
      required: true,
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

  function handleUpload(imageFiles, imagePreview) {
    uploadImage(imageFiles[0], imagePreview);
    updateFieldByName("logo", generateImageLink(imageFiles[0].name));
  }

  function plusify(str) {
    return str.replace(/ /g, "+");
  }

  async function geoLocate({ street, city, state = "NJ" }) {
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
    if (!link.includes("http://")) {
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
          zip !== dispensary.zip ||
          state !== dispensary.state
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

        closeDialog();
      } else {
        return null;
      }
    } catch {
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

export default InformationDialog;
