import { View, TextInput, StyleSheet } from "react-native";
import React, { useState } from "react";

export default function NumberInput({
  value,
  maxLength,
  allowDecimals,
  decimals = 2,
  maxValue,
  ...props
}) {
  const [number, setNumber] = useState(value);

  const onChanged = (text) => {
    let newText = "";
    let numbers = "0123456789";

    let count = 0;
    let foundDecimal = false;
    while (
      !foundDecimal &&
      count < text.length &&
      count <= maxLength - decimals
    ) {
      if (text[count] === "." || text[count] === ",") {
        foundDecimal = true;
        newText = newText + ".";
      } else if (numbers.includes(text[count])) {
        newText = newText + text[count];
      }
      count++;
    }
    if (text[count] === "." || text[count] === ",") {
      newText = newText + ".";
      foundDecimal = true;
      count++;
    }
    if (foundDecimal) {
      for (let i = count; i < text.length; i++) {
        if (numbers.includes(text[i]) && i - count < decimals) {
          newText = newText + text[i];
        }
      }
    }

    if (parseFloat(newText) > maxValue) {
      alert(`Please enter a number less than ${maxValue}`);
      newText = newText.slice(0, -1);
    }
    setNumber(newText);
  };

  return (
    <TextInput
      keyboardType="numeric"
      value={number.toString()}
      onChangeText={(text) => onChanged(text)}
      maxLength={allowDecimals ? maxLength + decimals + 1 : maxLength}
      {...props}
    />
  );
}
