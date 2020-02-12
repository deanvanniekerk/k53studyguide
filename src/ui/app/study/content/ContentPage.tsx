import React from "react";
import { ScrollView } from "react-native";

import { PAGE_MARGIN, STUDY_NAVIGATOR_BACKGROUND_COLORS } from "@/data/theme";
import { HorizontalRule, Page } from "@/ui/components";

import { ContentList } from "./ContentList";
import { Header } from "./Header";
import { Navigator } from "./Navigator";

const ContentPage: React.FC = () => {
    return (
        <Page backgroundColors={STUDY_NAVIGATOR_BACKGROUND_COLORS}>
            <ScrollView style={{ paddingLeft: PAGE_MARGIN, paddingRight: PAGE_MARGIN }}>
                <Header />
                <HorizontalRule paddingBottom={5} />
                <Navigator />
                <ContentList />
            </ScrollView>
        </Page>
    );
};

export { ContentPage };
