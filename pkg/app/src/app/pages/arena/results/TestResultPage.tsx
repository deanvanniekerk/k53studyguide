import { IonContent, IonPage, useIonViewWillLeave } from "@ionic/react";
import type React from "react";
import { useEffect } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { bindActionCreators, type Dispatch } from "redux";
import styled from "styled-components";
import { PageHeader } from "@/app/components";
import { useAnalytics } from "@/app/hooks/useAnalytics";
import { QuizQuestionCard } from "@/app/pages/dojo/components";
import type { RootState } from "@/state";
import { currentSectionQuestionsSelector, recieveCurrentSection, recieveQuestionAnswers } from "@/state/arena/test";
import { ArenaWatermark } from "../ArenaWatermark";
import { Tabs } from "../components";
import { Header } from "./components";

type Props = PropsFromState & PropsFromDispatch;

const TestResultPage: React.FC<Props> = ({ questionAnswers, recieveCurrentSection, recieveQuestionAnswers }) => {
  const history = useHistory();

  useAnalytics("TestPage:TestResultPage");

  useEffect(() => {
    recieveCurrentSection("A");
  }, [recieveCurrentSection]);

  useIonViewWillLeave(() => {
    recieveQuestionAnswers([]); //Clear test
  });

  const onBackClicked = () => {
    history.replace("/arena");
  };

  return (
    <Page>
      <PageHeader title="results" page="arena" onBackClick={onBackClicked} />
      <ArenaWatermark />
      <Content>
        <Header />
        <Tabs hideInfo={true} />
        <ResultList>
          {questionAnswers.map((questionAnswer, index) => (
            <ResultItem key={questionAnswer.question.id}>
              <QuestionNumber>Question {index + 1}</QuestionNumber>
              <QuizQuestionCard question={questionAnswer.question} answer={questionAnswer.answer} showResult={true} />
            </ResultItem>
          ))}
        </ResultList>
      </Content>
    </Page>
  );
};

const Content = styled(IonContent)`
  --background: transparent;
`;

const Page = styled(IonPage)`
  --app-question-accent: var(--app-arena-accent);
  --app-question-accent-rgb: var(--app-arena-accent-rgb);

  background: var(--app-arena-background);
`;

const ResultList = styled.div`
  padding-top: 0;
`;

const ResultItem = styled.div`
  overflow: hidden;
`;

const QuestionNumber = styled.div`
  margin: 0 var(--app-padding) 12px;
  color: var(--app-text-muted);
  font-family: var(--ion-font-family-bold);
  font-size: var(--app-font-size-l);
  font-weight: 900;
`;

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
  return {
    questionAnswers: currentSectionQuestionsSelector(state),
  };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    ...bindActionCreators({ recieveCurrentSection, recieveQuestionAnswers }, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TestResultPage);
