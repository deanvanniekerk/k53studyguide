import "./ContentPage.css";

import React from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { bindActionCreators, Dispatch } from "redux";
import { RootState } from "src/state";
import {
    currentNavigationKeySelector,
    currentNavigationParentSelector,
    navigateUp,
    navigationDataSelector,
    ROOT_NAVIGATION_KEY,
} from "src/state/study/navigation";

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
        <IonPage className="content-page">
            <IonContent>
                <Header onBackClicked={onBackClicked} />
                <Navigator />
                <ContentList />
            </IonContent>
        </IonPage>
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    return {
        navigationData: navigationDataSelector(state),
        currentNavigationKey: currentNavigationKeySelector(state),
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
