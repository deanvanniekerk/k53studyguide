import React from "react";
import styled from "styled-components";

import { IonContent, IonPage } from "@ionic/react";

import { ArenaPageHeader } from "./ArenaPageHeader";

const ArenaPage: React.FC = () => {
    return (
        <IonPage className="arena-page">
            <ArenaPageHeader />
            <Content></Content>
        </IonPage>
    );
};

const Content = styled(IonContent)`
    --background: linear-gradient(to right bottom, #501a8e, #9a0684, #cc1e73, #ed4c60, #ff7b51);
`;

export default ArenaPage;
