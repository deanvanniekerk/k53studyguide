import * as React from "react";

import { ProfilePage } from "@/ui/app/profile/ProfilePage";
import { StudyContainer } from "@/ui/app/study/StudyContainer";
import { TrainPage } from "@/ui/app/train/TrainPage";
import { Text } from "@/ui/components";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { BottomTabBarOptions, createBottomTabNavigator } from "@react-navigation/bottom-tabs";

const Tab = createBottomTabNavigator();

const TabNavigator: React.FC = () => {
    const screenOptions = ({ route }): object => {
        return {
            tabBarIcon: ({ color, size }): React.ReactNode => {
                switch (route.name) {
                    case "Study":
                        return <FontAwesome name="book" size={size} color={color} />;
                    case "Train":
                        return (
                            <MaterialCommunityIcons name="ninja" size={size * 1.1} color={color} />
                        );
                    case "Profile":
                        return <FontAwesome name="user-circle" size={size} color={color} />;
                    default:
                        return <FontAwesome name="user-circle" size={size} color={color} />;
                }
            },
            tabBarLabel: ({ color }): React.ReactNode => {
                return (
                    <Text style={{ color: color, fontSize: 13, fontWeight: "bold" }}>
                        {route.name}
                    </Text>
                );
            },
        };
    };

    const tabBarOptions: BottomTabBarOptions = {
        activeTintColor: "#FFFFFF",
        inactiveTintColor: "#7a608a",
        style: {
            backgroundColor: "#311343",
        },
        tabStyle: {
            paddingTop: 6,
            paddingBottom: 3,
        },
    };

    return (
        <Tab.Navigator
            initialRouteName="Study"
            screenOptions={screenOptions}
            tabBarOptions={tabBarOptions}
        >
            <Tab.Screen name="Study" component={StudyContainer} />
            <Tab.Screen name="Train" component={TrainPage} />
            <Tab.Screen name="Profile" component={ProfilePage} />
        </Tab.Navigator>
    );
};

export { TabNavigator };
