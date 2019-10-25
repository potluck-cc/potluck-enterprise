import React, { useState, useContext } from "react";
import AppContext from "AppContext";
import { useBoolean, appsyncFetch } from "@potluckmarket/ella";
import "./profile.scss";

import { PrimaryButton } from "office-ui-fabric-react/lib/Button";
import { Text } from "office-ui-fabric-react/lib/Text";

import InformationDialog from "./InformationDialog";
import HoursDialog from "./HoursDialog";
import StorefrontDialog from "./StorefrontDialog";
import AccountDialog from "./AccountDialog";

import Alert from "react-s-alert";
import "react-s-alert/dist/s-alert-default.css";
import "react-s-alert/dist/s-alert-css-effects/jelly.css";

import client from "client";
import UpdateDispensary from "api/mutations/UpdateDispensary";

function Profile() {
  const {
    activeStore,
    user: { username }
  } = useContext(AppContext);
  const [infoDialog, toggleInfoDialog] = useBoolean(true);
  const [hoursDialog, toggleHoursDialog] = useBoolean(true);
  const [storefrontDialog, toggleStorefrontDialog] = useBoolean(true);
  const [dispensary, updateDispensary] = useState(activeStore);
  const [settingsDialog, toggleSettingsDialog] = useBoolean(true);

  async function onSaveInformation(information) {
    let updatedValues = { ...information };

    for (let key in updatedValues) {
      if (!updatedValues[key] && key !== "link" && key !== "public") {
        delete updatedValues[key];
      }
    }

    try {
      const updatedDispensary = await appsyncFetch({
        client,
        operationType: "mutation",
        document: UpdateDispensary,
        variables: { ...updatedValues, id: dispensary.id, companyId: username }
      });

      if (updatedDispensary.updateStore) {
        updateDispensary(updatedDispensary.updateStore);
      }
    } catch (e) {
      renderErrorAlert();
    }
  }

  function renderErrorAlert(
    alertMessage = "Something went wrong! Please try again!"
  ) {
    Alert.error(alertMessage, {
      position: "top-right",
      effect: "jelly",
      offset: 100,
      timeout: "none"
    });
  }

  return (
    <div className="profile">
      <div className="profile__cards">
        <div className="storefront-card card-dark">
          <Text variant="xxLarge" className="hours-card__title">
            Hours
          </Text>

          <PrimaryButton
            className="hours-card__btn"
            onClick={() => toggleHoursDialog(false)}
            text="Update Hours"
          />
        </div>

        <div className="storefront-card">
          <Text variant="xxLarge" className="hours-card__title">
            Storefront
          </Text>

          <PrimaryButton
            className="hours-card__btn"
            onClick={() => toggleStorefrontDialog(false)}
            text="Update Storefront"
          />
        </div>

        <div className="storefront-card card-dark">
          <Text variant="xxLarge" className="hours-card__title">
            Dispensary Information
          </Text>

          <PrimaryButton
            className="hours-card__btn"
            onClick={() => toggleInfoDialog(false)}
            text="Update Information"
          />
        </div>

        <div className="storefront-card card-dark">
          <Text variant="xxLarge" className="hours-card__title">
            Delete Store
          </Text>

          <PrimaryButton
            className="hours-card__btn"
            onClick={() => toggleSettingsDialog(false)}
            text="Delete Store"
          />
        </div>
      </div>

      <StorefrontDialog
        hidden={storefrontDialog}
        closeDialog={() => toggleStorefrontDialog(true)}
        onSave={onSaveInformation}
        dispensary={dispensary}
      />

      <InformationDialog
        hidden={infoDialog}
        closeDialog={() => toggleInfoDialog(true)}
        onSave={onSaveInformation}
        dispensary={dispensary}
        renderAlert={renderErrorAlert}
      />

      <HoursDialog
        hidden={hoursDialog}
        closeDialog={() => toggleHoursDialog(true)}
        onSave={onSaveInformation}
        hours={dispensary.hours || []}
      />

      {dispensary && (
        <AccountDialog
          hidden={settingsDialog}
          closeDialog={() => toggleSettingsDialog(true)}
          dispensary={dispensary}
          renderAlert={renderErrorAlert}
        />
      )}

      <Alert stack={{ limit: 1 }} />
    </div>
  );
}

export default Profile;
