import "./StudyPage.css";

import React from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { bindActionCreators, Dispatch } from "redux";
import { RootState } from "src/state";
import {
    recieveCurrentNavigationKey,
    rootNavigationChildrenSelector,
} from "src/state/study/navigation";

import { IonCol, IonContent, IonGrid, IonPage, IonRow } from "@ionic/react";

import { Header, NavigationItem } from "./components";

type Props = PropsFromState & PropsFromDispatch;

const StudyPage: React.FC<Props> = props => {
    let history = useHistory();

    const onNavigationItemClicked = (key: string) => {
        props.recieveCurrentNavigationKey(key);
        history.push(`/content`);
    };

    return (
        <IonPage className="study-page">
            <IonContent>
                <Header />
                <IonGrid style={{ padding: 10 }}>
                    <IonRow>
                        {props.navigationChildren.map((key, index) => {
                            return (
                                <IonCol
                                    key={key}
                                    sizeXs="12"
                                    sizeSm="4"
                                    sizeMd="3"
                                    sizeLg="2"
                                    style={{ overflow: "hidden" }}
                                >
                                    <NavigationItem
                                        navigationItemKey={key}
                                        onClick={onNavigationItemClicked}
                                        index={index}
                                    />
                                </IonCol>
                            );
                        })}
                    </IonRow>
                </IonGrid>
            </IonContent>
        </IonPage>
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    return {
        navigationChildren: rootNavigationChildrenSelector(state),
    };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        ...bindActionCreators({ recieveCurrentNavigationKey }, dispatch),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(StudyPage);
