import React from "react";
import { StyleSheet, View } from "react-native";

import { TEXT_COLOR } from "@/data/theme";

import { hexToRgb } from "../utils/color";

type Props = {
    progress: number;
    backgroundColor?: string;
    backgroundOpacity?: number;
    foregroundColor?: string;
    foregroundOpacity?: number;
    height?: number;
};

const ProgressBar: React.FC<Props> = props => {
    const width = `${props.progress}%`;

    return (
        <View style={styles.container}>
            <View
                style={[
                    styles.progressBar,
                    {
                        backgroundColor: `rgba(${hexToRgb(props.backgroundColor || TEXT_COLOR).join(
                            ","
                        )}, ${props.backgroundOpacity})`,
                        height: props.height,
                        borderRadius: props.height,
                    },
                ]}
            >
                <View
                    style={[
                        StyleSheet.absoluteFill,
                        {
                            backgroundColor: `rgba(${hexToRgb(
                                props.foregroundColor || TEXT_COLOR
                            ).join(",")}, ${props.foregroundOpacity})`,
                            width,
                            borderRadius: props.height,
                        },
                    ]}
                />
            </View>
        </View>
    );
};
ProgressBar.defaultProps = {
    backgroundOpacity: 0.1,
    backgroundColor: TEXT_COLOR,
    foregroundOpacity: 0.4,
    foregroundColor: TEXT_COLOR,
    height: 4,
};

export { ProgressBar };

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
    },
    progressBar: {
        flexDirection: "row",
        width: "100%",
        borderRadius: 4,
    },
});
