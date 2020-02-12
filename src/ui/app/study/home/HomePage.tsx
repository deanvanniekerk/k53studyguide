import React from "react";
import { ScrollView, View } from "react-native";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";

import { PAGE_MARGIN, STUDY_HOME_BACKGROUND_COLORS } from "@/data/theme";
import { RootState } from "@/state";
import { recieveCurrentNavigationKey, rootNavigationItemsSelector } from "@/state/study/navigation";
import { Page } from "@/ui/components";
import { NavigationProp } from "@react-navigation/core";

import { NavigationItem } from "../components/NavigationItem";
import { Header } from "./Header";

type Props = PropsFromState &
    PropsFromDispatch & {
        navigation: NavigationProp<any>;
    };

const HomePageComponent: React.FC<Props> = props => {
    const onNavigationItemPress = (key: string) => {
        props.recieveCurrentNavigationKey(key);
        props.navigation.navigate("StudyContent");
    };

    return (
        <Page backgroundColors={STUDY_HOME_BACKGROUND_COLORS}>
            <ScrollView style={{ paddingLeft: PAGE_MARGIN, paddingRight: PAGE_MARGIN }}>
                <Header />
                <View>
                    {props.navigationItems.map(n => (
                        <NavigationItem
                            key={n}
                            navigationItemKey={n}
                            onPress={onNavigationItemPress}
                        />
                    ))}
                </View>
            </ScrollView>
        </Page>
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    return {
        navigationItems: rootNavigationItemsSelector(state),
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
