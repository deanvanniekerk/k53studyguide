import { CreateAnimation, IonIcon, IonText, useIonViewWillEnter } from "@ionic/react";
import { chevronForwardOutline, eye } from "ionicons/icons";
import type React from "react";
import { useRef } from "react";
import { connect } from "react-redux";
import { Translate } from "react-translated";
import styled from "styled-components";
import { ProgressBar } from "@/app/components";
import type { RootState } from "@/state";
import { seenTotalsSelector } from "@/state/study/log";

type Props = {
  navigationItemKey: string;
  onClick: (navigationItemKey: string) => void;
  index: number;
} & PropsFromState;

const NavigationItemComponent: React.FC<Props> = (props) => {
  const animation = useRef<CreateAnimation>(null);
  const delay = props.index * 55;
  const seenTotal = props.seenTotals[props.navigationItemKey];
  const seenProgress = seenTotal ? Math.floor((seenTotal.seen / seenTotal.total) * 100) : 0;

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
      <NavigatorCard type="button" onClick={() => props.onClick(props.navigationItemKey)}>
        <LabelBlock>
          <Title>
            <Translate text={props.navigationItemKey} />
          </Title>
          <ProgressBar
            progress={seenProgress}
            height={8}
            backgroundOpacity={0.12}
            foregroundOpacity={1}
            foregroundRgb="var(--section-accent-rgb)"
          />
        </LabelBlock>
        <Meta>
          <IonIcon icon={eye} />
          {seenTotal && (
            <IonText>
              {seenTotal.seen}
              {" / "}
              {seenTotal.total}
            </IonText>
          )}
        </Meta>
        <IonIcon icon={chevronForwardOutline} className="navigator-chevron" />
      </NavigatorCard>
    </CreateAnimation>
  );
};

const NavigatorCard = styled.button`
  align-items: center;
  background: var(--app-card-background);
  border: 2px solid var(--app-card-border-color);
  border-radius: 28px;
  box-shadow: 0 5px 0 var(--app-card-border-color);
  box-sizing: border-box;
  color: inherit;
  cursor: pointer;
  display: grid;
  gap: 14px;
  grid-template-columns: minmax(0, 1fr) auto 20px;
  min-height: 104px;
  padding: 20px 18px 18px 22px;
  text-align: left;
  width: 100%;
  -webkit-tap-highlight-color: transparent;

  .container {
    align-items: stretch;
    margin-top: 14px;
    max-width: 260px;
    width: 100%;
  }

  .navigator-chevron {
    color: var(--app-text-muted);
    font-size: var(--app-font-size-xxl);
    opacity: 0.7;
  }

  @media (max-width: 360px) {
    gap: 10px;
    grid-template-columns: minmax(0, 1fr) auto 18px;
    padding-left: 18px;
  }
`;

const LabelBlock = styled.div`
  min-width: 0;
`;

const Title = styled(IonText)`
  color: var(--app-text-primary);
  display: block;
  font-family: var(--ion-font-family-bold);
  font-size: var(--app-font-size-l);
  font-weight: 900;
  letter-spacing: 0;
  line-height: 1.15;
`;

const Meta = styled.div`
  align-items: center;
  color: var(--app-text-muted);
  display: flex;
  font-family: var(--ion-font-family-bold);
  font-size: var(--app-font-size-md);
  font-weight: 900;
  gap: 8px;
  white-space: nowrap;

  ion-icon {
    font-size: var(--app-font-size-xl);
    opacity: 0.68;
  }
`;

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
  return {
    seenTotals: seenTotalsSelector(state),
  };
};

const NavigationItem = connect(mapStateToProps)(NavigationItemComponent);

export { NavigationItem };
