import React, { Component } from "react";

import { Text } from "office-ui-fabric-react/lib/Text";
import {
  Dropdown,
  DropdownMenuItemType
} from "office-ui-fabric-react/lib/Dropdown";

const times = [
  { key: "CLOSED", text: "CLOSED" },
  { key: "5:00am", text: "5:00am" },
  { key: "5:30am", text: "5:30am" },
  { key: "6:00am", text: "6:00am" },
  { key: "6:30am", text: "6:30am" },
  { key: "7:00am", text: "7:00am" },
  { key: "7:30am", text: "7:30am" },
  { key: "8:00am", text: "8:00am" },
  { key: "8:30am", text: "8:30am" },
  { key: "9:00am", text: "9:00am" },
  { key: "9:30am", text: "9:30am" },
  { key: "10:00am", text: "10:00am" },
  { key: "10:30am", text: "10:30am" },
  { key: "11:00am", text: "11:00am" },
  { key: "11:30am", text: "11:30am" },
  { key: "12:00pm", text: "12:00pm" },
  { key: "12:30pm", text: "12:30pm" },
  { key: "1:00pm", text: "1:00pm" },
  { key: "1:30pm", text: "1:30pm" },
  { key: "2:00pm", text: "2:00pm" },
  { key: "2:30pm", text: "2:30pm" },
  { key: "3:00pm", text: "3:00pm" },
  { key: "3:30pm", text: "3:30pm" },
  { key: "4:00pm", text: "4:00pm" },
  { key: "4:30pm", text: "4:30pm" },
  { key: "5:00pm", text: "5:00pm" },
  { key: "5:30pm", text: "5:30pm" },
  { key: "6:00pm", text: "6:00pm" },
  { key: "6:30pm", text: "6:30pm" },
  { key: "7:00pm", text: "7:00pm" },
  { key: "7:30pm", text: "7:30pm" },
  { key: "8:00pm", text: "8:00pm" },
  { key: "8:30pm", text: "8:30pm" },
  { key: "9:00pm", text: "9:00pm" },
  { key: "9:30pm", text: "9:30pm" },
  { key: "10:00pm", text: "10:00pm" },
  { key: "10:30pm", text: "10:30pm" },
  { key: "11:00pm", text: "11:00pm" },
  { key: "11:30pm", text: "11:30pm" },
  { key: "12:00am", text: "12:00am" },
  { key: "12:30am", text: "12:30am" }
];

export default class HoursField extends Component {
  state = {
    startTimeBlock: "",
    endTimeBlock: "",
    defaultStartTime: null,
    defaultEndTime: null
  };

  componentDidMount() {
    const { startTime, endTime } = this.props;
    if (startTime && endTime) {
      this.setState({
        defaultStartTime: startTime,
        defaultEndTime: endTime
      });
    }
  }

  createHours = () => {
    const { startTimeBlock, endTimeBlock } = this.state;
    const { index, setHours } = this.props;

    setHours(index, `${startTimeBlock} - ${endTimeBlock}`);
  };

  setTimeBlock = (block, value) => {
    this.setState({ [block]: value }, () => {
      const { startTimeBlock, endTimeBlock } = this.state;
      if (startTimeBlock.length && endTimeBlock.length) {
        this.createHours();
      }
    });
  };

  render() {
    const { index } = this.props;
    const {
      defaultStartTime,
      defaultEndTime,
      startTimeBlock,
      endTimeBlock
    } = this.state;

    return (
      <div className="hours-field">
        <Dropdown
          placeholder="Select an Option"
          ariaLabel="Basic dropdown example"
          options={[
            {
              key: "Header",
              itemType: DropdownMenuItemType.Header
            },
            { key: 0, text: "Mon" },
            { key: 1, text: "Tue" },
            { key: 2, text: "Wed" },
            { key: 3, text: "Thu" },
            { key: 4, text: "Fri" },
            { key: 5, text: "Sat" },
            { key: 6, text: "Sun" }
          ]}
          selectedKey={index}
          dropdownWidth={100}
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
          selectedKey={startTimeBlock ? startTimeBlock : defaultStartTime}
          onChange={(e, item) => this.setTimeBlock("startTimeBlock", item.text)}
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
          selectedKey={endTimeBlock ? endTimeBlock : defaultEndTime}
          onChange={(e, item) => this.setTimeBlock("endTimeBlock", item.text)}
          dropdownWidth={100}
        />
      </div>
    );
  }
}
