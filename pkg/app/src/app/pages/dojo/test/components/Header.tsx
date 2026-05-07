import { IonCol, IonGrid, IonListHeader, IonRow, IonText } from "@ionic/react";
import type React from "react";
import { connect } from "react-redux";
import { Translate } from "react-translated";
import styled from "styled-components";
import { Breadcrumb } from "@/app/components";
import type { RootState } from "@/state";
import { targetNavigationKeySelector } from "@/state/dojo/navigation";
import { questionAnswersSelector, totalQuestionsSelector } from "@/state/dojo/test";
import { ROOT_NAVIGATION_KEY } from "@/state/navigation";

type Props = {
  currentQuestionIndex: number;
} & PropsFromState;

const HeaderComponent: React.FC<Props> = (props) => {
  return (
    <IonListHeader>
      <IonGrid>
        <IonRow className="app-page-content-offset">
          <IonCol>
            <Title>
              <Translate
                text={props.targetNavigationKey === ROOT_NAVIGATION_KEY ? "allContent" : props.targetNavigationKey}
              />
            </Title>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol>
            <SubTitle>
              <Breadcrumb
                navigationKey={props.targetNavigationKey}
                rootText="allContent"
                showLast={props.targetNavigationKey === ROOT_NAVIGATION_KEY}
              />
            </SubTitle>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol>
            <ProgressCard>
              <QuestionCount>
                <Translate text="question" /> {props.currentQuestionIndex + 1} of {props.totalQuestions}
              </QuestionCount>
              <Dots>
                {props.questionAnswers.map((questionAnswer, index) => (
                  <Dot
                    key={questionAnswer.question.id}
                    $active={index === props.currentQuestionIndex}
                    $answered={Boolean(questionAnswer.answer)}
                  />
                ))}
              </Dots>
            </ProgressCard>
          </IonCol>
        </IonRow>
      </IonGrid>
    </IonListHeader>
  );
};

const Title = styled(IonText)`
  display: block;
  color: var(--app-text-primary);
  font-family: var(--ion-font-family-bold);
  font-size: var(--app-font-size-xxxl);
  font-weight: 900;
  line-height: 1.1;
  padding-top: 12px;
`;

const SubTitle = styled.div`
  --breadcrumb-color: currentColor;

  padding-top: 4px;
  color: var(--app-text-muted);
  font-size: var(--app-font-size-xl);
  font-weight: 700;
`;

const ProgressCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 16px;
  margin-bottom: 16px;
  padding: 15px 22px;
  border: var(--app-card-border);
  border-radius: 18px;
  background: var(--app-card-background);
  box-shadow: var(--app-card-shadow);
`;

const QuestionCount = styled.div`
  color: var(--app-text-muted);
  font-family: var(--ion-font-family-bold);
  font-size: var(--app-font-size-l);
  font-weight: 900;
  white-space: nowrap;
`;

const Dots = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 8px;
`;

const Dot = styled.div<{ $active: boolean; $answered: boolean }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${(props) => (props.$active || props.$answered ? "var(--app-progress-foreground)" : "var(--app-card-border-color)")};
  box-shadow: ${(props) => (props.$active ? "0 0 0 4px rgba(var(--app-progress-foreground-rgb), 0.12)" : "none")};
  transform: ${(props) => (props.$active ? "scale(1.1)" : "scale(1)")};
  animation: ${(props) => (props.$active ? "current-question-pulse 1.8s ease-in-out infinite" : "none")};

  @keyframes current-question-pulse {
    0%,
    100% {
      box-shadow: 0 0 0 4px rgba(var(--app-progress-foreground-rgb), 0.12);
      transform: scale(1.1);
    }

    50% {
      box-shadow: 0 0 0 7px rgba(var(--app-progress-foreground-rgb), 0.06);
      transform: scale(1.18);
    }
  }
`;

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
  return {
    targetNavigationKey: targetNavigationKeySelector(state),
    questionAnswers: questionAnswersSelector(state),
    totalQuestions: totalQuestionsSelector(state),
  };
};

const Header = connect(mapStateToProps)(HeaderComponent);

export { Header };
