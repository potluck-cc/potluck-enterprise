import React from "react";

import { Text } from "office-ui-fabric-react/lib/Text";
import {
  Dropdown,
  DropdownMenuItemType
} from "office-ui-fabric-react/lib/Dropdown";

const times = [
  { key: "CLOSED", text: "CLOSED" },
  { key: "5:00 AM", text: "5:00 AM" },
  { key: "5:30 AM", text: "5:30 AM" },
  { key: "6:00 AM", text: "6:00 AM" },
  { key: "6:30 AM", text: "6:30 AM" },
  { key: "7:00 AM", text: "7:00 AM" },
  { key: "7:30 AM", text: "7:30 AM" },
  { key: "8:00 AM", text: "8:00 AM" },
  { key: "8:30 AM", text: "8:30 AM" },
  { key: "9:00 AM", text: "9:00 AM" },
  { key: "9:30 AM", text: "9:30 AM" },
  { key: "10:00 AM", text: "10:00 AM" },
  { key: "10:30 AM", text: "10:30 AM" },
  { key: "11:00 AM", text: "11:00 AM" },
  { key: "11:30 AM", text: "11:30 AM" },
  { key: "12:00 PM", text: "12:00 PM" },
  { key: "12:30 PM", text: "12:30 PM" },
  { key: "1:00 PM", text: "1:00 PM" },
  { key: "1:30 PM", text: "1:30 PM" },
  { key: "2:00 PM", text: "2:00 PM" },
  { key: "2:30 PM", text: "2:30 PM" },
  { key: "3:00 PM", text: "3:00 PM" },
  { key: "3:30 PM", text: "3:30 PM" },
  { key: "4:00 PM", text: "4:00 PM" },
  { key: "4:30 PM", text: "4:30 PM" },
  { key: "5:00 PM", text: "5:00 PM" },
  { key: "5:30 PM", text: "5:30 PM" },
  { key: "6:00 PM", text: "6:00 PM" },
  { key: "6:30 PM", text: "6:30 PM" },
  { key: "7:00 PM", text: "7:00 PM" },
  { key: "7:30 PM", text: "7:30 PM" },
  { key: "8:00 PM", text: "8:00 PM" },
  { key: "8:30 PM", text: "8:30 PM" },
  { key: "9:00 PM", text: "9:00 PM" },
  { key: "9:30 PM", text: "9:30 PM" },
  { key: "10:00 PM", text: "10:00 PM" },
  { key: "10:30 PM", text: "10:30 PM" },
  { key: "11:00 PM", text: "11:00 PM" },
  { key: "11:30 PM", text: "11:30 PM" },
  { key: "12:00 AM", text: "12:00 AM" },
  { key: "12:30 AM", text: "12:30 AM" }
];

export default ({ index, setHours, startTime, endTime }) => (
  <div className="hours-field">
    <Dropdown
      className="hours-field__dropdown"
      placeholder="Select an Option"
      ariaLabel="Basic dropdown example"
      options={[
        {
          key: "Header",
          itemType: DropdownMenuItemType.Header
        },
        { key: 0, text: "Sun" },
        { key: 1, text: "Mon" },
        { key: 2, text: "Tues" },
        { key: 3, text: "Wed" },
        { key: 4, text: "Thurs" },
        { key: 5, text: "Fri" },
        { key: 6, text: "Sat" }
      ]}
      selectedKey={index}
      dropdownWidth={100}
      disabled
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
        ...times
      ]}
      selectedKey={startTime}
      onChange={(e, item) => setHours(index, item.text, "startTime")}
      dropdownWidth={100}
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
        ...times
      ]}
      selectedKey={endTime}
      onChange={(e, item) => setHours(index, item.text, "endTime")}
      dropdownWidth={100}
    />
  </div>
);
