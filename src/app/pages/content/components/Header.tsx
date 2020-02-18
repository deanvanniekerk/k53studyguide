import { arrowBackOutline } from "ionicons/icons";
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
    onBackClicked: () => void;
} & PropsFromState;

const HeaderComponent: React.FC<Props> = props => {
    return (
        <IonListHeader>
            <IonGrid>
                <IonRow>
                    <IonCol>
                        <IonIcon
                            style={{ marginTop: 12, opacity: 0.4, fontSize: 24 }}
                            icon={arrowBackOutline}
                            onClick={props.onBackClicked}
                        />
                    </IonCol>
                </IonRow>
                <IonRow style={{ paddingTop: 8 }}>
                    <IonCol>
                        <IonText>
                            <h2>
                                <Translate text={props.currentNavigationKey} />
                            </h2>
                        </IonText>
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
