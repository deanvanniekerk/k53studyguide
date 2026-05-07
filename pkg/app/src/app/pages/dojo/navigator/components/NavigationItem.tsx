import { CreateAnimation, IonIcon, IonLabel, IonText, useIonViewWillEnter } from "@ionic/react";
import { chevronForwardOutline } from "ionicons/icons";
import type React from "react";
import { useRef } from "react";
import { connect } from "react-redux";
import { Translate } from "react-translated";
import styled from "styled-components";
import {
  CarIcon,
  RoadIcon,
  SpeedometerIcon,
  StarIcon,
  StopIcon,
  TestIcon,
  TrafficLightIcon,
} from "@/app/components/icons";
import type { RootState } from "@/state";
import { correctlyAnsweredQuestionsTotalsSelector } from "@/state/dojo/navigation";

type Props = {
  navigationItemKey: string;
  onClick: (navigationItemKey: string) => void;
  index: number;
} & PropsFromState;

const NavigationItemComponent: React.FC<Props> = (props) => {
  const animation = useRef<CreateAnimation>(null);
  const delay = props.index * 55;
  const total = props.correctlyAnsweredQuestionsTotals[props.navigationItemKey];
  const correct = total ? total.correctlyAnswered : 0;
  const questionTotal = total ? total.total : 0;
  const sectionTheme = navigationThemes[props.navigationItemKey] ?? navigationThemes["nav.vehicleControls"];
  const icon = navigationIcons[props.navigationItemKey];
  const hasIcon = Boolean(icon);
  const itemStyle = {
    "--section-accent": sectionTheme.color,
    "--section-accent-rgb": sectionTheme.rgb,
  } as React.CSSProperties;

  useIonViewWillEnter(() => {
    if (animation.current) animation.current.animation.play();
  });

  return (
    <CreateAnimation
      play={false}
      ref={animation}
      delay={delay}
      duration={300}
      easing="ease"
      fromTo={{
        property: "transform",
        fromValue: "translateY(42px)",
        toValue: "translateY(0px)",
      }}
    >
      <Card type="button" style={itemStyle} $hasIcon={hasIcon} onClick={() => props.onClick(props.navigationItemKey)}>
        {hasIcon && (
          <IconTile>
            <Icon>{icon}</Icon>
          </IconTile>
        )}
        <Label>
          <Title>
            <Translate text={props.navigationItemKey} />
          </Title>
        </Label>
        <Meta>
          <MetaIcon />
          <MetaValue>{correct}</MetaValue>
          <MetaDivider>/</MetaDivider>
          <MetaValue>{questionTotal}</MetaValue>
        </Meta>
        <Chevron icon={chevronForwardOutline} />
      </Card>
    </CreateAnimation>
  );
};

const Card = styled.button<{ $hasIcon: boolean }>`
  align-items: center;
  background: var(--app-card-background);
  border: 2px solid var(--app-card-border-color);
  border-radius: 34px;
  box-shadow: 0 6px 0 var(--app-card-border-color);
  box-sizing: border-box;
  color: var(--app-text-primary);
  cursor: pointer;
  display: grid;
  gap: 16px;
  grid-template-columns: ${(props) => (props.$hasIcon ? "70px minmax(0, 1fr) auto 24px" : "minmax(0, 1fr) auto 24px")};
  margin: 0 0 24px;
  min-height: 112px;
  padding: 16px 18px;
  text-align: left;
  width: 100%;
  -webkit-tap-highlight-color: transparent;

  @media (max-width: 420px) {
    grid-template-columns: ${(props) => (props.$hasIcon ? "58px minmax(0, 1fr) auto 20px" : "minmax(0, 1fr) auto 20px")};
    gap: 12px;
    min-height: 96px;
    padding: 14px 12px;
  }
`;

const IconTile = styled.div`
  align-items: center;
  background: rgba(var(--section-accent-rgb), 0.14);
  border-radius: 24px;
  color: var(--section-accent);
  display: flex;
  height: 70px;
  justify-content: center;
  overflow: hidden;
  width: 70px;

  @media (max-width: 420px) {
    border-radius: 20px;
    height: 58px;
    width: 58px;
  }
`;

const Label = styled(IonLabel)`
  align-self: center;
  min-width: 0;
`;

const Title = styled(IonText)`
  color: var(--app-text-primary);
  display: block;
  font-family: var(--ion-font-family-bold);
  font-size: var(--app-font-size-l);
  font-weight: 800;
  line-height: 1.15;
`;

const Meta = styled.div`
  align-items: center;
  color: var(--app-text-muted);
  display: flex;
  font-family: var(--ion-font-family-bold);
  font-size: var(--app-font-size-l);
  font-weight: 900;
  gap: 5px;
  white-space: nowrap;

  @media (max-width: 420px) {
    font-size: var(--app-font-size-md);
  }
`;

const MetaIcon = styled(StarIcon)`
  flex: 0 0 auto;
  font-size: 1.18rem;
  margin-right: 3px;
`;

const MetaValue = styled.span`
  color: var(--app-text-muted);
`;

const MetaDivider = styled.span`
  opacity: 0.5;
`;

const Chevron = styled(IonIcon)`
  color: var(--app-text-muted);
  font-size: var(--app-font-size-xxl);
  opacity: 0.75;
`;

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
    correctlyAnsweredQuestionsTotals: correctlyAnsweredQuestionsTotalsSelector(state),
  };
};

const NavigationItem = connect(mapStateToProps)(NavigationItemComponent);

export { NavigationItem };
