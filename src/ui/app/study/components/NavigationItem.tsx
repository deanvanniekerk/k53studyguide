import * as React from "react";
import { View } from "react-native";
import { connect } from "react-redux";

import { RootState } from "@/state";
import { translationsSelector } from "@/state/translations/selectors";
import { Text } from "@/ui/components";
import { FontAwesome } from "@expo/vector-icons";

type Props = {
    navigationItemKey: string;
} & PropsFromState;

const NavigationItemComponent: React.FC<Props> = props => {
    return (
        <View
            style={{
                flexDirection: "row",
                alignItems: "stretch",
                height: 50,
                borderWidth: 1,
            }}
        >
            <View style={{ justifyContent: "center", borderWidth: 1, borderColor: "red" }}>
                <FontAwesome
                    style={{ marginLeft: 10, marginRight: 10 }}
                    name="user-circle"
                    size={16}
                    color={"#FFFFFF"}
                />
            </View>
            <View
                style={{ flex: 1, justifyContent: "center", borderWidth: 1, borderColor: "green" }}
            >
                <Text>{props.translations[props.navigationItemKey]}</Text>
            </View>
            <View style={{ justifyContent: "center", borderWidth: 1, borderColor: "red" }}>
                <FontAwesome
                    style={{ marginLeft: 10, marginRight: 10 }}
                    name="user-circle"
                    size={16}
                    color={"#FFFFFF"}
                />
            </View>
        </View>
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    const translations = translationsSelector(state);

    return {
        translations,
    };
};

const NavigationItem = connect(mapStateToProps)(NavigationItemComponent);

export { NavigationItem };
