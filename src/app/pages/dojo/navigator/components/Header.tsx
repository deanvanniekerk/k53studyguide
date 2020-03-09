import React from "react";
import { connect } from "react-redux";
import { Translate } from "react-translated";
import styled from "styled-components";

import { HorizontalRule, StarRating } from "@/app/components";
import { Breadcrumb } from "@/app/components/Breadcrumb";
import { RootState } from "@/state";
import {
    correctlyAnsweredQuestionsTotalsSelector,
    targetNavigationKeySelector,
} from "@/state/dojo/navigation";
import { ROOT_NAVIGATION_KEY } from "@/state/navigation";
import { IonButton, IonCol, IonGrid, IonListHeader, IonRow, IonText } from "@ionic/react";

type Props = {
    selectTargetNavigationItem: () => void;
} & PropsFromState;

const HeaderComponent: React.FC<Props> = props => {
    const total = props.correctlyAnsweredQuestionsTotals[props.targetNavigationKey];
    const current = total ? total.level : 0;

    return (
        <>
            <IonListHeader>
                <IonGrid>
                    <IonRow style={{ paddingTop: 55 }}>
                        <IonCol>
                            <IonText>
                                <h2>
                                    <Translate
                                        text={
                                            props.targetNavigationKey === ROOT_NAVIGATION_KEY
                                                ? "allContent"
                                                : props.targetNavigationKey
                                        }
                                    />
                                </h2>
                            </IonText>
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol>
                            <StarRating
                                total={5}
                                current={current}
                                size="1rem"
                                padding="2.5px"
                                activeOpacity={0.7}
                                inActiveOpacity={0.3}
                            />
                        </IonCol>
                    </IonRow>
                    <IonRow style={{ paddingTop: 10 }}>
                        <IonCol>
                            <Breadcrumb
                                navigationKey={props.targetNavigationKey || ""}
                                rootText="allContent"
                            />
                        </IonCol>
                    </IonRow>

                    <IonRow style={{ paddingTop: 18 }}>
                        <IonCol>
                            <IonButton
                                color="secondary"
                                shape="round"
                                fill="solid"
                                onClick={props.selectTargetNavigationItem}
                            >
                                <Translate text="select" />
                            </IonButton>
                        </IonCol>
                    </IonRow>
                    <IonRow style={{ paddingTop: 12 }}>
                        <IonCol>
                            <IntroText>
                                <Translate text="selectSectionWithLowLevel" />
                            </IntroText>
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol>
                            <HorizontalRule
                                leftMargin={20}
                                rightMargin={36}
                                paddingBottom={0}
                                paddingTop={15}
                            />
                        </IonCol>
                    </IonRow>
                </IonGrid>
            </IonListHeader>
        </>
    );
};

const IntroText = styled.div`
    text-align: center;
    font-size: var(--ion-font-size-sm);
    font-weight: 100;
`;

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    return {
        targetNavigationKey: targetNavigationKeySelector(state),
        correctlyAnsweredQuestionsTotals: correctlyAnsweredQuestionsTotalsSelector(state),
    };
};

const Header = connect(mapStateToProps)(HeaderComponent);

export { Header };
