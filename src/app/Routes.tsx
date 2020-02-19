import { flask, personCircle, school } from "ionicons/icons";
import React from "react";
import { Redirect, Route } from "react-router-dom";

import { IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from "@ionic/react";

import ContentPage from "./pages/content/ContentPage";
import ProfilePage from "./pages/profile/ProfilePage";
import StudyPage from "./pages/study/StudyPage";
import TrainPage from "./pages/train/TrainPage";

const Routes: React.FC = () => {
    return (
        <IonTabs>
            <IonRouterOutlet>
                {/* <Route exact path="/:tab(study)" component={StudyPage} />
                <Route exact path="/:tab(study)/content" component={ContentPage} />
                <Route exact path="/:tab(train)" component={TrainPage} />
                <Route exact path="/:tab(profile)" component={ProfilePage} /> */}
                <Route exact path="/study" component={StudyPage} />
                <Route exact path="/content" component={ContentPage} />
                <Route exact path="/train" component={TrainPage} />
                <Route exact path="/profile" component={ProfilePage} />
                <Route exact path="/" render={() => <Redirect to="/study" />} />
            </IonRouterOutlet>
            <IonTabBar slot="bottom">
                <IonTabButton tab="study" href="/study">
                    <IonIcon icon={school} />
                    <IonLabel>Study</IonLabel>
                </IonTabButton>
                <IonTabButton tab="train" href="/train">
                    <IonIcon icon={flask} />
                    <IonLabel>Train</IonLabel>
                </IonTabButton>
                <IonTabButton tab="profile" href="/profile">
                    <IonIcon icon={personCircle} />
                    <IonLabel>Profile</IonLabel>
                </IonTabButton>
            </IonTabBar>
        </IonTabs>
    );
};

export default Routes;
