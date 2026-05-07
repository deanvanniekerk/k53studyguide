import { IonIcon } from "@ionic/react";
import { sparkles } from "ionicons/icons";
import type React from "react";
import { connect } from "react-redux";
import { Translate } from "react-translated";
import styled from "styled-components";
import { ProgressBar, StarRating } from "@/app/components";
import type { RootState } from "@/state";
import {
  dojoCurrentExperiencePercentSelector,
  dojoLevelSelector,
  requiredLevelUpExperiencePointsSelector,
} from "@/state/dojo/log";
import { LevelText } from "./";

type Props = PropsFromState;

const LevelComponent: React.FC<Props> = (props) => {
  return (
    <Wrapper>
      <Glow />
      <LevelHeader>
        <SparkIcon icon={sparkles} />
        <LevelText level={props.level} />
      </LevelHeader>

      <StarWrapper>
        <StarRating total={5} current={props.level} size="2.6rem" padding="5px" inActiveOpacity={0.75} />
      </StarWrapper>
      <LevelUpText>
        <Translate text="dojoLevelUpAfter" data={{ number: props.requiredLevelUpExperiencePoints }} />
      </LevelUpText>
      <ProgressBarWrapper>
        <ProgressBarColumn>
          <ProgressBar
            progress={props.dojoCurrentExperiencePercent}
            backgroundRgb="255, 255, 255"
            backgroundOpacity={0.3}
            foregroundRgb="255, 212, 59"
            foregroundOpacity={1}
            height={10}
          ></ProgressBar>
        </ProgressBarColumn>
      </ProgressBarWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: relative;
  overflow: hidden;
  margin: 0 var(--app-padding);
  border-radius: 28px;
  padding: 27px 28px 31px;
  color: var(--ion-color-light);
  background: var(--app-dojo-header-gradient);
  box-shadow: 0 18px 35px rgba(var(--app-progress-foreground-rgb), 0.2);
`;

const Glow = styled.div`
  position: absolute;
  right: -28px;
  top: -8px;
  width: 130px;
  height: 130px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.16);
`;

const LevelHeader = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: var(--ion-font-family-bold);
  font-size: var(--app-font-size-l);
  font-weight: 900;
  letter-spacing: 1.5px;
  text-transform: uppercase;
`;

const SparkIcon = styled(IonIcon)`
  color: #ffd43b;
  font-size: var(--app-font-size-md);
`;

const StarWrapper = styled.div`
  position: relative;
  padding-top: 16px;
  display: flex;
  justify-content: flex-start;
`;

const LevelUpText = styled.div`
  position: relative;
  font-size: var(--app-font-size-l);
  font-weight: 800;
  padding: 17px 0 12px 0;
`;

const ProgressBarWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const ProgressBarColumn = styled.div`
  flex: 1;
`;

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
  return {
    level: dojoLevelSelector(state),
    requiredLevelUpExperiencePoints: requiredLevelUpExperiencePointsSelector(state),
    dojoCurrentExperiencePercent: dojoCurrentExperiencePercentSelector(state),
  };
};

const Level = connect(mapStateToProps)(LevelComponent);

export { Level };
