import React from "react";
import styled from "styled-components";

import { IonContent, IonPage } from "@ionic/react";

import { History, Settings } from "./components";
import { ProfilePageHeader } from "./ProfilePageHeader";

const ProfilePage: React.FC = () => {
    return (
        <IonPage>
            <ProfilePageHeader />
            <Content>
                <Settings />
                <History />
            </Content>
        </IonPage>
    );
};

const Content = styled(IonContent)`
    --background: var(--profile-background);
    padding-top: 55;
    padding-left: 16;
`;

export default ProfilePage;
