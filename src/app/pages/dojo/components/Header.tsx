import React from "react";
import { Translate } from "react-translated";
import styled from "styled-components";

import { IonCol, IonGrid, IonRow } from "@ionic/react";

import { Level, Target } from "./";

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
                    <Level />
                </IonCol>
            </IonRow>
            <IonRow style={{ paddingTop: 15 }}>
                <IonCol>
                    <Target onStartTestClicked={props.onStartTestClicked} />
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

export { Header };
