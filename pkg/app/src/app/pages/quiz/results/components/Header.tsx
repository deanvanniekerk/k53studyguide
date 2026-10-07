import { CreateAnimation, IonIcon } from "@ionic/react";
import { Translate } from "@k53studyguide/shared/translation";
import { flash, flashOffOutline, trophy } from "ionicons/icons";
import React, { useEffect } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { Illustration } from "@/app/components/Illustration";
import { PremiumInvitation } from "@/app/components/PremiumInvitation";
import { useSuccessfulQuizReviewPrompt } from "@/app/hooks/useSuccessfulQuizReviewPrompt";
import type { RootState } from "@/state";
import {
  completedAtSelector,
  experienceGainedSelector,
  totalCorrectAnswersSelector,
  totalQuestionsSelector,
} from "@/state/quiz/session";

type Props = PropsFromState;

const HeaderComponent: React.FC<Props> = (props) => {
  const requestSuccessfulQuizReview = useSuccessfulQuizReviewPrompt();
  const allCorrect = props.totalQuestions > 0 && props.totalCorrectAnswers === props.totalQuestions;

  useEffect(() => {
    if (allCorrect && props.completedAt) requestSuccessfulQuizReview(props.completedAt);
  }, [allCorrect, props.completedAt, requestSuccessfulQuizReview]);

  if (props.totalQuestions === 0) return <React.Fragment />;

  return (
    <React.Fragment>
      <Result>
        <Glow />
        <ResultIcon allCorrect={allCorrect} />
        <ResultCopy>
          <div style={{ overflow: "hidden" }}>
            <ResultText totalCorrectAnswers={props.totalCorrectAnswers} totalQuestions={props.totalQuestions} />
          </div>
          <ExperienceGained>
            <ExperienceIcon icon={props.experienceGained === 0 ? flashOffOutline : flash} />
            <span>
              <Translate text="numberExperienceGained" data={{ number: props.experienceGained.toString() }} />
            </span>
          </ExperienceGained>
        </ResultCopy>
      </Result>
      <PremiumInvitation origin="quiz_results" needsPractice={!allCorrect} />
      <ReviewTitle>
        <IonIcon icon={trophy} />
        <Translate text="results" />
      </ReviewTitle>
    </React.Fragment>
  );
};

type ResultIconProps = {
  allCorrect: boolean;
};

const ResultIcon: React.FC<ResultIconProps> = (props) => {
  return (
    <CreateAnimation
      play={true}
      duration={700}
      easing="ease"
      delay={600}
      keyframes={[
        { offset: 0, transform: "scale(1)" },
        { offset: 0.5, transform: "scale(1.3)" },
        { offset: 1, transform: "scale(1)" },
      ]}
    >
      <div>
        <Illustration name={props.allCorrect ? "quiz-success" : "quiz-practice"} size={52} />
      </div>
    </CreateAnimation>
  );
};

type ResultTextProps = {
  totalCorrectAnswers: number;
  totalQuestions: number;
};

const ResultText: React.FC<ResultTextProps> = (props) => {
  return (
    <CreateAnimation
      play={true}
      duration={700}
      easing="ease"
      delay={200}
      fromTo={{
        property: "transform",
        fromValue: "translateY(80px)",
        toValue: "translateY(0px)",
      }}
    >
      <h2>
        <Translate text="result" />: {props.totalCorrectAnswers} / {props.totalQuestions}
      </h2>
    </CreateAnimation>
  );
};

const Result = styled.div`
  position: relative;
  overflow: hidden;
  display: grid;
  grid-template-columns: 52px minmax(0, 1fr);
  align-items: center;
  gap: 14px;
  margin: var(--app-page-content-top) var(--app-padding) 16px;
  padding: 18px;
  h2 { margin: 0; font-size: var(--app-font-size-xl); font-weight: 900; }
  border-radius: 28px;
  color: var(--ion-color-light);
  background: var(--app-quiz-header-gradient);
  box-shadow: 0 18px 35px rgba(var(--app-progress-foreground-rgb), 0.2);
  font-size: var(--app-font-size-l);
  text-align: left;
  font-family: var(--ion-font-family-bold);
  font-weight: bold;
`;

const ResultCopy = styled.div`
  position: relative;
  min-width: 0;
  display: grid;
  gap: 6px;
`;

const Glow = styled.div`
  position: absolute;
  right: -34px;
  top: -34px;
  width: 140px;
  height: 140px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.16);
`;

const ExperienceGained = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 6px;
  font-family: var(--ion-font-family);
  font-size: var(--app-font-size-md);
  font-weight: 800;
  line-height: 1.4;
`;

const ExperienceIcon = styled(IonIcon)`
  flex: 0 0 1em;
  margin-top: 0.2em;
  color: #ffd43b;
`;

const ReviewTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 var(--app-padding) 16px;
  color: var(--app-text-muted);
  font-family: var(--ion-font-family-bold);
  font-size: var(--app-font-size-l);
  font-weight: 900;
  letter-spacing: 1px;
  text-transform: uppercase;
`;

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
  return {
    totalQuestions: totalQuestionsSelector(state),
    totalCorrectAnswers: totalCorrectAnswersSelector(state),
    experienceGained: experienceGainedSelector(state),
    completedAt: completedAtSelector(state),
  };
};

const Header = connect(mapStateToProps)(HeaderComponent);

export { Header };
