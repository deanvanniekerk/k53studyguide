import { CreateAnimation, IonIcon } from "@ionic/react";
import { flash, flashOffOutline, trophy } from "ionicons/icons";
import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Translate } from "react-translated";
import styled from "styled-components";
import { TestFailedIcon, TestPassedIcon } from "@/app/components/icons";
import { useAnalytics } from "@/app/hooks/useAnalytics";
import type { RootState } from "@/state";
import { experienceGainedSelector, totalCorrectAnswersSelector, totalQuestionsSelector } from "@/state/quiz/session";

type Props = PropsFromState;

const HeaderComponent: React.FC<Props> = (props) => {
  const { logEvent } = useAnalytics();

  useEffect(() => {
    logEvent("QUIZ_RESULT", {
      totalQuestions: props.totalQuestions,
      totalCorrectAnswers: props.totalCorrectAnswers,
      experienceGained: props.experienceGained,
    });
  }, []);

  const allCorrect = props.totalCorrectAnswers === props.totalQuestions;

  if (props.totalQuestions === 0) return <React.Fragment />;

  return (
    <React.Fragment>
      <Result>
        <Glow />
        <ResultIcon allCorrect={allCorrect} />
        <div style={{ overflow: "hidden" }}>
          <ResultText totalCorrectAnswers={props.totalCorrectAnswers} totalQuestions={props.totalQuestions} />
        </div>
        <ExperienceGained>
          <ExperienceIcon icon={props.experienceGained === 0 ? flashOffOutline : flash} />
          <Translate text="numberExperienceGained" data={{ number: props.experienceGained.toString() }} />
        </ExperienceGained>
      </Result>
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
        {props.allCorrect && <TestPassedIcon style={{ fontSize: "3.7rem" }} />}
        {!props.allCorrect && <TestFailedIcon style={{ fontSize: "3.7rem" }} />}
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
  margin: var(--app-page-content-top) var(--app-padding) 28px;
  padding: 28px 22px 26px;
  border-radius: 28px;
  color: var(--ion-color-light);
  background: var(--app-quiz-header-gradient);
  box-shadow: 0 18px 35px rgba(var(--app-progress-foreground-rgb), 0.2);
  font-size: var(--app-font-size-l);
  text-align: center;
  font-family: var(--ion-font-family-bold);
  font-weight: bold;
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
  position: relative;
  padding-top: 12px;
  text-align: center;
  font-family: var(--ion-font-family);
  font-size: var(--app-font-size-l);
  font-weight: 800;
`;

const ExperienceIcon = styled(IonIcon)`
  margin-right: 7px;
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
  };
};

const Header = connect(mapStateToProps)(HeaderComponent);

export { Header };
