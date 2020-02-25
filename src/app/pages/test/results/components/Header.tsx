import React from "react";
import { connect } from "react-redux";
import { Translate } from "react-translated";
import styled from "styled-components";

import { Breadcrumb, HorizontalRule } from "@/app/components";
import { RootState } from "@/state";
import {
    experienceGainedSelector,
    targetNavigationKeySelector,
    totalCorrectAnswersSelector,
    totalQuestionsSelector,
} from "@/state/dojo/test";
import { ROOT_NAVIGATION_KEY } from "@/state/navigation";
import { IonCol, IonGrid, IonListHeader, IonRow, IonText } from "@ionic/react";

type Props = PropsFromState;

const HeaderComponent: React.FC<Props> = props => {
    return (
        <React.Fragment>
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
                            <Breadcrumb navigationKey={props.targetNavigationKey} />
                        </IonCol>
                    </IonRow>
                </IonGrid>
            </IonListHeader>
            <HorizontalRule leftMargin={20} rightMargin={36} paddingBottom={0} paddingTop={20} />
            <Result>
                <Translate text="result" />: {props.totalCorrectAnswers} / {props.totalQuestions}
            </Result>
            <ExperienceGained>
                <Translate
                    text="numberExperienceGained"
                    data={{ number: props.experienceGained.toString() }}
                />
            </ExperienceGained>
            <HorizontalRule leftMargin={20} rightMargin={36} paddingBottom={0} paddingTop={20} />
        </React.Fragment>
    );
};

const Result = styled.div`
    padding-top: 17px;
    font-size: var(--ion-font-size-l);
    text-align: center;
`;

const ExperienceGained = styled.div`
    padding-top: 17px;
    font-size: var(--ion-font-size-sm);
    text-align: center;
`;

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    return {
        targetNavigationKey: targetNavigationKeySelector(state),
        totalQuestions: totalQuestionsSelector(state),
        totalCorrectAnswers: totalCorrectAnswersSelector(state),
        experienceGained: experienceGainedSelector(state),
    };
};

const Header = connect(mapStateToProps)(HeaderComponent);

export { Header };
