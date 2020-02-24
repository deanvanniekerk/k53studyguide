import React from "react";
import { connect } from "react-redux";
import { Translate } from "react-translated";
import styled from "styled-components";

import { Breadcrumb, HorizontalRule } from "@/app/components";
import { RootState } from "@/state";
import {
    targetNavigationKeySelector,
    totalCorrectAnswersSelector,
    totalQuestionsSelector,
} from "@/state/dojo/test";
import { ROOT_NAVIGATION_KEY } from "@/state/navigation";
import { IonCol, IonGrid, IonListHeader, IonRow, IonText } from "@ionic/react";

type Props = PropsFromState;

const HeaderComponent: React.FC<Props> = props => {
    return (
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
                <IonRow>
                    <IonCol>
                        <QuestionCount>
                            {props.totalCorrectAnswers} / {props.totalQuestions}
                        </QuestionCount>
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

const QuestionCount = styled.div`
    padding-top: 17px;
`;

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    return {
        targetNavigationKey: targetNavigationKeySelector(state),
        totalQuestions: totalQuestionsSelector(state),
        totalCorrectAnswers: totalCorrectAnswersSelector(state),
    };
};

const Header = connect(mapStateToProps)(HeaderComponent);

export { Header };
