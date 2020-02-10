import * as Font from "expo-font";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { Provider } from "react-redux";

import { configureStore } from "@/state/configureStore";

import Container from "./src/ui/Container";

const store = configureStore();

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

    return (
        <Provider store={store}>
            <Container />
        </Provider>
    );
};

export default App;
