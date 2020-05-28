import { caretForward, lockClosedOutline } from "ionicons/icons";
import React, { useRef, useState } from "react";
import { connect } from "react-redux";
import { Translate } from "react-translated";
import styled from "styled-components";

import { KatanaIcon } from "@/app/components/icons";
import PurchaseModal from "@/app/modals/PurchaseModal";
import { RootState } from "@/state";
import { testsPassedSelector } from "@/state/arena/log";
import { testInProgressSelector } from "@/state/arena/test";
import { canPurchaseSelector, hasFullAccessSelector } from "@/state/purchase";
import {
    CreateAnimation,
    IonButton,
    IonCol,
    IonGrid,
    IonIcon,
    IonRow,
    useIonViewWillEnter,
} from "@ionic/react";

type Props = {
    onStartTestClicked: () => void;
} & PropsFromState;

const HeaderComponent: React.FC<Props> = (props) => {
    const animationIcon = useRef<CreateAnimation>(null);
    const animationCounter = useRef<CreateAnimation>(null);

    const [purchaseModalVisible, setPurchaseModalVisible] = useState(false);

    useIonViewWillEnter(() => {
        if (animationIcon.current) animationIcon.current.animation.play();
        if (animationCounter.current) animationCounter.current.animation.play();
    });

    return (
        <IonGrid>
            <IonRow style={{ paddingTop: 45 }}>
                <IonCol>
                    <IntroText>
                        <Translate text="arenaIntro" />
                    </IntroText>
                </IonCol>
            </IonRow>
            <IonRow style={{ paddingTop: 35 }}>
                <IonCol style={{ textAlign: "center" }}>
                    <CreateAnimation
                        play={false}
                        ref={animationIcon}
                        duration={600}
                        delay={100}
                        easing="ease"
                        keyframes={[
                            { offset: 0, transform: "scale(0)" },
                            { offset: 0.8, transform: "scale(1.2)" },
                            { offset: 1, transform: "scale(1)" },
                        ]}
                    >
                        <div>
                            <KatanaIcon style={{ fontSize: "8rem" }} />
                        </div>
                    </CreateAnimation>
                </IonCol>
            </IonRow>
            <IonRow style={{ paddingTop: 25 }}>
                <IonCol>
                    <CenterText>
                        <PrimaryText>
                            {props.hasFullAccess ? "Arenas Completed" : "Arena Locked"}
                        </PrimaryText>
                    </CenterText>
                </IonCol>
            </IonRow>
            <IonRow style={{ paddingTop: 25 }}>
                <IonCol>
                    <CenterText>
                        {props.hasFullAccess && (
                            <CreateAnimation
                                play={false}
                                ref={animationCounter}
                                delay={100}
                                duration={500}
                                easing="ease"
                                fromTo={{
                                    property: "transform",
                                    fromValue: "translateY(85px)",
                                    toValue: "translateY(0px)",
                                }}
                            >
                                <Counter>{props.testsPassed}</Counter>
                            </CreateAnimation>
                        )}
                        {!props.hasFullAccess && (
                            <IonIcon icon={lockClosedOutline} style={{ fontSize: "4rem" }} />
                        )}
                    </CenterText>
                </IonCol>
            </IonRow>

            <IonRow style={{ paddingTop: 25 }}>
                <IonCol>
                    <CenterText>
                        {props.hasFullAccess && (
                            <IonButton
                                color="tertiary"
                                shape="round"
                                fill="solid"
                                className="button-med-large"
                                onClick={() => props.onStartTestClicked()}
                            >
                                <Translate
                                    text={props.testInProgress ? "continue" : "enterArena"}
                                />
                                <IonIcon slot="end" icon={caretForward} />
                            </IonButton>
                        )}
                        {!props.hasFullAccess && (
                            <React.Fragment>
                                <FullAccessText>
                                    In order to access the Arena you need to first purchase the
                                    premium package
                                </FullAccessText>
                                <IonButton
                                    color="tertiary"
                                    shape="round"
                                    fill="solid"
                                    className="button-med-large"
                                    disabled={!props.canPurchase}
                                    onClick={() => setPurchaseModalVisible(true)}
                                >
                                    Go Premium
                                </IonButton>
                            </React.Fragment>
                        )}
                    </CenterText>
                </IonCol>
            </IonRow>
            <PurchaseModal
                isOpen={purchaseModalVisible}
                onDidDismiss={() => {
                    setPurchaseModalVisible(false);
                }}
            />
        </IonGrid>
    );
};

const IntroText = styled.div`
    text-align: center;
    font-size: var(--ion-font-size-sm);
    font-weight: 100;
`;

const PrimaryText = styled.div`
    font-size: var(--ion-font-size-xl);
    font-family: var(--ion-font-family-bold);
    font-weight: bold;
    text-transform: uppercase;
`;

const Counter = styled.div`
    font-size: 4rem;
    font-family: var(--ion-font-family-bold);
    font-weight: bold;
`;

const CenterText = styled.div`
    text-align: center;
    overflow: hidden;
`;

const FullAccessText = styled.div`
    font-size: var(--ion-font-size-sm);
    padding-bottom: 25px;
    padding-right: 20px;
    padding-left: 20px;
`;

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    return {
        hasFullAccess: hasFullAccessSelector(state),
        testsPassed: testsPassedSelector(state),
        testInProgress: testInProgressSelector(state),
        canPurchase: canPurchaseSelector(state),
    };
};

const Header = connect(mapStateToProps)(HeaderComponent);

export { Header };
