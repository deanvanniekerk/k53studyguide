import * as React from "react";

import { TabNavigator } from "@/ui/navigation/TabNavigator";
import { NavigationContainer } from "@react-navigation/native";

const Container: React.FC = () => {
    return (
        <NavigationContainer>
            <TabNavigator />
        </NavigationContainer>
    );
};

export default Container;
