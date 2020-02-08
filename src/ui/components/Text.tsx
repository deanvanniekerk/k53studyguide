import React from "react";
import { StyleSheet, Text as TextRN, TextStyle } from "react-native";

type Props = {
    style?: TextStyle;
};

const Text: React.FC<Props> = props => {
    const style = props.style || {};
    return <TextRN style={[styles.text, style]}>{props.children}</TextRN>;
};

const styles = StyleSheet.create({
    text: {
        fontFamily: "Roboto Condensed",
        color: "#FFFFFF",
    },
});

export { Text };
