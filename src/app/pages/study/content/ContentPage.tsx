import "./ContentPage.css";

import React from "react";

import { IonContent } from "@ionic/react";

import { ContentList } from "./ContentList";
import { Header } from "./Header";
import { Navigator } from "./Navigator";

type Props = {
    onClose: () => void;
};

const ContentPage: React.FC<Props> = props => {
    return (
        <IonContent class="content-page">
            <Header onClose={props.onClose} />
            <Navigator />
            <ContentList />
        </IonContent>
    );
};

export default ContentPage;
