import React from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { bindActionCreators, Dispatch } from "redux";
import styled from "styled-components";

import { BackButton, QuestionInfo, QuestionList } from "@/app/components";
import { QuestionOption } from "@/data";
import { RootState } from "@/state";
import { questionAnswersSelector, recieveAnswer, submitTest } from "@/state/dojo/test";
import { IonContent, IonPage } from "@ionic/react";

import { Footer, Header } from "./components";
import { TestPageHeader } from "./TestPageHeader";

type Props = PropsFromState & PropsFromDispatch;

const TestPage: React.FC<Props> = props => {
    const history = useHistory();

    const onBackClicked = () => {
        if (history.length === 0) history.replace("/dojo");
        else history.goBack();
    };

    const onSubmitClicked = () => {
        props.submitTest();
        history.replace("/test-result");
    };

    const onOptionClicked = (questionId: string, option: QuestionOption) => {
        recieveAnswer(questionId, option.id);
    };

    const questions = props.questionAnswers.map<QuestionInfo>(q => ({
        question: q.question,
        answer: q.answer,
    }));

    return (
        <IonPage>
            <TestPageHeader />
            <Content>
                <BackButton onClick={onBackClicked} />
                <Header />
                <QuestionList questions={questions} onOptionClicked={onOptionClicked} />
                <Footer onSubmitClicked={onSubmitClicked} />
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
        ...bindActionCreators({ submitTest, recieveAnswer }, dispatch),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TestPage);
