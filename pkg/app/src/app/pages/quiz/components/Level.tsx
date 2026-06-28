import { QuizLevelCard } from "@k53studyguide/shared/react";
import type React from "react";
import { connect } from "react-redux";
import type { RootState } from "@/state";
import {
  quizCurrentExperiencePercentSelector,
  quizLevelSelector,
  requiredLevelUpExperiencePointsSelector,
} from "@/state/quiz/log";

type Props = PropsFromState;

const LevelComponent: React.FC<Props> = (props) => {
  return (
    <QuizLevelCard
      level={props.level}
      requiredLevelUpExperiencePoints={props.requiredLevelUpExperiencePoints}
      currentExperiencePercent={props.quizCurrentExperiencePercent}
    />
  );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
  return {
    level: quizLevelSelector(state),
    requiredLevelUpExperiencePoints: requiredLevelUpExperiencePointsSelector(state),
    quizCurrentExperiencePercent: quizCurrentExperiencePercentSelector(state),
  };
};

const Level = connect(mapStateToProps)(LevelComponent);

export { Level };
