import { CreateAnimation, IonIcon, IonLabel, IonText, useIonViewWillEnter } from "@ionic/react";
import { chevronBackOutline, eye } from "ionicons/icons";
import type React from "react";
import { useRef } from "react";
import { connect } from "react-redux";
import { Translate } from "react-translated";
import styled from "styled-components";
import { ProgressBar } from "@/app/components";
import { CarIcon, RoadIcon, SpeedometerIcon, StopIcon, TestIcon, TrafficLightIcon } from "@/app/components/icons";
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
        <div className="root-navigation-icon-tile">
          <Icon>{navigationIcons[props.navigationItemKey]}</Icon>
        </div>
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
        <div className="root-navigation-progress">
          <IonIcon icon={eye} className="text-l" />
          <span>{seenProgress}%</span>
        </div>
        <IonIcon icon={chevronBackOutline} className="root-navigation-chevron" />
      </div>
    </CreateAnimation>
  );
};

const Icon = styled.div`
  font-size: 2.6rem;
  line-height: 1;
`;

const navigationIcons: { [key: string]: React.ReactNode } = {
  "nav.vehicleControls": <SpeedometerIcon />,
  "nav.rulesOfTheRoad": <TestIcon />,
  "nav.defensiveDriving": <CarIcon />,
  "nav.roadMarkings": <RoadIcon />,
  "nav.roadSignals": <TrafficLightIcon />,
  "nav.signs": <StopIcon />,
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
