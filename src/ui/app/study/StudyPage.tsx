import * as React from "react";
import { View } from "react-native";
import { connect } from "react-redux";

import { STUDY_BACKGROUND_COLORS } from "@/data/branding";
import { RootState } from "@/state";
import { currentNavigationItemsSelector } from "@/state/study/navigation";
import { Page } from "@/ui/components/Page";

import { NavigationItem } from "./components/NavigationItem";

type Props = PropsFromState;

const StudyPageComponent: React.FC<Props> = props => {
    return (
        <Page backgroundColors={STUDY_BACKGROUND_COLORS}>
            <View>
                {props.navigationItems.map(n => (
                    <NavigationItem key={n} navigationItemKey={n} />
                ))}
            </View>
        </Page>
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    const navigationItems = currentNavigationItemsSelector(state);

    return {
        navigationItems,
    };
};

const StudyPage = connect(mapStateToProps)(StudyPageComponent);

export { StudyPage };
