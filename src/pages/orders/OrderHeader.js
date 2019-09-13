import React from "react";

import { DatePicker, DayOfWeek } from "office-ui-fabric-react/lib/DatePicker";
import { Checkbox } from "office-ui-fabric-react/lib/Checkbox";

const DayPickerStrings = {
  months: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ],

  shortMonths: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ],

  days: [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ],

  shortDays: ["S", "M", "T", "W", "T", "F", "S"],

  goToToday: "Go to today",
  prevMonthAriaLabel: "Go to previous month",
  nextMonthAriaLabel: "Go to next month",
  prevYearAriaLabel: "Go to previous year",
  nextYearAriaLabel: "Go to next year",
  closeButtonAriaLabel: "Close date picker"
};

export default ({
  onCheckboxChange,
  selectedCheckbox,
  onSelectDate,
  rawDate
}) => (
  <div className="list__header">
    <span className="list__options">
      <Checkbox
        label="New"
        onChange={() => onCheckboxChange("new")}
        checked={selectedCheckbox === "new"}
      />
      <Checkbox
        label="Accepted"
        onChange={() => onCheckboxChange("accepted")}
        checked={selectedCheckbox === "accepted"}
      />
      <Checkbox
        label="Rejected"
        onChange={() => onCheckboxChange("rejected")}
        checked={selectedCheckbox === "rejected"}
      />
    </span>
    <span className="list__datepicker">
      <DatePicker
        firstDayOfWeek={DayOfWeek.Sunday}
        strings={DayPickerStrings}
        placeholder="Select a date..."
        ariaLabel="Select a date"
        onSelectDate={date => onSelectDate(date)}
        value={rawDate}
      />
    </span>
  </div>
);
