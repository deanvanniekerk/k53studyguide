import * as React from "react";
import { View } from "react-native";
import { connect } from "react-redux";

import { STUDY_BACKGROUND_COLORS } from "@/data/branding";
import { RootState } from "@/state";
import { currentNavigationItemsSelector } from "@/state/study/navigation";
import { translationsSelector } from "@/state/translations/selectors";
import { Text } from "@/ui/components";
import { Page } from "@/ui/components/Page";

type Props = PropsFromState;

const StudyPageComponent: React.FC<Props> = props => {
    return (
        <Page backgroundColors={STUDY_BACKGROUND_COLORS}>
            <View
                style={{ flex: 1, width: "100%", alignItems: "center", justifyContent: "center" }}
            >
                {props.navigationItems.map(n => {
                    return <Text key={n}>{props.translations[n]}</Text>;
                })}
            </View>
        </Page>
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    const navigationItems = currentNavigationItemsSelector(state);
    const translations = translationsSelector(state);

    return {
        navigationItems,
        translations,
    };
};

const StudyPage = connect(mapStateToProps)(StudyPageComponent);

export { StudyPage };
