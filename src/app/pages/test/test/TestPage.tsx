import React from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { bindActionCreators, Dispatch } from "redux";
import styled from "styled-components";

import { BackButton } from "@/app/components";
import { submitTest } from "@/state/dojo/test";
import { IonContent, IonPage } from "@ionic/react";

import { QuestionList } from "../components";
import { Footer, Header } from "./components";
import { TestPageHeader } from "./TestPageHeader";

type Props = PropsFromDispatch;

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

    return (
        <IonPage>
            <TestPageHeader />
            <Content>
                <BackButton onClick={onBackClicked} />
                <Header />
                <QuestionList />
                <Footer onSubmitClicked={onSubmitClicked} />
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
        ...bindActionCreators({ submitTest }, dispatch),
    };
};

export default connect(null, mapDispatchToProps)(TestPage);
