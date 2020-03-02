import React from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { bindActionCreators, Dispatch } from "redux";
import styled from "styled-components";

import { BackButton, QuestionInfo, QuestionList } from "@/app/components";
import { RootState } from "@/state";
import { questionAnswersSelector } from "@/state/arena/test";
import { recieveQuestionAnswers } from "@/state/dojo/test";
import { IonContent, IonPage, useIonViewWillLeave } from "@ionic/react";

import { Header } from "./components";
import { TestResultPageHeader } from "./TestResultPageHeader";

type Props = PropsFromState & PropsFromDispatch;

const TestResultPage: React.FC<Props> = ({ questionAnswers, recieveQuestionAnswers }) => {
    const history = useHistory();

    useIonViewWillLeave(() => {
        recieveQuestionAnswers([]); //Clear test
    });

    const onBackClicked = () => {
        if (history.length === 0) history.replace("/dojo");
        else history.goBack();
    };

    const questions = questionAnswers.map<QuestionInfo>(q => ({
        question: q.question,
        answer: q.answer,
    }));

    return (
        <IonPage>
            <TestResultPageHeader />
            <Content>
                <BackButton onClick={onBackClicked} />
                <Header />
                <QuestionList questions={questions} showResult={true} />
            </Content>
        </IonPage>
    );
};

const Content = styled(IonContent)`
    --background: var(--dojo-background);
`;

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    return {
        questionAnswers: questionAnswersSelector(state),
    };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        ...bindActionCreators({ recieveQuestionAnswers }, dispatch),
    };
};

export default connect(null, mapDispatchToProps)(TestResultPage);
