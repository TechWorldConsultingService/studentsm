import React from "react";
import dayjs from "dayjs";
import { DatePicker } from "antd";

const { RangePicker } = DatePicker;

const rangePresets = [
  { label: "Last 7 Days", value: [dayjs().add(-7, "d"), dayjs()] },
  { label: "Last 14 Days", value: [dayjs().add(-14, "d"), dayjs()] },
  { label: "Last 30 Days", value: [dayjs().add(-30, "d"), dayjs()] },
  { label: "Last 90 Days", value: [dayjs().add(-90, "d"), dayjs()] },
];

export default function DateRangePicker({
  presets = true,
  handleDateChange,
} = {}) {
  const onRangeChange = (dates, dateStrings) => {
    if (dates) {
      console.log("From: ", dates[0], ", to: ", dates[1]);
      console.log("From: ", dateStrings[0], ", to: ", dateStrings[1]);

      handleDateChange({
        from: dateStrings[0],
        to: dateStrings[1],
        fromDate: dates[0],
        toDate: dates[1],
      });
    } else {
      handleDateChange({
        from: null,
        to: null,
        fromDate: null,
        toDate: null,
      });
    }
  };

  return (
    <RangePicker
      onChange={onRangeChange}
      presets={presets ? rangePresets : []}
    />
  );
}
