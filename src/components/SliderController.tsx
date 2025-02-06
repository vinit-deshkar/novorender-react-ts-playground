import { FunctionComponent } from "react";
import { Slider, Typography } from "@mui/material";

interface SliderControllerProps {
  label: string;
  minValue: number;
  maxValue: number;
  defaultValue?: number;
  onValueChange: (value: number) => void;
}

export const SliderController: FunctionComponent<SliderControllerProps> = (
  props
) => {
  const { label, minValue, maxValue, defaultValue, onValueChange } = props;

  const marks = [
    {
      value: minValue,
      label: minValue,
    },
    {
      value: maxValue,
      label: maxValue,
    },
  ];
  const handleChange = (_event: Event, newValue: number | number[]) => {
    if (typeof newValue === "number") {
      onValueChange(newValue);
    }
  };
  return (
    <>
      <Typography id="input-slider" gutterBottom>
        {label}
      </Typography>
      <Slider
        size="medium"
        defaultValue={defaultValue ? defaultValue : 1}
        marks={marks}
        step={0.5}
        valueLabelDisplay="auto"
        min={minValue}
        max={maxValue}
        onChange={handleChange}
      />
    </>
  );
};
