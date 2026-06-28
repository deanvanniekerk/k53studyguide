import { IonIcon } from "@ionic/react";
import { chevronForwardOutline } from "ionicons/icons";
import type React from "react";
import { Translate } from "react-translated";
import styled, { keyframes } from "styled-components";
import { CarIcon, RoadIcon, SpeedometerIcon, StarIcon, StopIcon, TestIcon, TrafficLightIcon } from "../icons";

type Props = {
  navigationItemKey: string;
  correct: number;
  total: number;
  index: number;
  onClick: (navigationItemKey: string) => void;
};

const QuizNavigatorItem: React.FC<Props> = (props) => {
  const sectionTheme = navigationThemes[props.navigationItemKey] ?? navigationThemes["nav.vehicleControls"];
  const icon = navigationIcons[props.navigationItemKey];
  const hasIcon = Boolean(icon);
  const itemStyle = {
    "--section-accent": sectionTheme.color,
    "--section-accent-rgb": sectionTheme.rgb,
    "--item-delay": `${props.index * 55}ms`,
  } as React.CSSProperties;

  return (
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
        <MetaValue>{props.correct}</MetaValue>
        <MetaDivider>/</MetaDivider>
        <MetaValue>{props.total}</MetaValue>
      </Meta>
      <Chevron icon={chevronForwardOutline} />
    </Card>
  );
};

const slideUp = keyframes`
  from { transform: translateY(42px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

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
  animation: ${slideUp} 300ms ease var(--item-delay, 0ms) both;
  -webkit-tap-highlight-color: transparent;

  @media (max-width: 420px) {
    grid-template-columns: ${(props) => (props.$hasIcon ? "58px minmax(0, 1fr) auto 20px" : "minmax(0, 1fr) auto 20px")};
    gap: 12px;
    min-height: 96px;
    padding: 14px 12px;
  }

  /* Container-query variant so the layout adapts to the width of the phone
     preview in the lander (a narrow element inside a wide desktop viewport,
     where the @media query above never triggers). Harmless in the app, which
     does not establish a query container. */
  @container (max-width: 420px) {
    grid-template-columns: ${(props) => (props.$hasIcon ? "58px minmax(0, 1fr) auto 20px" : "minmax(0, 1fr) auto 20px")};
    gap: 12px;
    min-height: 96px;
    padding: 14px 12px;
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
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

  @container (max-width: 420px) {
    border-radius: 20px;
    height: 58px;
    width: 58px;
  }
`;

const Label = styled.div`
  align-self: center;
  min-width: 0;
`;

const Title = styled.span`
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

  @container (max-width: 420px) {
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

export { QuizNavigatorItem };
