import React, { useRef } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { bindActionCreators, Dispatch } from "redux";
import styled from "styled-components";

import { BackButton, QuestionInfo, QuestionList } from "@/app/components";
import { QuestionOption } from "@/data";
import { RootState } from "@/state";
import {
    currentSectionQuestionsSelector,
    QuestionAnswer,
    recieveAnswer,
    recieveCurrentSection,
    submitTest,
} from "@/state/arena/test";
import { IonContent, IonPage } from "@ionic/react";

import { Tabs } from "../components";
import { Footer, Header } from "./components";
import { TestPageHeader } from "./TestPageHeader";

type Props = PropsFromState & PropsFromDispatch;

const TestPage: React.FC<Props> = props => {
    const history = useHistory();
    const content = useRef<HTMLIonContentElement>(null);

    const onBackClicked = () => {
        if (history.length === 0) history.replace("/arena");
        else history.goBack();
    };

    const onSubmitClicked = () => {
        props.submitTest();
        props.recieveCurrentSection("A");
        history.replace("/arena-test-result");
    };

    const onOptionClicked = (questionId: string, option: QuestionOption) => {
        props.recieveAnswer(questionId, option.id);
    };

    const mapToQuestionInfo = (questionAnswer: QuestionAnswer): QuestionInfo => {
        return {
            question: questionAnswer.question,
            answer: questionAnswer.answer,
        };
    };

    const onScrollTop = () => {
        if (content.current) content.current.scrollToTop(500);
    };

    const questions = props.questionAnswers.map<QuestionInfo>(mapToQuestionInfo);

    return (
        <IonPage>
            <TestPageHeader />
            <Content ref={content}>
                <BackButton onClick={onBackClicked} />
                <Header />
                <Tabs />
                <QuestionList questions={questions} onOptionClicked={onOptionClicked} />
                <Footer onSubmitClicked={onSubmitClicked} onScrollTop={onScrollTop} />
            </Content>
        </IonPage>
    );
};

const Content = styled(IonContent)`
    --background: var(--arena-background);
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
        ...bindActionCreators({ recieveAnswer, recieveCurrentSection, submitTest }, dispatch),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TestPage);
