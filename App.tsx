import React, { useEffect, useState } from "react";
import * as Font from "expo-font";
import Container from "./src/Container";
import { View, Text } from "react-native";

export default function App() {
  const [fontLoaded, setFontLoaded] = useState(false);
  useEffect(() => {
    const loadFont = async () => {
      await Font.loadAsync({
        "Roboto Condensed": require("./assets/fonts/RobotoCondensed-Regular.ttf"),
      });
      setFontLoaded(true);
    };

    loadFont();
  }, []);

  if (!fontLoaded) return <View><Text>Loading</Text></View>;

  return <Container />;
}
