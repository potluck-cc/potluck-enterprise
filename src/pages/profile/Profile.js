import React, { Component } from "react";
import "./profile.scss";

import { Persona, PersonaSize } from "office-ui-fabric-react/lib/Persona";
import { PrimaryButton } from "office-ui-fabric-react/lib/Button";
import { Text } from "office-ui-fabric-react/lib/Text";

import InformationDialog from "./InformationDialog";
import HoursDialog from "./HoursDialog";

import ProfileContext from "./profileContext";

const store = {
  id: "ea8055d1-1a4d-41a6-a4b7-2df74bfcb172",
  name: "Greenleaf Compassion Center",
  address: "395 Bloomfield Ave Montclair, NJ 07042",
  phone: "(973)-337-5670",
  image:
    "https://static1.squarespace.com/static/56ba0d5659827eedd59d1ea1/t/596e5870be6594279e89fde0/1500403846718/Dispensary.png?format=2500w",
  hours: [
    "CLOSED",
    "10:00am – 5:00pm",
    "10:00am – 8:00pm",
    "10:00am – 8:00pm",
    "10:00am – 5:00pm",
    "10:00am – 5:00pm",
    "10:00am – 5:00pm"
  ]
};

class Profile extends Component {
  state = {
    infoDialog: true,
    hoursDialog: true
  };

  _showDialog = dialog => {
    this.setState({ [dialog]: false });
  };

  _closeDialog = dialog => {
    this.setState({ [dialog]: true });
  };

  _onSaveInformation = changedValues => {
    const valuesToChange = {};

    for (let key in changedValues) {
      if (changedValues[key].length) {
        valuesToChange[key] = changedValues[key];
      }
    }

    const changedValueKeys = Object.keys(valuesToChange);

    changedValueKeys.map(key => (store[key] = changedValues[key]));
  };

  _renderDayWithIndex = index => {
    switch (index) {
      case 0:
        return "Sun. ";
      case 1:
        return "Mon. ";
      case 2:
        return "Tues. ";
      case 3:
        return "Wed. ";
      case 4:
        return "Thurs. ";
      case 5:
        return "Fri. ";
      default:
        return "Sat. ";
    }
  };

  _renderTimes = hours =>
    hours.map((timeBlock, index) => (
      <div className="hours-card__hours" key={index}>
        <Text variant="large">{this._renderDayWithIndex(index)}</Text>
        <Text variant="large">{timeBlock}</Text>
      </div>
    ));

  _onSaveHours = changedValues => {
    const mutatedHours = store.hours.slice();
    changedValues.forEach((timeBlock, index) => {
      if (timeBlock === "CLOSED - CLOSED") {
        timeBlock = "CLOSED";
      }
      mutatedHours[index] = timeBlock;
    });
    if (mutatedHours.length < 7) {
      for (let i = 0; i < 7; i++) {
        if (!mutatedHours[i]) {
          mutatedHours[i] = "CLOSED";
        }
      }
    }
    store.hours = mutatedHours;
  };

  render() {
    const { infoDialog, hoursDialog } = this.state;

    return (
      <ProfileContext.Provider value={{ store }}>
        <div className="profile">
          <div className="profile__details">
            <Persona
              text={store.name}
              secondaryText={store.address}
              tertiaryText={store.phone}
              coinSize={150}
              onClick={() => this._showDialog("infoDialog")}
              size={PersonaSize.size72}
              imageUrl={store.image}
              className="profile__info"
              imageShouldFadeIn
            />
            <InformationDialog
              hidden={infoDialog}
              closeDialog={this._closeDialog}
              store={store}
              onSave={this._onSaveInformation}
            />
          </div>

          <div className="profile__other">
            <div className="hours-card">
              <Text variant="xxLarge" className="hours-card__title">
                Open Hours
              </Text>
              {this._renderTimes(store.hours)}
              <PrimaryButton
                className="hours-card__btn"
                onClick={() => this._showDialog("hoursDialog")}
                text="Update Hours"
              />
              <HoursDialog
                hidden={hoursDialog}
                closeDialog={this._closeDialog}
                currHours={store.hours}
                onSave={this._onSaveHours}
              />
            </div>
          </div>
        </div>
      </ProfileContext.Provider>
    );
  }
}

export default Profile;
