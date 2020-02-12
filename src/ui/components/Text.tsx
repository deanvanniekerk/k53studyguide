import React from "react";
import { StyleSheet, Text as TextRN, TextStyle } from "react-native";

import { FONT_FAMILY, FONT_SIZE, TEXT_COLOR } from "@/data/theme";

type Props = {
    style?: TextStyle;
};

const Text: React.FC<Props> = props => {
    const style = props.style || {};
    return <TextRN style={[styles.text, style]}>{props.children}</TextRN>;
};

const styles = StyleSheet.create({
    text: {
        fontFamily: FONT_FAMILY,
        fontSize: FONT_SIZE,
        color: TEXT_COLOR,
    },
});

export { Text };
