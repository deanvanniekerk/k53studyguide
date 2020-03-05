import React from "react";
import { connect } from "react-redux";
//import { Translate } from "react-translated";
import styled from "styled-components";

import { HorizontalRule } from "@/app/components";
import { RootState } from "@/state";
import {
    passedSelector,
    sectionAPassedSelector,
    sectionBPassedSelector,
    sectionCPassedSelector,
    testResultsSelector,
} from "@/state/arena/test";
import { IonCol, IonGrid, IonRow } from "@ionic/react";

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
            <PrimaryResult>{passed ? "Passed" : "Failed"}</PrimaryResult>

            <IonGrid>
                <SectionResultRow>
                    <IonCol>
                        <Bold>Section A:</Bold>
                    </IonCol>
                    <IonCol>
                        {testResults.A.correct} / {testResults.A.total}
                    </IonCol>
                    <IonCol>
                        <Result passed={sectionAPassed}>
                            {sectionAPassed ? "Passed" : "Failed"}
                        </Result>
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
                        <Result passed={sectionBPassed}>
                            {sectionBPassed ? "Passed" : "Failed"}
                        </Result>
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
                        <Result passed={sectionCPassed}>
                            {sectionCPassed ? "Passed" : "Failed"}
                        </Result>
                    </IonCol>
                </SectionResultRow>
            </IonGrid>

            <HorizontalRule leftMargin={20} rightMargin={36} paddingBottom={0} paddingTop={15} />
        </Container>
    );
};

const Container = styled.div`
    padding-top: 55px;
    padding-left: 16px;
    padding-right: 16px;
`;

const PrimaryResult = styled.div`
    padding: 10px 0 20px 0;
    font-size: var(--ion-font-size-xl);
    text-align: center;
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

const Result = styled.div<{ passed: boolean }>`
    color: ${props => (props.passed ? "var(--ion-color-success)" : "var(--ion-color-danger)")};
    font-family: var(--ion-font-family-bold);
    font-weight: bold;
`;

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
