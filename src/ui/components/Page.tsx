import { LinearGradient } from "expo-linear-gradient";
import * as React from "react";
import { SafeAreaView } from "react-native";

type Props = {
    backgroundColors: string[];
};

const Page: React.FC<Props> = props => {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <LinearGradient
                colors={props.backgroundColors}
                start={{
                    x: 1,
                    y: 0,
                }}
                style={{
                    flex: 1,
                    width: "100%",
                }}
            >
                {props.children}
            </LinearGradient>
        </SafeAreaView>
    );
};

export { Page };
