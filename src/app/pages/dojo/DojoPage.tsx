import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { bindActionCreators, Dispatch } from "redux";
import styled from "styled-components";

import { RootState } from "@/state";
import { loadQuestionAnswers, testInProgressSelector } from "@/state/dojo/test";
import { notificationsSelector, recieveRecieveNotificationState } from "@/state/notifications";
import { IonContent, IonPage } from "@ionic/react";

import { Header, Settings } from "./components";
import { DojoInfoModal } from "./DojoInfoModal";
import { DojoPageHeader } from "./DojoPageHeader";
import { DojoWatermark } from "./DojoWatermark";

type Props = PropsFromState & PropsFromDispatch;

const DojoPage: React.FC<Props> = props => {
    const history = useHistory();

    const [infoModalVisible, setInfoModalVisible] = useState(false);

    useEffect(() => {
        if (!props.infoSeen) {
            showInfoModal();
        }
    }, [props.infoSeen]);

    const showInfoModal = () => {
        setInfoModalVisible(true);
        props.recieveRecieveNotificationState("dojoInfo", { seen: true });
    };

    const onStartTestClicked = () => {
        //If no test exists, load one, else continue with previous
        if (!props.testInProgress) props.loadQuestionAnswers();

        history.push(`/dojo-test`);
    };

    return (
        <Page>
            <DojoInfoModal
                isOpen={infoModalVisible}
                onDidDismiss={() => {
                    setInfoModalVisible(false);
                }}
            />
            <DojoPageHeader />
            <DojoWatermark />
            <Content>
                <Header />
                <Settings onStartTestClicked={onStartTestClicked} />
            </Content>
        </Page>
    );
};

const Content = styled(IonContent)`
    --background: transparent;
`;

const Page = styled(IonPage)`
    background: var(--dojo-background);
`;

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    return {
        testInProgress: testInProgressSelector(state),
        infoSeen: notificationsSelector(state).dojoInfo.seen,
    };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        ...bindActionCreators({ loadQuestionAnswers, recieveRecieveNotificationState }, dispatch),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DojoPage);
