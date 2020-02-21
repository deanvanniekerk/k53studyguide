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
    --background: linear-gradient(to right bottom, #501a8e, #4d2579, #482c65, #423251, #3a363d);
`;

export default ProfilePage;
