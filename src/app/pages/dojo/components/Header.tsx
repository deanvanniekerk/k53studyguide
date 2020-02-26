import React from "react";
import { Translate } from "react-translated";
import styled from "styled-components";

import { IonCol, IonGrid, IonRow } from "@ionic/react";

import { Level } from "./";

const Header: React.FC = () => {
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
        </IonGrid>
    );
};

const IntroText = styled.div`
    text-align: center;
    font-size: var(--ion-font-size-sm);
    font-weight: 100;
`;

export { Header };
