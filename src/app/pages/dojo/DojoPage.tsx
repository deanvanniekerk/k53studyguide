import "./DojoPage.css";

import React from "react";

import { IonContent, IonPage } from "@ionic/react";

import { DojoPageHeader } from "./DojoPageHeader";

const DojoPage: React.FC = () => {
    return (
        <IonPage className="dojo-page">
            <DojoPageHeader />
            <IonContent></IonContent>
        </IonPage>
    );
};

export default DojoPage;
