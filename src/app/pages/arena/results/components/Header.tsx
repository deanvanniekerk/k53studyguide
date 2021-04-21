import React from "react";
import { connect } from "react-redux";
import { Translate } from "react-translated";
import styled from "styled-components";

import { HorizontalRule } from "@/app/components";
import { TestFailedIcon, TestPassedIcon } from "@/app/components/icons";
import { RootState } from "@/state";
import {
    passedSelector,
    sectionAPassedSelector,
    sectionBPassedSelector,
    sectionCPassedSelector,
    testResultsSelector,
} from "@/state/arena/test";
import { CreateAnimation, IonCol, IonGrid, IonRow } from "@ionic/react";

type Props = PropsFromState;

const HeaderComponent: React.FC<Props> = ({
    testResults,
    sectionAPassed,
    sectionBPassed,
    sectionCPassed,
    passed,
}) => {
    return (
        <Container>
            <PrimaryResult>
                <NinjaIcon passed={passed} />
                <div style={{ overflow: "hidden" }}>
                    <ResultText passed={passed} />
                </div>
                <PrimaryResultSubText>
                    {passed ? (
                        <Translate text="arenaSuccessInfo" />
                    ) : (
                        <Translate text="arenaFailedInfo" />
                    )}
                </PrimaryResultSubText>
            </PrimaryResult>
            <HorizontalRule leftMargin={16} rightMargin={16} paddingBottom={20} paddingTop={20} />
            <IonGrid>
                <SectionResultRow>
                    <IonCol>
                        <Bold>Section A:</Bold>
                    </IonCol>
                    <IonCol>
                        {testResults.A.correct} / {testResults.A.total}
                    </IonCol>
                    <IonCol>
                        <SuccessIcon success={sectionAPassed} size="1.2rem" />
                    </IonCol>
                </SectionResultRow>
                <SectionResultRow>
                    <IonCol>
                        <Bold>Section B:</Bold>
                    </IonCol>
                    <IonCol>
                        {testResults.B.correct} / {testResults.B.total}
                    </IonCol>
                    <IonCol>
                        <SuccessIcon success={sectionBPassed} size="1.2rem" />
                    </IonCol>
                </SectionResultRow>
                <SectionResultRow>
                    <IonCol>
                        <Bold>Section C:</Bold>
                    </IonCol>
                    <IonCol>
                        {testResults.C.correct} / {testResults.C.total}
                    </IonCol>
                    <IonCol>
                        <SuccessIcon success={sectionCPassed} size="1.2rem" />
                    </IonCol>
                </SectionResultRow>
            </IonGrid>

            <HorizontalRule leftMargin={16} rightMargin={16} paddingBottom={0} paddingTop={15} />
        </Container>
    );
};

type NinjaIconProps = {
    passed: boolean;
};

const NinjaIcon: React.FC<NinjaIconProps> = (props) => {
    return (
        <CreateAnimation
            play={true}
            duration={700}
            easing="ease"
            delay={600}
            keyframes={[
                { offset: 0, transform: "scale(1)" },
                { offset: 0.5, transform: "scale(1.3)" },
                { offset: 1, transform: "scale(1)" },
            ]}
        >
            <div>
                <SuccessIcon success={props.passed} size="3.7rem" />
            </div>
        </CreateAnimation>
    );
};

type ResultTextProps = {
    passed: boolean;
};

const ResultText: React.FC<ResultTextProps> = (props) => {
    return (
        <CreateAnimation
            play={true}
            duration={700}
            easing="ease"
            delay={200}
            fromTo={{
                property: "transform",
                fromValue: "translateY(80px)",
                toValue: "translateY(0px)",
            }}
        >
            <PrimaryResultText>
                {props.passed ? (
                    <Translate text="arenaSuccess" />
                ) : (
                    <Translate text="arenaFailed" />
                )}
            </PrimaryResultText>
        </CreateAnimation>
    );
};

const Container = styled.div`
    padding-top: 55px;
    padding-left: 16px;
    padding-right: 16px;
`;

const PrimaryResult = styled.div`
    text-align: center;
`;

const PrimaryResultText = styled.div`
    font-size: var(--ion-font-size-xl);
    font-family: var(--ion-font-family-bold);
    font-weight: bold;
    text-transform: uppercase;
    padding: 12px 0;
`;

const PrimaryResultSubText = styled.div`
    font-size: var(--ion-font-size-md);
`;

const SectionResultRow = styled(IonRow)`
    font-size: var(--ion-font-size-md);
    padding: 5px 0;
    text-align: left;
`;

const Bold = styled.span`
    font-family: var(--ion-font-family-bold);
    font-weight: bold;
`;

type SuccessIconProps = {
    success: boolean;
    size: string;
};
const SuccessIcon: React.FC<SuccessIconProps> = (props) => {
    if (props.success) return <TestPassedIcon style={{ fontSize: props.size }} />;

    return <TestFailedIcon style={{ fontSize: props.size }} />;
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    return {
        testResults: testResultsSelector(state),
        sectionAPassed: sectionAPassedSelector(state),
        sectionBPassed: sectionBPassedSelector(state),
        sectionCPassed: sectionCPassedSelector(state),
        passed: passedSelector(state),
    };
};

const Header = connect(mapStateToProps)(HeaderComponent);

export { Header };
