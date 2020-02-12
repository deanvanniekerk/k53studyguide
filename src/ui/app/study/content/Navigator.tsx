import React from "react";
import { View } from "react-native";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";

import { RootState } from "@/state";
import {
    currentNavigationItemsSelector,
    recieveCurrentNavigationKey,
} from "@/state/study/navigation";

import { NavigationItem } from "../components/NavigationItem";

type Props = PropsFromState & PropsFromDispatch;

const NavigatorComponent: React.FC<Props> = props => {
    const onNavigationItemPress = (key: string) => {
        props.recieveCurrentNavigationKey(key);
    };

    if (props.navigationItems.length === 0) return <React.Fragment />;

    return (
        <View style={{ marginTop: 5 }}>
            {props.navigationItems.map(n => (
                <NavigationItem key={n} navigationItemKey={n} onPress={onNavigationItemPress} />
            ))}
        </View>
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    return {
        navigationItems: currentNavigationItemsSelector(state),
    };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        ...bindActionCreators({ recieveCurrentNavigationKey }, dispatch),
    };
};

const Navigator = connect(mapStateToProps, mapDispatchToProps)(NavigatorComponent);

export { Navigator };
