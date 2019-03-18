import React, { Component } from "react";
import "./profile.scss";

import {
  Persona,
  PersonaInitialsColor,
  PersonaSize
} from "office-ui-fabric-react/lib/Persona";
import { PrimaryButton } from "office-ui-fabric-react/lib/Button";
import { Text } from "office-ui-fabric-react/lib/Text";

import InformationDialog from "./InformationDialog";
import HoursDialog from "./HoursDialog";

const personaWithInitials = {
  text: "Garden State Dispensary",
  secondaryText: "950 US-1, Woodbridge, NJ 07095",
  tertiaryText: "(973) 220 - 1995"
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

  _onChoiceChanged() {
    console.log("Choice option change");
  }

  render() {
    const { infoDialog, hoursDialog } = this.state;

    return (
      <div className="profile">
        <div className="profile__details">
          <Persona
            {...personaWithInitials}
            initialsColor={PersonaInitialsColor.teal}
            coinSize={150}
            onClick={() => this._showDialog("infoDialog")}
            size={PersonaSize.size72}
            imageAlt="GS"
            imageUrl={
              "https://static1.squarespace.com/static/56ba0d5659827eedd59d1ea1/t/596e5870be6594279e89fde0/1500403846718/Dispensary.png?format=2500w"
            }
            className="profile__info"
            imageShouldFadeIn
          />
          <InformationDialog
            hidden={infoDialog}
            closeDialog={this._closeDialog}
          />
        </div>
        <div className="profile__other">
          <div className="hours-card">
            <Text variant="xxLarge" className="hours-card__title">Open Hours</Text>

            <div className="hours-card__hours">
              <Text variant="xLarge">Mon: </Text>
              <Text variant="xLarge">9am - 5pm</Text>
            </div>

            <div className="hours-card__hours">
              <Text variant="xLarge">Tues: </Text>
              <Text variant="xLarge">9am - 5pm</Text>
            </div>

            <div className="hours-card__hours">
              <Text variant="xLarge">Wed: </Text>
              <Text variant="xLarge">9am - 5pm</Text>
            </div>

            <div className="hours-card__hours">
              <Text variant="xLarge">Thu: </Text>
              <Text variant="xLarge">9am - 5pm</Text>
            </div>

            <div className="hours-card__hours">
              <Text variant="xLarge">Fri: </Text>
              <Text variant="xLarge">9am - 5pm</Text>
            </div>

            <PrimaryButton
              className="hours-card__btn"
              onClick={() => this._showDialog("hoursDialog")}
              text="Update Hours"
            />

            <HoursDialog hidden={hoursDialog} closeDialog={this._closeDialog} />
          </div>
        </div>
      </div>
    );
  }
}

export default Profile;
