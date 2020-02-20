import { caretForward } from "ionicons/icons";
import React from "react";
import { Translate } from "react-translated";

import { IonButton, IonCol, IonGrid, IonIcon, IonRow } from "@ionic/react";

type Props = {
    onStartTestClicked: () => void;
};

const HeaderComponent: React.FC<Props> = props => {
    return (
        <IonGrid>
            <IonRow style={{ paddingTop: 20, paddingBottom: 20 }}>
                <IonCol>
                    <IonButton
                        color="secondary"
                        shape="round"
                        fill="solid"
                        className="button-med-large"
                        onClick={() => props.onStartTestClicked()}
                    >
                        <Translate text="continue" />
                        <IonIcon slot="end" icon={caretForward} />
                    </IonButton>
                </IonCol>
            </IonRow>
        </IonGrid>
    );
};

const Header = HeaderComponent;

export { Header };
