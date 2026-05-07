import { CreateAnimation, IonIcon } from "@ionic/react";
import { eye, eyeOff } from "ionicons/icons";
import type React from "react";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import type { RootState } from "@/state";
import { seenTotalsSelector } from "@/state/study/log";

type Props = {
  navigationKey: string;
} & PropsFromState;

const ContentSeenIndicatorComponent: React.FC<Props> = ({ navigationKey, seenTotals }) => {
  const total = seenTotals[navigationKey];
  const currentSeen = total ? total.seen === total.total : false;

  const [lastSeen, setLastSeen] = useState<boolean>(currentSeen);
  const [play, setPlay] = useState<boolean>(false);

  useEffect(() => {
    setLastSeen(currentSeen);
    // Only animate if going to unseen -> seen
    if (!lastSeen && currentSeen) {
      setPlay(true);
    }
  }, [currentSeen, lastSeen]);

  return (
    <CreateAnimation
      play={play}
      duration={700}
      easing="ease"
      keyframes={[
        { offset: 0, transform: "scale(1)" },
        { offset: 0.7, transform: "scale(1.6)" },
        { offset: 1, transform: "scale(1)" },
      ]}
    >
      <SeenIcon $seen={currentSeen}>
        <IonIcon icon={currentSeen ? eye : eyeOff} />
      </SeenIcon>
    </CreateAnimation>
  );
};

const SeenIcon = styled.div<{ $seen: boolean }>`
  align-items: center;
  color: ${(props) => (props.$seen ? "var(--section-accent, var(--app-progress-foreground))" : "var(--app-text-muted)")};
  display: flex;
  font-size: var(--app-font-size-xxl);
  justify-content: center;
  opacity: ${(props) => (props.$seen ? 0.9 : 0.55)};
  width: 34px;
`;

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
  return {
    seenTotals: seenTotalsSelector(state),
  };
};

const ContentSeenIndicator = connect(mapStateToProps)(ContentSeenIndicatorComponent);

export { ContentSeenIndicator };
