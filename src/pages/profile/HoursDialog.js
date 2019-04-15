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

import HoursField from "./HoursField";

import ProfileContext from "./profileContext";

export default class HoursDialog extends Component {
  state = {
    fields: [],
    hours: []
  };

  renderFields = store => {
    const fields = [];
    if (store.hours.length) {
      store.hours.forEach((timeBlock, index) => {
        const processedTimeBlock = timeBlock.split(/[\s-]+/);
        fields.push(
          <HoursField
            key={index}
            index={index}
            setHours={this.setHours}
            startTime={processedTimeBlock[0]}
            endTime={
              processedTimeBlock[0] === "CLOSED"
                ? "CLOSED"
                : processedTimeBlock[processedTimeBlock.length - 1]
            }
          />
        );
      });
    } else {
      for (let i = 0; i < 7; i++) {
        fields.push(<HoursField key={i} index={i} setHours={this.setHours} />);
      }
    }

    return fields;
  };

  setHours = (index, value) => {
    const { hours } = this.state;

    const hoursCopy = hours.slice();
    hoursCopy[index] = value;

    this.setState({
      hours: hoursCopy
    });
  };

  _onSave = () => {
    const { closeDialog, onSave } = this.props;
    onSave(this.state.hours);
    closeDialog("hoursDialog");
  };

  render() {
    const { hidden, closeDialog } = this.props;
    return (
      <ProfileContext.Consumer>
        {({ store }) => (
          <Dialog
            hidden={hidden}
            onDismiss={() => closeDialog("hoursDialog")}
            dialogContentProps={{
              type: DialogType.largeHeader,
              title: "Dispensary Hours"
            }}
            modalProps={{
              isBlocking: false,
              containerClassName: "ms-dialogMainOverride-hours"
            }}
          >
            {this.renderFields(store)}
            <DialogFooter>
              <PrimaryButton onClick={() => this._onSave} text="Save" />
              <DefaultButton
                onClick={() => closeDialog("hoursDialog")}
                text="Cancel"
              />
            </DialogFooter>
          </Dialog>
        )}
      </ProfileContext.Consumer>
    );
  }
}
