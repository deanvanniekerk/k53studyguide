import * as React from "react";
import { View } from "react-native";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";

import { STUDY_BACKGROUND_COLORS } from "@/data/branding";
import { RootState } from "@/state";
import {
    currentNavigationItemsSelector,
    recieveCurrentNavigationKey,
} from "@/state/study/navigation";
import { Page, Text } from "@/ui/components";

import { NavigationItem } from "../components/NavigationItem";
import { Header } from "./Header";

type Props = PropsFromState & PropsFromDispatch;

const HomePageComponent: React.FC<Props> = props => {
    const onNavigationItemPress = (key: string) => {
        props.recieveCurrentNavigationKey(key);
    };

    return (
        <Page backgroundColors={STUDY_BACKGROUND_COLORS}>
            <Header />
            <View>
                {props.navigationItems &&
                    props.navigationItems.map(n => (
                        <NavigationItem
                            key={n}
                            navigationItemKey={n}
                            onPress={onNavigationItemPress}
                        />
                    ))}
                {!props.navigationItems && <Text>At leaf</Text>}
            </View>
        </Page>
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

const HomePage = connect(mapStateToProps, mapDispatchToProps)(HomePageComponent);

export { HomePage };
