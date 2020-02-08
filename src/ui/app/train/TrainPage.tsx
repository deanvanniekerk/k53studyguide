import * as React from "react";
import { View } from "react-native";

import { Text } from "@/ui/components";
import { Page } from "@/ui/components/Page";

const backgroundColors = [
    "#845ec2",
    "#965dc0",
    "#a75dbe",
    "#b75cbb",
    "#c55cb7",
    "#d55daf",
    "#e25fa6",
    "#ed639d",
    "#f86c8f",
    "#fe7982",
    "#ff8778",
    "#ff9671",
].reverse();

const TrainPage: React.FC = () => {
    return (
        <Page backgroundColors={backgroundColors}>
            <View
                style={{ flex: 1, width: "100%", alignItems: "center", justifyContent: "center" }}
            >
                <Text>Train!</Text>
            </View>
        </Page>
    );
};

export { TrainPage };
