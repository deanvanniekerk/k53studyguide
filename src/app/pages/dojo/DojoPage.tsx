import React from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { bindActionCreators, Dispatch } from "redux";
import styled from "styled-components";

import { RootState } from "@/state";
import { loadQuestionAnswers, testInProgressSelector } from "@/state/dojo/test";
import { IonContent, IonPage } from "@ionic/react";

import { Header, Settings } from "./components";
import { DojoPageHeader } from "./DojoPageHeader";

type Props = PropsFromState & PropsFromDispatch;

const DojoPage: React.FC<Props> = props => {
    const history = useHistory();

    const onStartTestClicked = () => {
        //If no test exists, load one, else continue with previous
        if (!props.testInProgress) props.loadQuestionAnswers();

        history.push(`/test`);
    };

    return (
        <IonPage className="dojo-page">
            <DojoPageHeader />
            <Content>
                <Header />
                <Settings onStartTestClicked={onStartTestClicked} />
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
        testInProgress: testInProgressSelector(state),
    };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        ...bindActionCreators({ loadQuestionAnswers }, dispatch),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DojoPage);
