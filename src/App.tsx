/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";
/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";
/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";
/* Theme variables */
import "./theme/variables.css";
/* Global CSS */
import "./global.css";

import { flask, personCircle, school } from "ionicons/icons";
import React from "react";
import { Provider } from "react-redux";
import { Redirect, Route } from "react-router-dom";
import { configureStore } from "src/state/configureStore";
import { Provider as TranslationProvider } from 'react-translated';
import { translations } from "src/data";

import {
    IonApp,
    IonIcon,
    IonLabel,
    IonRouterOutlet,
    IonTabBar,
    IonTabButton,
    IonTabs,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";

import ProfilePage from "./app/pages/profile/ProfilePage";
import StudyPage from "./app/pages/study/StudyPage";
import TrainPage from "./app/pages/train/TrainPage";

const store = configureStore();

const App: React.FC = () => (
    <IonApp>
        <Provider store={store}>
            <TranslationProvider language="en" translation={translations}>
            <IonReactRouter>
                <IonTabs>
                    <IonRouterOutlet>
                        <Route path="/study" component={StudyPage} exact={true} />
                        <Route path="/train" component={TrainPage} exact={true} />
                        <Route path="/profile" component={ProfilePage} />
                        <Route path="/" render={() => <Redirect to="/study" />} exact={true} />
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
            </IonReactRouter>
            </TranslationProvider>
        </Provider>
    </IonApp>
);

export default App;
