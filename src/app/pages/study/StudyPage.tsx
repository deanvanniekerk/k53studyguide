import "./StudyPage.css";

import React, { useState } from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { RootState } from "src/state";
import {
    recieveCurrentNavigationKey,
    rootNavigationItemsSelector,
} from "src/state/study/navigation";

import { IonContent, IonList, IonModal, IonPage } from "@ionic/react";

import { NavigationItem } from "./components";
import ContentPage from "./content/ContentPage";

type Props = PropsFromState & PropsFromDispatch;

const StudyPage: React.FC<Props> = props => {
    const [showContent, setShowContent] = useState(false);

    const onNavigationItemClicked = (key: string) => {
        props.recieveCurrentNavigationKey(key);
        setShowContent(true);
    };

    return (
        <IonPage className="study-page">
            <IonContent>
                <IonList>
                    {props.navigationItems.map((key, index) => {
                        return (
                            <NavigationItem
                                key={key}
                                navigationItemKey={key}
                                onClick={onNavigationItemClicked}
                                index={index}
                            />
                        );
                    })}
                </IonList>
                <IonModal isOpen={showContent}>
                    <ContentPage onClose={() => setShowContent(false)} />
                </IonModal>
            </IonContent>
        </IonPage>
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    return {
        navigationItems: rootNavigationItemsSelector(state),
    };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        ...bindActionCreators({ recieveCurrentNavigationKey }, dispatch),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(StudyPage);
