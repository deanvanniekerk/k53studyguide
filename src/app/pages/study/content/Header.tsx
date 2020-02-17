import "./Header.css";

import { closeOutline } from "ionicons/icons";
import React from "react";
import { connect } from "react-redux";
import { Translate } from "react-translated";
import { HorizontalRule } from "src/app/components";
import { RootState } from "src/state";
import { currentNavigationKeySelector } from "src/state/study/navigation";

import { IonCol, IonGrid, IonIcon, IonListHeader, IonRow, IonText } from "@ionic/react";

import { Breadcrumb } from "./Breadcrumb";
import { SeenProgress } from "./SeenProgress";

type Props = {
    onClose: () => void;
} & PropsFromState;

const HeaderComponent: React.FC<Props> = props => {
    return (
        <IonListHeader className="study-content-header">
            <IonGrid>
                <IonRow class="ion-align-items-center" style={{ paddingTop: 35 }}>
                    <IonCol>
                        <IonText>
                            <h2>
                                <Translate text={props.currentNavigationKey} />
                            </h2>
                        </IonText>
                    </IonCol>
                    <IonCol style={{ flex: 0 }} className="ion-align-self-end">
                        <IonIcon
                            style={{ marginRight: 10 }}
                            icon={closeOutline}
                            onClick={props.onClose}
                            className="close-icon"
                        />
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol>
                        <Breadcrumb />
                    </IonCol>
                </IonRow>
                <IonRow style={{ paddingTop: 20 }}>
                    <IonCol>
                        <SeenProgress navigationKey={props.currentNavigationKey} />
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol>
                        <HorizontalRule
                            leftMargin={20}
                            rightMargin={36}
                            paddingBottom={0}
                            paddingTop={20}
                        />
                    </IonCol>
                </IonRow>
            </IonGrid>
        </IonListHeader>
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    return {
        currentNavigationKey: currentNavigationKeySelector(state),
    };
};

const Header = connect(mapStateToProps)(HeaderComponent);

export { Header };
