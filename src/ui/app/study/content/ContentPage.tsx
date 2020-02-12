import React from "react";
import { View } from "react-native";

import { PAGE_MARGIN, STUDY_NAVIGATOR_BACKGROUND_COLORS } from "@/data/theme";
import { HorizontalRule, Page } from "@/ui/components";

import { ContentList } from "./ContentList";
import { Header } from "./Header";
import { Navigator } from "./Navigator";

const ContentPage: React.FC = () => {
    return (
        <Page backgroundColors={STUDY_NAVIGATOR_BACKGROUND_COLORS}>
            <View style={{ flex: 1, paddingLeft: PAGE_MARGIN, paddingRight: PAGE_MARGIN }}>
                <View>
                    <Header />
                    <HorizontalRule paddingBottom={10} paddingTop={10} />
                </View>
                <View style={{ flex: 1 }}>
                    <Navigator />
                    <ContentList />
                </View>
            </View>
        </Page>
    );
};

export { ContentPage };
