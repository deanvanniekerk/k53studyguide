import { IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import type React from "react";
import { useEffect } from "react";
import { connect } from "react-redux";
import { Redirect, Route, useLocation } from "react-router-dom";
import { Provider as TranslationProvider } from "react-translated";
import { BookIcon, QuizIcon, SettingsIcon, TestPenIcon } from "@/app/components/icons";
import { translations } from "@/data";
import { analytics } from "@/services/analytics";
import type { RootState } from "@/state";
import { ownedSelector } from "@/state/purchase";
import { languageSelector } from "@/state/settings";
import { themeSelector } from "@/state/settings/selectors";
import { legacyRouteRedirects } from "./legacyCompatibility";
import ContentPage from "./pages/content/ContentPage";
import ProfilePage from "./pages/profile/ProfilePage";
import QuizNavigatorPage from "./pages/quiz/navigator/TestNavigatorPage";
import QuizPage from "./pages/quiz/QuizPage";
import QuizResultPage from "./pages/quiz/results/TestResultPage";
import QuizSessionPage from "./pages/quiz/session/TestPage";
import StudyPage from "./pages/study/StudyPage";
import TestResultPage from "./pages/test/results/TestResultPage";
import TestSessionPage from "./pages/test/session/TestPage";
import TestPage from "./pages/test/TestPage";

type Props = PropsFromState;

const iconStyles: React.CSSProperties = {
  fontSize: "2rem",
};

type TabAccentStyle = React.CSSProperties & {
  "--app-tab-accent": string;
  "--app-tab-accent-rgb": string;
  "--app-tab-selected-background": string;
};

const tabAccentStyles = {
  study: {
    "--app-tab-accent": "var(--app-progress-foreground)",
    "--app-tab-accent-rgb": "var(--app-progress-foreground-rgb)",
    "--app-tab-selected-background": "var(--app-study-primary-gradient)",
  },
  quiz: {
    "--app-tab-accent": "var(--ion-color-tertiary)",
    "--app-tab-accent-rgb": "var(--ion-color-tertiary-rgb)",
    "--app-tab-selected-background": "var(--app-quiz-primary-gradient)",
  },
  test: {
    "--app-tab-accent": "var(--app-test-accent)",
    "--app-tab-accent-rgb": "var(--app-test-accent-rgb)",
    "--app-tab-selected-background": "var(--app-test-primary-gradient)",
  },
  profile: {
    "--app-tab-accent": "var(--ion-color-success)",
    "--app-tab-accent-rgb": "var(--ion-color-success-rgb)",
    "--app-tab-selected-background": "var(--app-profile-primary-gradient)",
  },
} satisfies Record<string, TabAccentStyle>;

const tabPathGroups = {
  study: ["/study", "/content"],
  quiz: ["/quiz", "/quiz/session", "/quiz/results", "/quiz/navigator"],
  test: ["/test", "/test/session", "/test/results"],
  profile: ["/profile"],
} satisfies Record<string, string[]>;

const screenNameByPath: Record<string, string> = {
  "/study": "StudyPage",
  "/content": "ContentPage",
  "/quiz": "QuizPage",
  "/quiz/session": "QuizPage:TestPage",
  "/quiz/results": "QuizPage:TestResultPage",
  "/quiz/navigator": "QuizPage:TestNavigatorPage",
  "/test": "TestPage",
  "/test/session": "TestPage:TestPage",
  "/test/results": "TestPage:TestResultPage",
  "/profile": "ProfilePage",
} satisfies Record<string, string>;

type AnalyticsRouteTrackerProps = {
  language: string;
  theme: string;
  hasFullAccess: boolean;
};

const AnalyticsRouteTracker: React.FC<AnalyticsRouteTrackerProps> = ({ language, theme, hasFullAccess }) => {
  const { pathname } = useLocation();

  useEffect(() => {
    analytics.setUserProperties({
      language,
      theme,
      premium_status: hasFullAccess ? "premium" : "free",
    });
  }, [language, theme, hasFullAccess]);

  useEffect(() => {
    analytics.setCurrentScreen(screenNameByPath[pathname] ?? pathname);
  }, [pathname]);

  return null;
};

const AppTabs: React.FC<AnalyticsRouteTrackerProps> = (props) => {
  const { pathname } = useLocation();
  const activeTab = Object.entries(tabPathGroups).find(([, paths]) => paths.includes(pathname))?.[0];
  const tabPillClassName = (tab: keyof typeof tabPathGroups) =>
    activeTab === tab ? "app-tab-pill app-tab-pill-active" : "app-tab-pill";

  return (
    <IonTabs>
      <AnalyticsRouteTracker {...props} />
      <IonRouterOutlet>
        <Route exact path="/study" component={StudyPage} />
        <Route exact path="/content" component={ContentPage} />
        <Route exact path="/quiz" component={QuizPage} />
        <Route exact path="/quiz/session" component={QuizSessionPage} />
        <Route exact path="/quiz/results" component={QuizResultPage} />
        <Route exact path="/quiz/navigator" component={QuizNavigatorPage} />
        <Route exact path="/test/session" component={TestSessionPage} />
        <Route exact path="/test/results" component={TestResultPage} />
        <Route exact path="/test" component={TestPage} />
        <Route exact path="/profile" component={ProfilePage} />
        {legacyRouteRedirects.map((route) => (
          <Route exact key={route.from} path={route.from} render={() => <Redirect to={route.to} />} />
        ))}
        <Route exact path="/" render={() => <Redirect to="/study" />} />
      </IonRouterOutlet>
      <IonTabBar selectedTab={activeTab} slot="bottom">
        <IonTabButton tab="study" href="/study" style={tabAccentStyles.study}>
          <span className={tabPillClassName("study")}>
            <BookIcon style={iconStyles} />
            <IonLabel>Study</IonLabel>
          </span>
        </IonTabButton>
        <IonTabButton tab="quiz" href="/quiz" style={tabAccentStyles.quiz}>
          <span className={tabPillClassName("quiz")}>
            <QuizIcon style={iconStyles} />
            <IonLabel>Quiz</IonLabel>
          </span>
        </IonTabButton>
        <IonTabButton tab="test" href="/test" style={tabAccentStyles.test}>
          <span className={tabPillClassName("test")}>
            <TestPenIcon style={iconStyles} />
            <IonLabel>Test</IonLabel>
          </span>
        </IonTabButton>
        <IonTabButton tab="profile" href="/profile" style={tabAccentStyles.profile}>
          <span className={tabPillClassName("profile")}>
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
        <AppTabs language={props.language} theme={props.theme} hasFullAccess={props.hasFullAccess} />
      </IonReactRouter>
    </TranslationProvider>
  );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
  return {
    language: languageSelector(state),
    theme: themeSelector(state),
    hasFullAccess: ownedSelector(state),
  };
};

export default connect(mapStateToProps)(Router);
