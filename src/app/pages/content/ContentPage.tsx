import "./ContentPage.css";

import React from "react";

import { IonContent } from "@ionic/react";

import { ContentList, Header, Navigator } from "./components";

type Props = {
    onBackClicked: () => void;
};

const ContentPage: React.FC<Props> = props => {
    return (
        <IonContent class="content-page">
            <Header onBackClicked={props.onBackClicked} />
            <Navigator />
            <ContentList />
        </IonContent>
    );
};

export default ContentPage;
