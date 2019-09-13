import React, { useState, useEffect } from "react";
import { useBoolean, useAppSyncQuery, appsyncFetch } from "@potluckmarket/ella";
import "./profile.scss";

import { Persona, PersonaSize } from "office-ui-fabric-react/lib/Persona";
import { PrimaryButton } from "office-ui-fabric-react/lib/Button";
import { Text } from "office-ui-fabric-react/lib/Text";
import { Spinner, SpinnerSize } from "office-ui-fabric-react/lib/Spinner";

import InformationDialog from "./InformationDialog";
import HoursDialog from "./HoursDialog";
import StorefrontDialog from "./StorefrontDialog";

import Alert from "react-s-alert";
import "react-s-alert/dist/s-alert-default.css";
import "react-s-alert/dist/s-alert-css-effects/jelly.css";

import client from "client";
import GetDispensary from "api/queries/GetDispensary";
import UpdateDispensary from "api/mutations/UpdateDispensary";

function Profile() {
  const [infoDialog, toggleInfoDialog] = useBoolean(true);
  const [hoursDialog, toggleHoursDialog] = useBoolean(true);
  const [storefrontDialog, toggleStorefrontDialog] = useBoolean(true);

  const [getDispensaryResult, loading] = useAppSyncQuery({
    client,
    operationType: "query",
    document: GetDispensary,
    variables: { id: "851e40a3-b63b-4f7d-be37-3cf4065c08b5" }
  });

  const dispensaryObj = getDispensaryResult.getStore
    ? getDispensaryResult.getStore
    : getDispensaryResult;

  const [dispensary, updateDispensary] = useState(dispensaryObj);

  async function onSaveInformation(information) {
    let updatedValues = { ...information };

    for (let key in updatedValues) {
      if (!updatedValues[key]) {
        delete updatedValues[key];
      }
    }

    try {
      const updatedDispensary = await appsyncFetch({
        client,
        operationType: "mutation",
        document: UpdateDispensary,
        variables: { ...updatedValues, id: dispensary.id }
      });

      if (updatedDispensary.updateStore) {
        updateDispensary(updatedDispensary.updateStore);
      }
    } catch (e) {
      renderErrorAlert();
    }
  }

  function renderHours(hours) {
    return hours.map((timeBlock, index) => (
      <div className="hours-card__hours" key={index}>
        <Text variant="large">{timeBlock.day}: </Text>
        <Text variant="large">
          {timeBlock.startTime === "CLOSED"
            ? "CLOSED"
            : `${timeBlock.startTime} - ${timeBlock.endTime}`}
        </Text>
      </div>
    ));
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

  useEffect(() => {
    updateDispensary(
      getDispensaryResult.getStore
        ? getDispensaryResult.getStore
        : getDispensaryResult
    );
  }, [getDispensaryResult]);

  return (
    <div className="profile">
      <div className="profile__details">
        {loading ? (
          <Spinner size={SpinnerSize.large} style={{ marginTop: 30 }} />
        ) : (
          <Persona
            text={dispensary.name}
            secondaryText={`${dispensary.street} ${dispensary.city} ${
              dispensary.zip
            }`}
            tertiaryText={dispensary.phone}
            coinSize={150}
            onClick={() => toggleInfoDialog(false)}
            size={PersonaSize.size72}
            imageUrl={dispensary.logo}
            className="profile__info"
            imageShouldFadeIn
          />
        )}

        <InformationDialog
          hidden={infoDialog}
          closeDialog={() => toggleInfoDialog(true)}
          onSave={onSaveInformation}
          dispensary={dispensary}
          renderAlert={renderErrorAlert}
        />
      </div>

      <div className="profile__other">
        {loading ? (
          <Spinner size={SpinnerSize.large} style={{ marginTop: 30 }} />
        ) : (
          <div className="hours-card">
            <Text variant="xxLarge" className="hours-card__title">
              Hours
            </Text>

            {renderHours(dispensary.hours ? dispensary.hours : [])}

            <PrimaryButton
              className="hours-card__btn"
              onClick={() => toggleHoursDialog(false)}
              text="Update Hours"
            />

            {dispensary.hours && (
              <HoursDialog
                hidden={hoursDialog}
                closeDialog={() => toggleHoursDialog(true)}
                onSave={onSaveInformation}
                hours={dispensary.hours}
              />
            )}
          </div>
        )}

        <div className="storefront-card">
          <Text variant="xxLarge" className="hours-card__title">
            Storefront
          </Text>

          <PrimaryButton
            className="hours-card__btn"
            onClick={() => toggleStorefrontDialog(false)}
            text="Update Storefront Settings"
          />

          <StorefrontDialog
            hidden={storefrontDialog}
            closeDialog={() => toggleStorefrontDialog(true)}
            onSave={onSaveInformation}
            dispensary={dispensary}
          />
        </div>
      </div>

      <Alert stack={{ limit: 1 }} />
    </div>
  );
}

export default Profile;
