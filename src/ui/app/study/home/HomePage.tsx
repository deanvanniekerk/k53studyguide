import * as React from "react";
import { View } from "react-native";
import { connect } from "react-redux";

import { STUDY_BACKGROUND_COLORS } from "@/data/branding";
import { RootState } from "@/state";
import { rootNavigationItemsSelector } from "@/state/study/navigation";
import { Page } from "@/ui/components/Page";

import { NavigationItem } from "../components/NavigationItem";
import { Header } from "./Header";

type Props = PropsFromState;

const HomePageComponent: React.FC<Props> = props => {
    const onNavigationItemPress = (navigationItemKey: string) => {};

    return (
        <Page backgroundColors={STUDY_BACKGROUND_COLORS}>
            <Header />
            <View>
                {props.navigationItems.map(n => (
                    <NavigationItem
                        key={n}
                        navigationItemKey={n}
                        onNavigationItemPress={onNavigationItemPress}
                    />
                ))}
            </View>
        </Page>
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    return {
        navigationItems: rootNavigationItemsSelector(state),
    };
};

const HomePage = connect(mapStateToProps)(HomePageComponent);

export { HomePage };
