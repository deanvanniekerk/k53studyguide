import React from "react";
import { StyleSheet, View } from "react-native";

type Props = {
    progress: number;
};

const ProgressBar: React.FC<Props> = props => {
    const width = `${props.progress}%`;

    return (
        <View style={styles.container}>
            <View style={styles.progressBar}>
                <View
                    style={[
                        StyleSheet.absoluteFill,
                        { borderRadius: 5, backgroundColor: "rgba(255, 255, 255, 0.4)", width },
                    ]}
                />
            </View>
        </View>
    );
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
        height: 4,
        width: "100%",
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        borderRadius: 4,
    },
});
