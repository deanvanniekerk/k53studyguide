import { IonIcon } from "@ionic/react";
import { sparkles } from "ionicons/icons";
import type React from "react";
import { Translate } from "react-translated";
import styled from "styled-components";
import { LevelText } from "./LevelText";
import { StarRating } from "./StarRating";

type Props = {
  level: number;
  requiredLevelUpExperiencePoints: number;
  currentExperiencePercent: number;
};

const QuizLevelCard: React.FC<Props> = (props) => {
  const isMaxLevel = props.level >= 5;

  return (
    <Wrapper>
      <LevelHeader>
        <LevelBadge>
          <SparkIcon icon={sparkles} />
          <LevelText level={props.level} />
        </LevelBadge>
        <LevelUpText>
          {isMaxLevel && <Translate text="maxLevel" />}
          {!isMaxLevel && (
            <Translate
              text="quizLevelUpAfterShort"
              data={{ number: props.requiredLevelUpExperiencePoints, level: props.level + 1 }}
            />
          )}
        </LevelUpText>
      </LevelHeader>

      <StarWrapper>
        <StarRating
          total={5}
          current={props.level}
          size="2.75rem"
          padding="6px"
          inActiveFill="var(--app-quiz-level-star-inactive)"
          inActiveOpacity={1}
        />
      </StarWrapper>
      <ProgressBarTrack>
        <ProgressBarFill progress={isMaxLevel ? 100 : props.currentExperiencePercent} />
      </ProgressBarTrack>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: relative;
  overflow: hidden;
  margin: 0 var(--app-padding);
  border: var(--app-quiz-level-card-border);
  border-radius: 32px;
  padding: 38px 40px 36px;
  color: var(--app-quiz-level-card-text);
  background: var(--app-quiz-level-card-background);
  box-shadow: var(--app-quiz-level-card-shadow);

  @media (max-width: 420px) {
    padding: 26px 18px 28px;
  }

  @container (max-width: 420px) {
    padding: 26px 18px 28px;
  }
`;

const LevelHeader = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;

  @media (max-width: 420px) {
    gap: 8px;
  }

  @container (max-width: 420px) {
    gap: 8px;
  }
`;

const LevelBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 11px;
  border-radius: 999px;
  padding: 7px 12px;
  color: var(--app-quiz-level-badge-text);
  background: var(--app-quiz-header-gradient);
  font-family: var(--ion-font-family-bold);
  font-size: var(--app-font-size-md);
  font-weight: 700;
  line-height: 1;
  letter-spacing: 1px;
  text-transform: uppercase;
  white-space: nowrap;

  @media (max-width: 420px) {
    gap: 7px;
    padding: 7px 10px;
    font-size: var(--app-font-size-sm);
    letter-spacing: 0;
  }

  @container (max-width: 420px) {
    gap: 7px;
    padding: 7px 10px;
    font-size: var(--app-font-size-sm);
    letter-spacing: 0;
  }
`;

const SparkIcon = styled(IonIcon)`
  color: var(--app-quiz-level-badge-icon);
  font-size: var(--app-font-size-md);

  @media (max-width: 420px) {
    font-size: var(--app-font-size-sm);
  }

  @container (max-width: 420px) {
    font-size: var(--app-font-size-sm);
  }
`;

const StarWrapper = styled.div`
  position: relative;
  padding-top: 36px;
  display: flex;
  justify-content: flex-start;

  @media (max-width: 420px) {
    padding-top: 26px;
  }

  @container (max-width: 420px) {
    padding-top: 26px;
  }
`;

const LevelUpText = styled.div`
  position: relative;
  font-size: var(--app-font-size-md);
  font-weight: 700;
  color: var(--app-quiz-level-card-text);
  white-space: nowrap;

  @media (max-width: 420px) {
    font-size: var(--app-font-size-sm);
  }

  @container (max-width: 420px) {
    font-size: var(--app-font-size-sm);
  }
`;

const ProgressBarTrack = styled.div`
  position: relative;
  height: 10px;
  margin-top: 10px;
  overflow: hidden;
  border-radius: 999px;
  background: var(--app-quiz-level-progress-track);
`;

const ProgressBarFill = styled.div<{ progress: number }>`
  width: ${(props) => props.progress}%;
  height: 100%;
  border-radius: inherit;
  background: var(--app-quiz-header-gradient);
  transition: width 0.3s ease;
`;

export { QuizLevelCard };
