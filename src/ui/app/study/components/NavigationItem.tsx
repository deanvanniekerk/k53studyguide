import * as React from "react";
import { View } from "react-native";
import { connect } from "react-redux";

import { RootState } from "@/state";
import { translationsSelector } from "@/state/translations/selectors";
import { Text } from "@/ui/components";

type Props = {
    navigationItemKey: string;
} & PropsFromState;

const NavigationItemComponent: React.FC<Props> = props => {
    return (
        <View style={{ flex: 1, width: "100%", alignItems: "center", justifyContent: "center" }}>
            <Text>{props.translations[props.navigationItemKey]}</Text>
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
