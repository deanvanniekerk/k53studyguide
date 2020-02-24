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
    --background: var(--arena-background);
`;

export default ArenaPage;
