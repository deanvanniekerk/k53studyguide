import * as React from "react";
import { ScrollView } from "react-native";

import { STUDY_NAVIGATOR_BACKGROUND_COLORS } from "@/data/branding";
import { Page } from "@/ui/components";

import { Content } from "./Content";
import { Header } from "./Header";
import { Navigator } from "./Navigator";

const ContentPage: React.FC = () => {
    return (
        <Page backgroundColors={STUDY_NAVIGATOR_BACKGROUND_COLORS}>
            <ScrollView style={{ paddingLeft: 15, paddingRight: 15 }}>
                <Header />
                <Navigator />
                <Content />
            </ScrollView>
        </Page>
    );
};

export { ContentPage };
