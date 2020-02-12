import React from "react";
import { View } from "react-native";

import { Text } from "@/ui/components";

const Header: React.FC = () => {
    return (
        <View
            style={{ height: 100, width: "100%", alignItems: "center", justifyContent: "center" }}
        >
            <Text>Study!</Text>
        </View>
    );
};

export { Header };
