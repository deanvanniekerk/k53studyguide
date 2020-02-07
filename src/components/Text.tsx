import React from "react";
import { StyleSheet, Text as TextRN, TextStyle } from "react-native";

type Props = {
  style?: TextStyle;
};

const Text: React.FC<Props> = props => {
  const style = props.style || {};
  const merged = {
    ...styles.text,
    ...style
  };

  return <TextRN style={merged}>{props.children}</TextRN>;
};

const styles = StyleSheet.create({
  text: {
    fontFamily: "Roboto Condensed"
  }
});

export default Text;
