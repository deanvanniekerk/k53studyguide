import { caretForward } from "ionicons/icons";
import React from "react";
import { Translate } from "react-translated";
import styled from "styled-components";

import { IonButton, IonCol, IonGrid, IonIcon, IonRow } from "@ionic/react";

type Props = {
    onStartTestClicked: () => void;
};
const Header: React.FC<Props> = props => {
    return (
        <IonGrid>
            <IonRow style={{ paddingTop: 45 }}>
                <IonCol>
                    <IntroText>
                        <Translate text="dojoIntro" />
                    </IntroText>
                </IonCol>
            </IonRow>
            <IonRow style={{ paddingTop: 25 }}>
                <IonCol>
                    <CenterText>
                        <IonButton
                            color="tertiary"
                            shape="round"
                            fill="solid"
                            className="button-med-large"
                            onClick={() => props.onStartTestClicked()}
                        >
                            <Translate text="continue" />
                            <IonIcon slot="end" icon={caretForward} />
                        </IonButton>
                    </CenterText>
                </IonCol>
            </IonRow>
        </IonGrid>
    );
};

const IntroText = styled.div`
    text-align: center;
    font-size: var(--ion-font-size-sm);
    font-weight: 100;
`;

const CenterText = styled.div`
    text-align: center;
`;

export { Header };
