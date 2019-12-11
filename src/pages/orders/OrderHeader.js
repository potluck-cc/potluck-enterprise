import React, { useState } from "react";
import {
  Calendar,
  DayOfWeek,
  DateRangeType
} from "office-ui-fabric-react/lib/Calendar";
import {
  ComboBox,
  SelectableOptionMenuItemType
} from "office-ui-fabric-react/lib/index";
import { FontIcon } from "office-ui-fabric-react/lib/Icon";
import moment from "moment";

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
  weekNumberFormatString: "Week number {0}",
  prevMonthAriaLabel: "Previous month",
  nextMonthAriaLabel: "Next month",
  prevYearAriaLabel: "Previous year",
  nextYearAriaLabel: "Next year",
  prevYearRangeAriaLabel: "Previous year range",
  nextYearRangeAriaLabel: "Next year range",
  closeButtonAriaLabel: "Close"
};

const INITIAL_OPTIONS = [
  {
    key: "Header1",
    text: "Order Type",
    itemType: SelectableOptionMenuItemType.Header
  },
  { key: "new", text: "Pending" },
  { key: "accepted", text: "Accepted" },
  { key: "rejected", text: "Rejected" },
  { key: "completed", text: "Completed" },
  { key: "divider", text: "-", itemType: SelectableOptionMenuItemType.Divider },
  {
    key: "Header2",
    text: "Recent Searches",
    itemType: SelectableOptionMenuItemType.Header
  }
];

const baseOptions = ["new", "accepted", "rejected", "completed"];

export default ({ setStatus, setActiveSearchCode, setDateRange }) => {
  const [selectedKeys, selectKey] = useState(INITIAL_OPTIONS[0].key);
  const [options, setOptions] = useState(INITIAL_OPTIONS);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <div className="list-header">
      <ComboBox
        allowFreeform={true}
        autoComplete={false}
        options={options}
        selectedKey={selectedKeys}
        placeholder="Search for an order here or select one of the predefined filters."
        className="list-header-combobox"
        onChange={(event, option, index, value) => {
          if (option) {
            // User selected/de-selected an existing option
            selectKey(option.key);
            if (baseOptions.includes(option.key)) {
              setActiveSearchCode(null);
              setStatus(option.key);
            } else {
              setStatus(null);
              setActiveSearchCode(option.key);
            }
          } else if (value !== undefined) {
            // User typed a freeform option
            const newOption = { key: value, text: value };
            setOptions(currOptions => [...currOptions, newOption]);
            selectKey(newOption.key);
            setActiveSearchCode(newOption.key);
            setStatus(null);
          }
        }}
      />

      <button
        className="datepicker-button"
        onClick={() => setIsCalendarOpen(true)}
      >
        <FontIcon iconName="Calendar" />
      </button>

      <Calendar
        onSelectDate={(date, dateRangeArray) => {
          setDateRange({
            from: moment(dateRangeArray[0]).unix(),
            to: moment(dateRangeArray[dateRangeArray.length - 1]).unix()
          });

          setSelectedDate(date);

          setIsCalendarOpen(false);
        }}
        dateRangeType={DateRangeType.Week}
        value={selectedDate}
        firstDayOfWeek={DayOfWeek.Sunday}
        strings={DayPickerStrings}
        isDayPickerVisible
        isMonthPickerVisible
        className={isCalendarOpen ? "calendar" : "calendar-invisible"}
        onDismiss={() => setIsCalendarOpen(false)}
        highlightCurrentMonth
        highlightSelectedMonth
      />

      {/* <DatePicker
        firstDayOfWeek={DayOfWeek.Sunday}
        strings={DayPickerStrings}
        placeholder={null}
        ariaLabel="Select a date"
        onSelectDate={date => onSelectDate(date)}
        value={rawDate}
        className="list-header-datepicker"
      /> */}
    </div>
  );
};
