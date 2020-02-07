import * as React from "react";
import { View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Text from "../components/Text";

const Home: React.FC = () => {
  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={["#d16ba5", "#c777b9", "#ba83ca", "#aa8fd8", "#9a9ae1", "#8aa7ec", "#79b3f4", "#69bff8", "#52cffe", "#41dfff", "#46eefa", "#5ffbf1"]}
        start={{
            x: 1,
            y: 0,
        }}
        style={{
          flex: 1,
          width: "100%",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <Text>Home!</Text>
      </LinearGradient>
    </View>
  );
};

export default Home;
