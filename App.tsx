import * as Font from "expo-font";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";

import Container from "./src/ui/Container";

const App: React.FC = () => {
    const [fontLoaded, setFontLoaded] = useState(false);
    useEffect(() => {
        const loadFont = async (): Promise<void> => {
            await Font.loadAsync({
                "Roboto Condensed": require("./assets/fonts/RobotoCondensed-Regular.ttf"),
            });
            setFontLoaded(true);
        };

        loadFont();
    }, []);

    if (!fontLoaded)
        return (
            <View>
                <Text>Loading</Text>
            </View>
        );

    return <Container />;
};

export default App;
