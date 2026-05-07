import { IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import type React from "react";
import { connect } from "react-redux";
import { Redirect, Route, useLocation } from "react-router-dom";
import { Provider as TranslationProvider } from "react-translated";
import { BookIcon, QuizIcon, SettingsIcon, TestPenIcon } from "@/app/components/icons";
import { translations } from "@/data";
import type { RootState } from "@/state";
import { languageSelector } from "@/state/settings";
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
  fontSize: "2rem",
};

type TabAccentStyle = React.CSSProperties & {
  "--app-tab-accent": string;
  "--app-tab-accent-rgb": string;
};

const tabAccentStyles = {
  study: {
    "--app-tab-accent": "var(--app-progress-foreground)",
    "--app-tab-accent-rgb": "var(--app-progress-foreground-rgb)",
  },
  dojo: {
    "--app-tab-accent": "var(--ion-color-tertiary)",
    "--app-tab-accent-rgb": "var(--ion-color-tertiary-rgb)",
  },
  arena: {
    "--app-tab-accent": "var(--app-arena-accent)",
    "--app-tab-accent-rgb": "var(--app-arena-accent-rgb)",
  },
  profile: {
    "--app-tab-accent": "var(--ion-color-success)",
    "--app-tab-accent-rgb": "var(--ion-color-success-rgb)",
  },
} satisfies Record<string, TabAccentStyle>;

const tabPathGroups = {
  study: ["/study", "/content"],
  dojo: ["/dojo", "/test-dojo", "/test-result-dojo", "/navigator-dojo"],
  arena: ["/arena", "/test-arena", "/test-result-arena"],
  profile: ["/profile"],
} satisfies Record<string, string[]>;

const AppTabs: React.FC = () => {
  const { pathname } = useLocation();
  const isActiveTab = (tab: keyof typeof tabPathGroups) => tabPathGroups[tab].includes(pathname);

  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route exact path="/study" component={StudyPage} />
        <Route exact path="/content" component={ContentPage} />
        <Route exact path="/dojo" component={DojoPage} />
        <Route exact path="/test-dojo" component={DojoTestPage} />
        <Route exact path="/test-result-dojo" component={DojoTestResultPage} />
        <Route exact path="/navigator-dojo" component={TestNavigatorPage} />
        <Route exact path="/test-arena" component={ArenaTestPage} />
        <Route exact path="/test-result-arena" component={ArenaTestResultPage} />
        <Route exact path="/arena" component={ArenaPage} />
        <Route exact path="/profile" component={ProfilePage} />
        <Route exact path="/" render={() => <Redirect to="/study" />} />
      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        <IonTabButton
          className={isActiveTab("study") ? "tab-selected" : undefined}
          tab="study"
          href="/study"
          style={tabAccentStyles.study}
        >
          <span className="app-tab-pill">
            <BookIcon style={iconStyles} />
            <IonLabel>Study</IonLabel>
          </span>
        </IonTabButton>
        <IonTabButton
          className={isActiveTab("dojo") ? "tab-selected" : undefined}
          tab="dojo"
          href="/dojo"
          style={tabAccentStyles.dojo}
        >
          <span className="app-tab-pill">
            <QuizIcon style={iconStyles} />
            <IonLabel>Quiz</IonLabel>
          </span>
        </IonTabButton>
        <IonTabButton
          className={isActiveTab("arena") ? "tab-selected" : undefined}
          tab="arena"
          href="/arena"
          style={tabAccentStyles.arena}
        >
          <span className="app-tab-pill">
            <TestPenIcon style={iconStyles} />
            <IonLabel>Test</IonLabel>
          </span>
        </IonTabButton>
        <IonTabButton
          className={isActiveTab("profile") ? "tab-selected" : undefined}
          tab="profile"
          href="/profile"
          style={tabAccentStyles.profile}
        >
          <span className="app-tab-pill">
            <SettingsIcon style={iconStyles} />
            <IonLabel>Profile</IonLabel>
          </span>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

const Router: React.FC<Props> = (props) => {
  return (
    <TranslationProvider language={props.language} translation={translations}>
      <IonReactRouter>
        <AppTabs />
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
