import { CreateAnimation, IonIcon, IonLabel, IonText, useIonViewWillEnter } from "@ionic/react";
import { Translate } from "@k53studyguide/shared/translation";
import { chevronBackOutline, eye } from "ionicons/icons";
import type React from "react";
import { useRef } from "react";
import { connect } from "react-redux";
import { ProgressBar } from "@/app/components";
import { Illustration } from "@/app/components/Illustration";
import type { RootState } from "@/state";
import { seenTotalsSelector } from "@/state/study/log";
import "./NavigationItem.css";

type Props = {
  navigationItemKey: string;
  onClick: (navigationItemKey: string) => void;
  index: number;
} & PropsFromState;

const NavigationItemComponent: React.FC<Props> = (props) => {
  const animation1 = useRef<CreateAnimation>(null);

  const delay = props.index * 75;
  const seenTotal = props.seenTotals[props.navigationItemKey];
  const seenProgress = seenTotal ? Math.floor((seenTotal.seen / seenTotal.total) * 100) : 0;
  const isComplete = seenTotal ? seenTotal.seen === seenTotal.total : false;
  const containerAnimationDuration = 300;
  const sectionTheme = navigationThemes[props.navigationItemKey] ?? navigationThemes["nav.vehicleControls"];
  const itemStyle = {
    "--section-accent": sectionTheme.color,
    "--section-accent-rgb": sectionTheme.rgb,
  } as React.CSSProperties;

  useIonViewWillEnter(() => {
    if (animation1.current) animation1.current.animation.play();
  });

  return (
    <CreateAnimation
      play={false}
      ref={animation1}
      delay={delay}
      duration={containerAnimationDuration}
      easing="ease"
      fromTo={{
        property: "transform",
        fromValue: "translateY(85px)",
        toValue: "translateY(0px)",
      }}
    >
      <div className="root-navigation-item" style={itemStyle} onClick={() => props.onClick(props.navigationItemKey)}>
        <div className="root-navigation-icon-tile">{navigationIcons[props.navigationItemKey]}</div>
        <IonLabel className="root-navigation-label">
          <IonText>
            <Translate text={props.navigationItemKey} />
          </IonText>
          <div className="progress-bar">
            <ProgressBar
              progress={seenProgress}
              height={8}
              backgroundOpacity={0.12}
              foregroundOpacity={1}
              foregroundRgb="var(--section-accent-rgb)"
            />
          </div>
        </IonLabel>
        <div className={`root-navigation-progress ${isComplete ? "root-navigation-progress-complete" : ""}`}>
          <IonIcon icon={eye} className="text-l" />
          <span>{seenProgress}%</span>
        </div>
        <IonIcon icon={chevronBackOutline} className="root-navigation-chevron" />
      </div>
    </CreateAnimation>
  );
};

const navigationIcons: { [key: string]: React.ReactNode } = {
  "nav.vehicleControls": <Illustration name="vehicle-controls" size={52} />,
  "nav.rulesOfTheRoad": <Illustration name="road-rules" size={52} />,
  "nav.defensiveDriving": <Illustration name="defensive-driving" size={52} />,
  "nav.roadMarkings": <Illustration name="road-markings" size={52} />,
  "nav.roadSignals": <Illustration name="traffic-signals" size={52} />,
  "nav.signs": <Illustration name="road-signs" size={52} />,
};

const navigationThemes: { [key: string]: { color: string; rgb: string } } = {
  "nav.vehicleControls": {
    color: "var(--app-study-section-vehicle)",
    rgb: "var(--app-study-section-vehicle-rgb)",
  },
  "nav.rulesOfTheRoad": {
    color: "var(--app-study-section-rules)",
    rgb: "var(--app-study-section-rules-rgb)",
  },
  "nav.defensiveDriving": {
    color: "var(--app-study-section-defensive)",
    rgb: "var(--app-study-section-defensive-rgb)",
  },
  "nav.roadMarkings": {
    color: "var(--app-study-section-markings)",
    rgb: "var(--app-study-section-markings-rgb)",
  },
  "nav.roadSignals": {
    color: "var(--app-study-section-signals)",
    rgb: "var(--app-study-section-signals-rgb)",
  },
  "nav.signs": {
    color: "var(--app-study-section-signs)",
    rgb: "var(--app-study-section-signs-rgb)",
  },
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
  return {
    seenTotals: seenTotalsSelector(state),
  };
};

const NavigationItem = connect(mapStateToProps)(NavigationItemComponent);

export { NavigationItem };
