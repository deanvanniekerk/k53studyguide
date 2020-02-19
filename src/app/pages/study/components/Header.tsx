import { caretForward } from "ionicons/icons";
import React from "react";
import { connect } from "react-redux";
import { Translate } from "react-translated";
import { Breadcrumb } from "src/app/components/Breadcrumb";
import { RootState } from "src/state";
import { lastSeenParentContentKeySelector } from "src/state/study/log";

import { IonButton, IonCol, IonGrid, IonIcon, IonListHeader, IonRow, IonText } from "@ionic/react";

import { SeenProgress } from "./";

type Props = {
    onNavigationItemClicked: (navigationItemKey: string) => void;
} & PropsFromState;

const HeaderComponent: React.FC<Props> = props => {
    return (
        <IonListHeader>
            <IonGrid>
                <IonRow style={{ paddingTop: 45 }}>
                    <IonCol>
                        <IonText>
                            <h2 style={{ fontWeight: "bold", marginBottom: 0 }}>
                                <Translate text={props.lastSeenParentContentKey} />
                            </h2>
                        </IonText>
                    </IonCol>
                </IonRow>
                <IonRow style={{ paddingBottom: 5, paddingTop: 5 }}>
                    <IonCol>
                        <Breadcrumb
                            navigationKey={props.lastSeenParentContentKey}
                            disableNavigation={true}
                        />
                    </IonCol>
                </IonRow>
                <IonRow style={{ paddingBottom: 10, paddingTop: 10 }}>
                    <IonCol>
                        <SeenProgress navigationKey={props.lastSeenParentContentKey} />
                    </IonCol>
                </IonRow>
                <IonRow style={{ paddingTop: 15, paddingBottom: 25 }}>
                    <IonCol>
                        <IonButton
                            color="primary"
                            shape="round"
                            fill="solid"
                            size="large"
                            onClick={() =>
                                props.onNavigationItemClicked(props.lastSeenParentContentKey)
                            }
                        >
                            <Translate text="continue" />
                            <IonIcon slot="end" size="small" icon={caretForward} />
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
