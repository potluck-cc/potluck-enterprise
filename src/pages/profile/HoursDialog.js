import React from "react";

import {
  Dialog,
  DialogType,
  DialogFooter
} from "office-ui-fabric-react/lib/Dialog";
import {
  PrimaryButton,
  DefaultButton
} from "office-ui-fabric-react/lib/Button";
import { Text } from "office-ui-fabric-react/lib/Text";
import {
  Dropdown,
  DropdownMenuItemType
} from "office-ui-fabric-react/lib/Dropdown";

export default ({ hidden, closeDialog }) => (
  <Dialog
    hidden={hidden}
    onDismiss={() => closeDialog("hoursDialog")}
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
      <PrimaryButton onClick={() => closeDialog("hoursDialog")} text="Save" />
      <DefaultButton onClick={() => closeDialog("hoursDialog")} text="Cancel" />
    </DialogFooter>
  </Dialog>
);
