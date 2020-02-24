import React from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { bindActionCreators, Dispatch } from "redux";
import styled from "styled-components";

import { BackButton } from "@/app/components";
import { recieveQuestionAnswers } from "@/state/dojo/test";
import { IonContent, IonPage, useIonViewWillLeave } from "@ionic/react";

import { QuestionList } from "../components";
import { Header } from "./components";
import { TestResultPageHeader } from "./TestResultPageHeader";

type Props = PropsFromDispatch;

const TestResultPage: React.FC<Props> = ({ recieveQuestionAnswers }) => {
    const history = useHistory();

    const onBackClicked = () => {
        if (history.length === 0) history.replace("/dojo");
        else history.goBack();
    };

    useIonViewWillLeave(() => {
        recieveQuestionAnswers([]); //Clear test
    });

    return (
        <IonPage>
            <TestResultPageHeader />
            <Content>
                <BackButton onClick={onBackClicked} />
                <Header />
                <QuestionList showResult={true} />
            </Content>
        </IonPage>
    );
};

const Content = styled(IonContent)`
    --background: var(--dojo-background);
`;

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        ...bindActionCreators({ recieveQuestionAnswers }, dispatch),
    };
};

export default connect(null, mapDispatchToProps)(TestResultPage);
