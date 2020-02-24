import React from "react";
import styled from "styled-components";

import { IonContent, IonPage } from "@ionic/react";

import { ProfilePageHeader } from "./ProfilePageHeader";

const ProfilePage: React.FC = () => {
    return (
        <IonPage className="profile-page">
            <ProfilePageHeader />
            <Content></Content>
        </IonPage>
    );
};

const Content = styled(IonContent)`
    --background: var(--profile-background);
`;

export default ProfilePage;
