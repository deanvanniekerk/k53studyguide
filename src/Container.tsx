import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";

import Text from "./components/Text";
import Home from "./home/Home";
import Settings from "./settings/Settings";

const Tab = createBottomTabNavigator();

const Container: React.FC = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            switch (route.name) {
              case "Study":
                return <FontAwesome name="book" size={size} color={color} />;
              case "Train":
                return (
                  <MaterialCommunityIcons
                    name="ninja"
                    size={size * 1.1}
                    color={color}
                  />
                );
              case "Profile":
                return (
                  <FontAwesome name="user-circle" size={size} color={color} />
                );
            }
          },
          tabBarLabel: ({ color }) => {
              return <Text style={{ color: color, fontSize: 13, fontWeight: "bold" }}>{route.name}</Text>
          }
        })}
        tabBarOptions={{
          activeTintColor: "#FFFFFF",
          inactiveTintColor: "#7a608a",
          style: {
            backgroundColor: "#311343"
          },
          tabStyle: {
              paddingTop: 6,
              paddingBottom: 3,
          }
        }}
      >
        <Tab.Screen name="Study" component={Home}  />
        <Tab.Screen name="Train" component={Home} />
        <Tab.Screen name="Profile" component={Settings} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default Container;
