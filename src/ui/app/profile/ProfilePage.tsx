import React from "react";
import { View } from "react-native";

import { Page, Text } from "@/ui/components";

const backgroundColors = [
    "#008f7a",
    "#008f81",
    "#008f88",
    "#008f8e",
    "#008f94",
    "#008f9c",
    "#008ea3",
    "#008daa",
    "#008bb5",
    "#0089bf",
    "#0085c8",
    "#0081cf",
].reverse();

const ProfilePage: React.FC = () => {
    return (
        <Page backgroundColors={backgroundColors}>
            <View
                style={{ flex: 1, width: "100%", alignItems: "center", justifyContent: "center" }}
            >
                <Text>Profile!</Text>
            </View>
        </Page>
    );
};

export { ProfilePage };
