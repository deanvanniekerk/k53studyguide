import "./ProfilePage.css";

import React from "react";

import { IonContent, IonPage } from "@ionic/react";

const ProfilePage: React.FC = () => {
    return (
        <IonPage className="profile-page">
            {/* <IonHeader>
        <IonToolbar>
          <IonTitle>Tab 3</IonTitle>
        </IonToolbar>
      </IonHeader> */}
            <IonContent>PROFILE!</IonContent>
        </IonPage>
    );
};

export default ProfilePage;
