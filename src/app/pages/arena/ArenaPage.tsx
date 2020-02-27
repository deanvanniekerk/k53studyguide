import { caretForward } from "ionicons/icons";
import React from "react";
import { Translate } from "react-translated";
import styled from "styled-components";

import { IonButton, IonCol, IonContent, IonGrid, IonIcon, IonPage, IonRow } from "@ionic/react";

import { ArenaPageHeader } from "./ArenaPageHeader";

const ArenaPage: React.FC = () => {
    return (
        <IonPage className="arena-page">
            <ArenaPageHeader />
            <Content>
                <IonGrid>
                    <IonRow style={{ paddingLeft: 16, paddingTop: 55 }}>
                        <IonCol>
                            <IonButton
                                color="tertiary"
                                shape="round"
                                fill="solid"
                                className="button-med-large"
                                // onClick={() => props.onStartTestClicked()}
                            >
                                <Translate text="continue" />
                                <IonIcon slot="end" icon={caretForward} />
                            </IonButton>
                        </IonCol>
                    </IonRow>
                </IonGrid>
            </Content>
        </IonPage>
    );
};

const Content = styled(IonContent)`
    --background: var(--arena-background);
`;

export default ArenaPage;
