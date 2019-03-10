import React, { Component } from "react";
import "./profile.scss";

import {
  Persona,
  PersonaInitialsColor,
  PersonaSize
} from "office-ui-fabric-react/lib/Persona";
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
import { Text } from "office-ui-fabric-react/lib/Text";
import {
  Dropdown,
  DropdownMenuItemType
} from "office-ui-fabric-react/lib/Dropdown";

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
    return (
      <div className="profile">
        <div className="profile__details">
          <Persona
            {...personaWithInitials}
            initialsColor={PersonaInitialsColor.teal}
            coinSize={250}
            onClick={() => this._showDialog("infoDialog")}
            size={PersonaSize.size72}
            imageAlt="GS"
            imageUrl={
              "https://static1.squarespace.com/static/56ba0d5659827eedd59d1ea1/t/596e5870be6594279e89fde0/1500403846718/Dispensary.png?format=2500w"
            }
            className="profile__info"
            imageShouldFadeIn
          />
          <Dialog
            hidden={this.state.infoDialog}
            onDismiss={() => this._closeDialog("infoDialog")}
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
            <TextField
              label="Dispensary Name"
              defaultValue="Garden State Dispensary"
            />
            <TextField
              label="Address"
              defaultValue="950 US-1, Woodbridge, NJ 07095"
            />
            <TextField label="Phone Number" defaultValue="(973) 220 - 1995" />
            <DialogFooter>
              <PrimaryButton
                onClick={() => this._closeDialog("infoDialog")}
                text="Save"
              />
              <DefaultButton
                onClick={() => this._closeDialog("infoDialog")}
                text="Cancel"
              />
            </DialogFooter>
          </Dialog>
        </div>
        <div className="profile__other">
          <div className="hours-card">
            <Text variant="mega">Open Hours</Text>

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

            <Dialog
              hidden={this.state.hoursDialog}
              onDismiss={() => this._closeDialog("hoursDialog")}
              minWidth="75%"
              dialogContentProps={{
                type: DialogType.largeHeader,
                title: "Store Hours",
                subText: "Lorem ipsum dolor sit amet."
              }}
              modalProps={{
                isBlocking: false,
                containerClassName: "ms-dialogMainOverride"
              }}
            >
              <div className="hours-field">
                <Dropdown
                  placeholder="Select an Option"
                  ariaLabel="Basic dropdown example"
                  options={[
                    {
                      key: "Header",
                      itemType: DropdownMenuItemType.Header
                    },
                    { key: "A", text: "Mon - Fri" },
                    { key: "B", text: "Sat - Sun" },
                    { key: "C", text: "Monday - Sunday" },
                    {
                      key: "divider_2",
                      text: "-",
                      itemType: DropdownMenuItemType.Divider
                    },
                    {
                      key: "Header2",
                      itemType: DropdownMenuItemType.Header
                    },
                    { key: "F", text: "Mon" },
                    { key: "G", text: "Tue" },
                    { key: "H", text: "Wed" },
                    { key: "I", text: "Thu" },
                    { key: "J", text: "Fri" },
                    { key: "J", text: "Sat" },
                    { key: "J", text: "Sun" }
                  ]}
                  selectedKey={"C"}
                />
                <Text className="hours-field__text" variant="xLarge">
                  From
                </Text>
                <Dropdown
                  placeholder="Select an Option"
                  ariaLabel="Basic dropdown example"
                  options={[
                    {
                      key: "Header2",
                      itemType: DropdownMenuItemType.Header
                    },
                    { key: "F", text: "5:00am" },
                    { key: "F", text: "5:30am" },
                    { key: "G", text: "6:00am" },
                    { key: "H", text: "6:30am" },
                    { key: "I", text: "7:00am" },
                    { key: "J", text: "7:30am" },
                    { key: "J", text: "8:00am" },
                    { key: "J", text: "8:30am" },
                    { key: "L", text: "9:00am" },
                    { key: "J", text: "9:30am" },
                    { key: "J", text: "10:00am" },
                    { key: "J", text: "10:30am" },
                    { key: "J", text: "11:00am" },
                    { key: "J", text: "11:30am" },
                    { key: "J", text: "12:00pm" },
                    { key: "J", text: "12:30pm" },
                    { key: "J", text: "1:00pm" },
                    { key: "J", text: "1:30pm" },
                    { key: "J", text: "2:00pm" },
                    { key: "J", text: "2:30pm" },
                    { key: "J", text: "3:00pm" },
                    { key: "J", text: "3:30pm" },
                    { key: "J", text: "4:00pm" },
                    { key: "J", text: "4:30pm" },
                    { key: "J", text: "5:00pm" },
                    { key: "J", text: "5:30pm" },
                    { key: "J", text: "6:00pm" },
                    { key: "J", text: "6:30pm" },
                    { key: "J", text: "7:00pm" },
                    { key: "J", text: "7:30pm" },
                    { key: "J", text: "8:00pm" },
                    { key: "J", text: "8:30pm" },
                    { key: "J", text: "9:00pm" },
                    { key: "J", text: "9:30pm" },
                    { key: "J", text: "10:00pm" },
                    { key: "J", text: "10:30pm" },
                    { key: "J", text: "11:00pm" },
                    { key: "J", text: "11:30pm" },
                    { key: "J", text: "12:00am" },
                    { key: "J", text: "12:30am" }
                  ]}
                  selectedKey={"L"}
                />
                <Text className="hours-field__text" variant="xLarge">
                  To
                </Text>
                <Dropdown
                  placeholder="Select an Option"
                  ariaLabel="Basic dropdown example"
                  options={[
                    {
                      key: "Header2",
                      itemType: DropdownMenuItemType.Header
                    },
                    { key: "F", text: "5:00am" },
                    { key: "F", text: "5:30am" },
                    { key: "G", text: "6:00am" },
                    { key: "H", text: "6:30am" },
                    { key: "I", text: "7:00am" },
                    { key: "J", text: "7:30am" },
                    { key: "J", text: "8:00am" },
                    { key: "J", text: "8:30am" },
                    { key: "J", text: "9:00am" },
                    { key: "J", text: "9:30am" },
                    { key: "J", text: "10:00am" },
                    { key: "J", text: "10:30am" },
                    { key: "J", text: "11:00am" },
                    { key: "J", text: "11:30am" },
                    { key: "J", text: "12:00pm" },
                    { key: "J", text: "12:30pm" },
                    { key: "J", text: "1:00pm" },
                    { key: "J", text: "1:30pm" },
                    { key: "J", text: "2:00pm" },
                    { key: "J", text: "2:30pm" },
                    { key: "J", text: "3:00pm" },
                    { key: "J", text: "3:30pm" },
                    { key: "J", text: "4:00pm" },
                    { key: "J", text: "4:30pm" },
                    { key: "L", text: "5:00pm" },
                    { key: "J", text: "5:30pm" },
                    { key: "J", text: "6:00pm" },
                    { key: "J", text: "6:30pm" },
                    { key: "J", text: "7:00pm" },
                    { key: "J", text: "7:30pm" },
                    { key: "J", text: "8:00pm" },
                    { key: "J", text: "8:30pm" },
                    { key: "J", text: "9:00pm" },
                    { key: "J", text: "9:30pm" },
                    { key: "J", text: "10:00pm" },
                    { key: "J", text: "10:30pm" },
                    { key: "J", text: "11:00pm" },
                    { key: "J", text: "11:30pm" },
                    { key: "J", text: "12:00am" },
                    { key: "J", text: "12:30am" }
                  ]}
                  selectedKey={"L"}
                />
              </div>

              <DialogFooter>
                <PrimaryButton onClick={() => {}} text="Add Field" />
                <PrimaryButton
                  onClick={() => this._closeDialog("hoursDialog")}
                  text="Save"
                />
                <DefaultButton
                  onClick={() => this._closeDialog("hoursDialog")}
                  text="Cancel"
                />
              </DialogFooter>
            </Dialog>
          </div>
        </div>
      </div>
    );
  }
}

export default Profile;
