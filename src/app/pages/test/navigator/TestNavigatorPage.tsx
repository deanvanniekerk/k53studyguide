import { arrowUp } from "ionicons/icons";
import React from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { bindActionCreators, Dispatch } from "redux";
import styled from "styled-components";

import { BackButton } from "@/app/components";
import { RootState } from "@/state";
import { navigateUp, targetNavigationParentSelector } from "@/state/dojo/navigation";
import { ROOT_NAVIGATION_KEY } from "@/state/study/navigation";
import { IonContent, IonPage } from "@ionic/react";

import { Header, Navigator } from "./components";

type Props = PropsFromState & PropsFromDispatch;

const TestNavigatorPage: React.FC<Props> = props => {
    const history = useHistory();

    const onBackClicked = () => {
        if (props.targetNavigationParent === ROOT_NAVIGATION_KEY) {
            if (history.length === 0) history.replace("/");
            else history.goBack();
            return;
        }
        props.navigateUp();
    };

    // const selectTargetNavigationItem = () => {

    // }

    return (
        <IonPage>
            <Content>
                <BackButton onClick={onBackClicked} icon={arrowUp} />
                <Header />
                <Navigator />
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
        targetNavigationParent: targetNavigationParentSelector(state),
    };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        ...bindActionCreators({ navigateUp }, dispatch),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TestNavigatorPage);
