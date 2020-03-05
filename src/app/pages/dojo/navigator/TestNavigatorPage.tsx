import { arrowUp } from "ionicons/icons";
import React from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { bindActionCreators, Dispatch } from "redux";
import styled from "styled-components";

import { BackButton } from "@/app/components";
import { RootState } from "@/state";
import {
    navigateUp,
    recieveTargetNavigationKey,
    targetNavigationKeySelector,
} from "@/state/dojo/navigation";
import { ROOT_NAVIGATION_KEY } from "@/state/study/navigation";
import { IonContent, IonPage } from "@ionic/react";

import { Header, Navigator } from "./components";
import { TestNavigatorPageHeader } from "./TestNavigatorPageHeader";

type Props = PropsFromState & PropsFromDispatch;

const TestNavigatorPage: React.FC<Props> = props => {
    const history = useHistory();

    const navigateToDojo = () => {
        if (history.length === 0) history.replace("/");
        else history.goBack();
    };

    const onBackClicked = () => {
        if (props.targetNavigationKey === ROOT_NAVIGATION_KEY) {
            navigateToDojo();
            return;
        }
        props.navigateUp();
    };

    const selectTargetNavigationItem = () => {
        navigateToDojo();
    };

    const onNavigationItemClicked = (key: string) => {
        props.recieveTargetNavigationKey(key);
    };

    return (
        <IonPage>
            <TestNavigatorPageHeader />
            <Content>
                <BackButton onClick={onBackClicked} icon={arrowUp} />
                <Header selectTargetNavigationItem={selectTargetNavigationItem} />
                <Navigator onNavigationItemClicked={onNavigationItemClicked} />
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
        targetNavigationKey: targetNavigationKeySelector(state),
    };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        ...bindActionCreators({ navigateUp, recieveTargetNavigationKey }, dispatch),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TestNavigatorPage);
