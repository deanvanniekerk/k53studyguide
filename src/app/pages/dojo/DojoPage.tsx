import React from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { bindActionCreators, Dispatch } from "redux";
import styled from "styled-components";

import { loadQuestionAnswers } from "@/state/dojo/test";
import { IonContent, IonPage } from "@ionic/react";

import { Header } from "./components";
import { DojoPageHeader } from "./DojoPageHeader";

type Props = PropsFromDispatch;

const DojoPage: React.FC<Props> = props => {
    const history = useHistory();

    const onStartTestClicked = () => {
        props.loadQuestionAnswers();
        history.push(`/test`);
    };

    return (
        <IonPage className="dojo-page">
            <DojoPageHeader />
            <Content>
                <Header onStartTestClicked={onStartTestClicked} />
            </Content>
        </IonPage>
    );
};

const Content = styled(IonContent)`
    --background: linear-gradient(to right bottom, #501a8e, #9a0684, #cc1e73, #ed4c60, #ff7b51);
`;

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        ...bindActionCreators({ loadQuestionAnswers }, dispatch),
    };
};

export default connect(null, mapDispatchToProps)(DojoPage);
