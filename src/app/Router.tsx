import React from "react";
import { connect } from "react-redux";
import { Redirect, Route } from "react-router-dom";
import { Provider as TranslationProvider } from "react-translated";

import { KatanaIcon, NinjaIcon, PagodaIcon, TargetIcon } from "@/app/components/icons";
import { translations } from "@/data";
import { RootState } from "@/state";
import { languageSelector } from "@/state/settings";
import { IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";

import ArenaPage from "./pages/arena/ArenaPage";
import ArenaTestResultPage from "./pages/arena/results/TestResultPage";
import ArenaTestPage from "./pages/arena/test/TestPage";
import ContentPage from "./pages/content/ContentPage";
import DojoPage from "./pages/dojo/DojoPage";
import TestNavigatorPage from "./pages/dojo/navigator/TestNavigatorPage";
import DojoTestResultPage from "./pages/dojo/results/TestResultPage";
import DojoTestPage from "./pages/dojo/test/TestPage";
import ProfilePage from "./pages/profile/ProfilePage";
import StudyPage from "./pages/study/StudyPage";

type Props = PropsFromState;

const iconStyles: React.CSSProperties = {
    fontSize: "1.8rem",
};

const Router: React.FC<Props> = props => {
    return (
        <TranslationProvider language={props.language} translation={translations}>
            <IonReactRouter>
                <IonTabs>
                    <IonRouterOutlet>
                        <Route exact path="/study" component={StudyPage} />
                        <Route exact path="/content" component={ContentPage} />
                        <Route exact path="/dojo" component={DojoPage} />
                        <Route exact path="/dojo-test" component={DojoTestPage} />
                        <Route exact path="/dojo-test-result" component={DojoTestResultPage} />
                        <Route exact path="/dojo-navigator" component={TestNavigatorPage} />
                        <Route exact path="/arena-test" component={ArenaTestPage} />
                        <Route exact path="/arena-test-result" component={ArenaTestResultPage} />
                        <Route exact path="/arena" component={ArenaPage} />
                        <Route exact path="/profile" component={ProfilePage} />
                        <Route exact path="/" render={() => <Redirect to="/study" />} />
                    </IonRouterOutlet>
                    <IonTabBar slot="bottom">
                        <IonTabButton tab="study" href="/study">
                            <PagodaIcon style={iconStyles} />
                            <IonLabel>Study</IonLabel>
                        </IonTabButton>
                        <IonTabButton tab="dojo" href="/dojo">
                            <TargetIcon style={iconStyles} />
                            <IonLabel>Dojo</IonLabel>
                        </IonTabButton>
                        <IonTabButton tab="arena" href="/arena">
                            <KatanaIcon style={iconStyles} />
                            <IonLabel>Arena</IonLabel>
                        </IonTabButton>
                        <IonTabButton tab="profile" href="/profile">
                            <NinjaIcon style={iconStyles} />
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
