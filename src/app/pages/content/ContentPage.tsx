import { arrowUp } from "ionicons/icons";
import React from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { bindActionCreators, Dispatch } from "redux";
import styled from "styled-components";

import { BackButton } from "@/app/components";
import { PagodaOutlineIcon } from "@/app/components/icons";
import { watermarkStyle } from "@/app/styles";
import { RootState } from "@/state";
import {
    currentNavigationParentSelector,
    navigateUp,
    ROOT_NAVIGATION_KEY,
} from "@/state/study/navigation";
import { IonContent, IonPage } from "@ionic/react";

import { ContentList, Header, Navigator } from "./components";

type Props = PropsFromState & PropsFromDispatch;

const ContentPage: React.FC<Props> = props => {
    const history = useHistory();

    const onBackClicked = () => {
        if (props.currentNavigationParent === ROOT_NAVIGATION_KEY) {
            if (history.length === 0) history.replace("/");
            else history.goBack();
            return;
        }
        props.navigateUp();
    };

    return (
        <Page>
            <Watermark />
            <Content>
                <BackButton onClick={onBackClicked} icon={arrowUp} />
                <Header />
                <Navigator />
                <ContentList />
            </Content>
        </Page>
    );
};

const Watermark = styled(PagodaOutlineIcon)`
    ${watermarkStyle}
`;

const Content = styled(IonContent)`
    --background: transparent;
`;

const Page = styled(IonPage)`
    background: var(--study-background);
`;

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    return {
        currentNavigationParent: currentNavigationParentSelector(state),
    };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        ...bindActionCreators({ navigateUp }, dispatch),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ContentPage);
