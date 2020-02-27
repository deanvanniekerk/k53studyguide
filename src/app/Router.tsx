import { flask, personCircle, school } from "ionicons/icons";
import React from "react";
import { connect } from "react-redux";
import { Redirect, Route } from "react-router-dom";
import { Provider as TranslationProvider } from "react-translated";

import { translations } from "@/data";
import { RootState } from "@/state";
import { languageSelector } from "@/state/settings";
import { IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";

import ArenaPage from "./pages/arena/ArenaPage";
import ContentPage from "./pages/content/ContentPage";
import DojoPage from "./pages/dojo/DojoPage";
import ProfilePage from "./pages/profile/ProfilePage";
import StudyPage from "./pages/study/StudyPage";
import TestNavigatorPage from "./pages/test/navigator/TestNavigatorPage";
import TestResultPage from "./pages/test/results/TestResultPage";
import TestPage from "./pages/test/test/TestPage";

type Props = PropsFromState;

const Router: React.FC<Props> = props => {
    return (
        <TranslationProvider language={props.language} translation={translations}>
            <IonReactRouter>
                <IonTabs>
                    <IonRouterOutlet>
                        <Route exact path="/study" component={StudyPage} />
                        <Route exact path="/content" component={ContentPage} />
                        <Route exact path="/dojo" component={DojoPage} />
                        <Route exact path="/test" component={TestPage} />
                        <Route exact path="/test-result" component={TestResultPage} />
                        <Route exact path="/test-navigator" component={TestNavigatorPage} />
                        <Route exact path="/arena" component={ArenaPage} />
                        <Route exact path="/profile" component={ProfilePage} />
                        <Route exact path="/" render={() => <Redirect to="/study" />} />
                    </IonRouterOutlet>

                    <IonTabBar slot="bottom">
                        <IonTabButton tab="study" href="/study">
                            <IonIcon icon={school} />
                            <IonLabel>Study</IonLabel>
                        </IonTabButton>
                        <IonTabButton tab="dojo" href="/dojo">
                            <IonIcon icon={flask} />
                            <IonLabel>Dojo</IonLabel>
                        </IonTabButton>
                        <IonTabButton tab="arena" href="/arena">
                            <IonIcon icon={flask} />
                            <IonLabel>Arena</IonLabel>
                        </IonTabButton>
                        <IonTabButton tab="profile" href="/profile">
                            <IonIcon icon={personCircle} />
                            <IonLabel>Profile</IonLabel>
                        </IonTabButton>
                    </IonTabBar>
                </IonTabs>
            </IonReactRouter>
        </TranslationProvider>
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    return {
        language: languageSelector(state),
    };
};

export default connect(mapStateToProps)(Router);
