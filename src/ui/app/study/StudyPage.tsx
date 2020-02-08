import * as React from "react";
import { View } from "react-native";

import { Text } from "@/ui/components";
import { Page } from "@/ui/components/Page";

const backgroundColors = [
    "#d16ba5",
    "#c777b9",
    "#ba83ca",
    "#aa8fd8",
    "#9a9ae1",
    "#8aa7ec",
    "#79b3f4",
    "#69bff8",
    "#52cffe",
    "#41dfff",
    "#46eefa",
    "#5ffbf1",
].reverse();

const StudyPage: React.FC = () => {
    return (
        <Page backgroundColors={backgroundColors}>
            <View
                style={{ flex: 1, width: "100%", alignItems: "center", justifyContent: "center" }}
            >
                <Text>Study!</Text>
            </View>
        </Page>
    );
};

export { StudyPage };
