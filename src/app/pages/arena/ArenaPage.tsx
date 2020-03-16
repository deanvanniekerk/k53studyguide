import React, { useContext } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router";
import { bindActionCreators, Dispatch } from "redux";
import styled from "styled-components";

import { PurchaseContext } from "@/context";
import { RootState } from "@/state";
import { loadQuestionAnswers, testInProgressSelector } from "@/state/arena/test";
import { hasFullAccessSelector } from "@/state/purchase";
import { IonContent, IonPage, useIonViewWillEnter } from "@ionic/react";

import { ArenaPageHeader } from "./ArenaPageHeader";
import { ArenaWatermark } from "./ArenaWatermark";
import { Header } from "./components";

type Props = PropsFromState & PropsFromDispatch;

const ArenaPage: React.FC<Props> = props => {
    const history = useHistory();
    const purchaseService = useContext(PurchaseContext);

    useIonViewWillEnter(() => {
        if (!props.hasFullAccess && purchaseService) purchaseService.loadPurchase();
    });

    const onStartTestClicked = () => {
        //If no test exists, load one, else continue with previous
        if (!props.testInProgress) props.loadQuestionAnswers();

        history.push(`/arena-test`);
    };

    return (
        <Page>
            <ArenaPageHeader />
            <ArenaWatermark />
            <Content>
                <Header onStartTestClicked={onStartTestClicked} />
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
        testInProgress: testInProgressSelector(state),
        hasFullAccess: hasFullAccessSelector(state),
    };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        ...bindActionCreators({ loadQuestionAnswers }, dispatch),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ArenaPage);
