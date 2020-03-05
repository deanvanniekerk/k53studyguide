import { caretForward } from "ionicons/icons";
import React from "react";
import { connect } from "react-redux";
import { Translate } from "react-translated";
import styled from "styled-components";

import { RootState } from "@/state";
import { testsPassedSelector } from "@/state/arena/log";
import { IonButton, IonCol, IonGrid, IonIcon, IonRow } from "@ionic/react";

type Props = {
    onStartTestClicked: () => void;
} & PropsFromState;

const HeaderComponent: React.FC<Props> = props => {
    return (
        <IonGrid>
            <IonRow style={{ paddingTop: 45 }}>
                <IonCol>
                    <IntroText>
                        <Translate text="arenaIntro" />
                    </IntroText>
                </IonCol>
            </IonRow>
            <IonRow style={{ paddingTop: 15 }}>
                <IonCol>
                    <CenterText>
                        <h2>
                            <Translate text="arenasCompleted" />: {props.testsPassed}
                        </h2>
                    </CenterText>
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

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    return {
        testsPassed: testsPassedSelector(state),
    };
};

const Header = connect(mapStateToProps)(HeaderComponent);

export { Header };
