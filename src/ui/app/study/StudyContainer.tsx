import React from "react";

import { createStackNavigator, TransitionPresets } from "@react-navigation/stack";

import { ContentPage } from "./content/ContentPage";
import { HomePage } from "./home/HomePage";

const Stack = createStackNavigator();

const StudyContainer: React.FC = () => {
    const defaultTransition = TransitionPresets.ModalSlideFromBottomIOS;
    return (
        <Stack.Navigator initialRouteName="StudyHome" screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name="StudyHome"
                component={HomePage}
                options={{ ...defaultTransition }}
            />
            <Stack.Screen
                name="StudyContent"
                component={ContentPage}
                options={{ ...defaultTransition }}
            />
        </Stack.Navigator>
    );
};

export { StudyContainer };
