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
import { Provider as TranslationProvider } from "react-translated";
import { translations } from "src/data";
import { configureStore } from "src/state/configureStore";

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
import ContentPage from "./app/pages/content/ContentPage";

const store = configureStore();

const App: React.FC = () => (
    <IonApp>
        <Provider store={store}>
            <TranslationProvider language="en" translation={translations}>
                <IonReactRouter>
                    <IonTabs>
                        <IonRouterOutlet>
                            <Route exact path="/:tab(study)" component={StudyPage} />
                            <Route exact path="/:tab(study)/content/:navigationKey" component={ContentPage} />
                            <Route exact path="/:tab(train)" component={TrainPage} />
                            <Route exact path="/:tab(profile)" component={ProfilePage} />
                            <Route exact path="/" render={() => <Redirect to="/:tab(study)" />} />
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
