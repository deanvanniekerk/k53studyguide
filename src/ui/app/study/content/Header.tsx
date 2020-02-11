import * as React from "react";
import { View } from "react-native";
import { connect } from "react-redux";

import { RootState } from "@/state";
import { currentNavigationKeySelector } from "@/state/study/navigation";
import { translationsSelector } from "@/state/translations/selectors";
import { Text } from "@/ui/components";

import { Breadcrumb } from "./Breadcrumb";
import { SeenProgress } from "./SeenProgress";

type Props = PropsFromState;

const HeaderComponent: React.FC<Props> = props => {
    return (
        <View
            style={{
                width: "100%",
                alignItems: "flex-start",
                justifyContent: "center",
            }}
        >
            <Text style={{ fontSize: 24, fontWeight: "bold", marginTop: 40 }}>
                {props.translations[props.currentNavigationKey]}
            </Text>
            <SeenProgress />
            <Breadcrumb />
        </View>
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    return {
        currentNavigationKey: currentNavigationKeySelector(state),
        translations: translationsSelector(state),
    };
};

const Header = connect(mapStateToProps)(HeaderComponent);

export { Header };
