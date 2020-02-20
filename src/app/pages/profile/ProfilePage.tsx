import "./ProfilePage.css";

import React from "react";

import { IonContent, IonPage } from "@ionic/react";

import { ProfilePageHeader } from "./ProfilePageHeader";

const ProfilePage: React.FC = () => {
    return (
        <IonPage className="profile-page">
            <ProfilePageHeader />
            <IonContent></IonContent>
        </IonPage>
    );
};

export default ProfilePage;
