import { IonIcon, IonText } from "@ionic/react";
import { eye } from "ionicons/icons";
import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { ProgressBar } from "@/app/components";
import type { RootState } from "@/state";
import { seenTotalsSelector } from "@/state/study/log";

type Props = {
  navigationKey: string;
} & PropsFromState;

const SeenProgressComponent: React.FC<Props> = (props) => {
  const total = props.seenTotals[props.navigationKey];

  if (!total) return <React.Fragment />;

  const seenProgress = Math.floor((total.seen / total.total) * 100);
  const isComplete = total.seen === total.total;

  return (
    <ProgressWrap>
      <ProgressBar
        height={8}
        progress={seenProgress}
        foregroundOpacity={1}
        backgroundOpacity={0.12}
        foregroundRgb="var(--section-accent-rgb)"
      />
      <SeenCount $complete={isComplete}>
        <IonIcon icon={eye} />
        <IonText>
          {total.seen}
          {" / "}
          {total.total}
        </IonText>
      </SeenCount>
    </ProgressWrap>
  );
};

const ProgressWrap = styled.div`
  align-items: center;
  display: grid;
  gap: 16px;
  grid-template-columns: minmax(72px, 1fr) auto;

  .container {
    align-items: stretch;
    width: 100%;
  }
`;

const SeenCount = styled.div<{ $complete: boolean }>`
  align-items: center;
  color: var(--app-text-primary);
  display: flex;
  font-family: var(--ion-font-family-bold);
  font-size: var(--app-font-size-l);
  font-weight: 900;
  gap: 10px;
  white-space: nowrap;

  ion-icon {
    color: ${(props) => (props.$complete ? "var(--section-accent, var(--app-progress-foreground))" : "var(--app-text-muted)")};
    font-size: var(--app-font-size-xl);
  }

  @media (max-width: 360px) {
    font-size: var(--app-font-size-l);
    gap: 8px;
  }
`;

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
  return {
    seenTotals: seenTotalsSelector(state),
  };
};

const SeenProgress = connect(mapStateToProps)(SeenProgressComponent);

export { SeenProgress };
