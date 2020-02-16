import "./StudyPage.css";

import React from "react";
import { connect } from "react-redux";
import { RootState } from "src/state";
import { rootNavigationItemsSelector } from "src/state/study/navigation";

import { IonContent, IonItem, IonLabel, IonList, IonPage } from "@ionic/react";
import { Translate } from 'react-translated'

type Props = PropsFromState;

const StudyPage: React.FC<Props> = props => {
    return (
        <IonPage>
            <IonContent>
                <IonList>
                    {props.navigationItems.map(key => {
                        return (
                            <IonItem key={key}>
                                <IonLabel><Translate text={key} /></IonLabel>
                            </IonItem>
                        );
                    })}
                </IonList>
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

export default connect(mapStateToProps)(StudyPage);
