import { caretForward } from "ionicons/icons";
import React from "react";
import { connect } from "react-redux";
import { Translate } from "react-translated";

import { Breadcrumb } from "@/app/components/Breadcrumb";
import { RootState } from "@/state";
import { lastSeenParentContentKeySelector } from "@/state/study/log";
import { IonButton, IonCol, IonGrid, IonIcon, IonListHeader, IonRow, IonText } from "@ionic/react";

import { SeenProgress } from "./";

type Props = {
    onNavigationItemClicked: (navigationItemKey: string) => void;
} & PropsFromState;

const HeaderComponent: React.FC<Props> = (props) => {
    return (
        <IonListHeader>
            <IonGrid>
                <IonRow style={{ paddingTop: 55 }}>
                    <IonCol>
                        <IonText>
                            <h2 style={{ fontWeight: "bold", marginBottom: 0 }}>
                                <Translate text={props.lastSeenParentContentKey} />
                            </h2>
                        </IonText>
                    </IonCol>
                </IonRow>
                <IonRow style={{ paddingBottom: 5, paddingTop: 8 }}>
                    <IonCol>
                        <Breadcrumb navigationKey={props.lastSeenParentContentKey} />
                    </IonCol>
                </IonRow>
                <IonRow style={{ paddingBottom: 10, paddingTop: 10 }}>
                    <IonCol>
                        <SeenProgress navigationKey={props.lastSeenParentContentKey} />
                    </IonCol>
                </IonRow>
                <IonRow style={{ paddingTop: 20, paddingBottom: 20 }}>
                    <IonCol>
                        <IonButton
                            color="primary"
                            shape="round"
                            fill="solid"
                            className="button-med-large"
                            onClick={() =>
                                props.onNavigationItemClicked(props.lastSeenParentContentKey)
                            }
                        >
                            <Translate text="continue" />
                            <IonIcon slot="end" icon={caretForward} />
                        </IonButton>
                    </IonCol>
                </IonRow>
            </IonGrid>
        </IonListHeader>
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    return {
        lastSeenParentContentKey: lastSeenParentContentKeySelector(state),
    };
};

const Header = connect(mapStateToProps)(HeaderComponent);

export { Header };
