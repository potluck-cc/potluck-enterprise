import React, { useState, useEffect } from "react";

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

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];

const defaultHours = [
  { startTime: "CLOSED", endTime: "CLOSED", day: days[0] },
  { startTime: "CLOSED", endTime: "CLOSED", day: days[1] },
  { startTime: "CLOSED", endTime: "CLOSED", day: days[2] },
  { startTime: "CLOSED", endTime: "CLOSED", day: days[3] },
  { startTime: "CLOSED", endTime: "CLOSED", day: days[4] },
  { startTime: "CLOSED", endTime: "CLOSED", day: days[5] },
  { startTime: "CLOSED", endTime: "CLOSED", day: days[6] }
];

function HoursDialog({ hidden, closeDialog, onSave, hours = [] }) {
  const [currentHours, setHours] = useState(
    hours && hours.length ? hours : defaultHours
  );

  useEffect(() => {
    if (hours && hours.length) {
      setHours(hours);
    }
  }, [hours]);

  function renderFields(hours) {
    if (hours && hours.length < 7) {
      let hourFields = [...hours];

      for (let i = 0; i < 7; i++) {
        if (!hourFields[i]) {
          hourFields.push(
            <HoursField
              key={i}
              index={i}
              setHours={updateTimeblock}
              startTime="CLOSED"
              endTime="CLOSED"
            />
          );
        } else {
          hourFields[i] = (
            <HoursField
              key={i}
              index={i}
              setHours={updateTimeblock}
              startTime={hourFields[i].startTime}
              endTime={hourFields[i].endTime}
            />
          );
        }
      }

      return hourFields;
    }

    return hours.map((field, index) => (
      <HoursField
        key={index}
        index={index}
        setHours={updateTimeblock}
        startTime={field.startTime}
        endTime={field.endTime}
      />
    ));
  }

  function updateTimeblock(index, value, timeblock) {
    const newState = currentHours.slice();

    if (newState[index] && !newState[index].day) {
      newState[index] = {
        ...currentHours[index],
        [timeblock]: value,
        day: days[index]
      };
    } else {
      newState[index] = { ...currentHours[index], [timeblock]: value };
    }

    setHours(newState);
  }

  return (
    <Dialog
      hidden={hidden}
      onDismiss={() => closeDialog()}
      dialogContentProps={{
        type: DialogType.largeHeader,
        title: "Dispensary Hours"
      }}
      modalProps={{
        isBlocking: false,
        containerClassName: "ms-dialogMainOverride-hours"
      }}
    >
      {renderFields(currentHours)}
      <DialogFooter>
        <PrimaryButton
          onClick={async () => {
            await onSave({ hours: JSON.stringify(currentHours) });
            closeDialog();
          }}
          text="Save"
        />
        <DefaultButton onClick={() => closeDialog()} text="Cancel" />
      </DialogFooter>
    </Dialog>
  );
}

export default HoursDialog;
