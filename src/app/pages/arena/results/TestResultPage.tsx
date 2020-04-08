import React from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { bindActionCreators, Dispatch } from "redux";
import styled from "styled-components";

import { BackButton, QuestionInfo, QuestionList } from "@/app/components";
import { RootState } from "@/state";
import { currentSectionQuestionsSelector, recieveQuestionAnswers } from "@/state/arena/test";
import { IonContent, IonPage, useIonViewWillLeave } from "@ionic/react";

import { ArenaWatermark } from "../ArenaWatermark";
import { Tabs } from "../components";
import { Header } from "./components";
import { TestResultPageHeader } from "./TestResultPageHeader";

type Props = PropsFromState & PropsFromDispatch;

const TestResultPage: React.FC<Props> = ({ questionAnswers, recieveQuestionAnswers }) => {
    const history = useHistory();

    useIonViewWillLeave(() => {
        recieveQuestionAnswers([]); //Clear test
    });

    const onBackClicked = () => {
        history.replace("/arena");
    };

    const questions = questionAnswers.map<QuestionInfo>((q) => ({
        question: q.question,
        answer: q.answer,
    }));

    return (
        <Page>
            <TestResultPageHeader />
            <ArenaWatermark />
            <Content>
                <BackButton onClick={onBackClicked} />
                <Header />
                <Tabs hideInfo={true} />
                <QuestionList questions={questions} showResult={true} />
            </Content>
        </Page>
    );
};

const Content = styled(IonContent)`
    --background: transparent;
`;

const Page = styled(IonPage)`
    background: var(--arena-background);
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
        ...bindActionCreators({ recieveQuestionAnswers }, dispatch),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TestResultPage);
