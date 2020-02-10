import * as React from "react";

import { createStackNavigator } from "@react-navigation/stack";

import { HomePage } from "./home/HomePage";
import { NavigatorPage } from "./navigator/NavigatorPage";

const Stack = createStackNavigator();

const StudyContainer: React.FC = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="StudyHome" component={HomePage} />
            <Stack.Screen name="StudyNavigator" component={NavigatorPage} />
        </Stack.Navigator>
    );
};

export { StudyContainer };
