import "./ArenaPage.css";

import React from "react";

import { IonContent, IonPage } from "@ionic/react";

import { ArenaPageHeader } from "./ArenaPageHeader";

const ArenaPage: React.FC = () => {
    return (
        <IonPage className="arena-page">
            <ArenaPageHeader />
            <IonContent></IonContent>
        </IonPage>
    );
};

export default ArenaPage;
