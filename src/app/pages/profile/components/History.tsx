import { trashBinOutline } from "ionicons/icons";
import React, { useState } from "react";
import { connect } from "react-redux";
import { Translate } from "react-translated";
import { bindActionCreators, Dispatch } from "redux";
import styled from "styled-components";

import { HorizontalRule } from "@/app/components";
import {
    clearPassedTests,
    clearQuesionSuccesfullyAnsweredDates as clearArenaQuesionSuccesfullyAnsweredDates,
} from "@/state/arena/log";
import { clearQuesionSuccesfullyAnsweredDates as clearDojoQuesionSuccesfullyAnsweredDates } from "@/state/dojo/log";
import { clearSeenContent } from "@/state/study/log";
import { IonAlert, IonCol, IonGrid, IonIcon, IonRow, IonText } from "@ionic/react";

type Props = PropsFromDispatch;

const HistoryComponent: React.FC<Props> = props => {
    const [showClearSeenHistory, setShowClearSeenHistory] = useState(false);
    const [showClearDojoHistory, setShowClearDojoHistory] = useState(false);
    const [showClearArenaHistory, setShowClearArenaHistory] = useState(false);

    return (
        <React.Fragment>
            <Grid>
                <Row>
                    <TitleCol>
                        <Title>
                            <Translate text="history" />
                        </Title>
                    </TitleCol>
                </Row>
                <Row onClick={() => setShowClearSeenHistory(true)}>
                    <NameCol>
                        <Name>
                            <Translate text="clearSeenHistory" />
                        </Name>
                    </NameCol>
                    <ValueCol>
                        <IonIcon icon={trashBinOutline} />
                    </ValueCol>
                </Row>
                <Row onClick={() => setShowClearDojoHistory(true)}>
                    <NameCol>
                        <Name>
                            <Translate text="clearDojoHistory" />
                        </Name>
                    </NameCol>
                    <ValueCol>
                        <IonIcon icon={trashBinOutline} />
                    </ValueCol>
                </Row>
                <Row onClick={() => setShowClearArenaHistory(true)}>
                    <NameCol>
                        <Name>
                            <Translate text="clearArenaHistory" />
                        </Name>
                    </NameCol>
                    <ValueCol>
                        <IonIcon icon={trashBinOutline} />
                    </ValueCol>
                </Row>
                <Row>
                    <IonCol>{LineBreak}</IonCol>
                </Row>
            </Grid>
            <IonAlert
                isOpen={showClearSeenHistory}
                onDidDismiss={() => setShowClearSeenHistory(false)}
                message={"Are you sure you want to clear all seen content history?"}
                buttons={[
                    {
                        text: "No",
                    },
                    {
                        text: "Yes",
                        handler: () => {
                            props.clearSeenContent();
                        },
                    },
                ]}
            />
            <IonAlert
                isOpen={showClearDojoHistory}
                onDidDismiss={() => setShowClearDojoHistory(false)}
                message={"Are you sure you want to clear all Dojo test history?"}
                buttons={[
                    {
                        text: "No",
                    },
                    {
                        text: "Yes",
                        handler: () => {
                            props.clearDojoQuesionSuccesfullyAnsweredDates();
                        },
                    },
                ]}
            />
            <IonAlert
                isOpen={showClearArenaHistory}
                onDidDismiss={() => setShowClearArenaHistory(false)}
                message={"Are you sure you want to clear all Arena test history?"}
                buttons={[
                    {
                        text: "No",
                    },
                    {
                        text: "Yes",
                        handler: () => {
                            props.clearArenaQuesionSuccesfullyAnsweredDates();
                            props.clearPassedTests();
                        },
                    },
                ]}
            />
        </React.Fragment>
    );
};

const Grid = styled(IonGrid)`
    padding: 0 16px;
    margin-top: 15px;
`;

const Row = styled(IonRow)`
    padding: 7px 0;
    align-items: center;
`;

const Title = styled(IonText)`
    opacity: 0.5;
    font-family: var(--ion-font-family-bold);
    font-weight: bold;
    text-transform: uppercase;
`;

const TitleCol = styled(IonCol)`
    padding-bottom: 5px;
`;

const Name = styled(IonText)`
    font-size: var(--ion-font-size-md);
    font-family: var(--ion-font-family-bold);
    font-weight: bold;
`;

const NameCol = styled(IonCol)`
    flex: 0;
    white-space: nowrap;
    padding-right: 15px;
`;

const ValueCol = styled(IonCol)`
    text-align: right;
`;

const LineBreak = (
    <HorizontalRule leftMargin={0} rightMargin={0} paddingBottom={0} paddingTop={0} />
);

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        ...bindActionCreators(
            {
                clearPassedTests,
                clearArenaQuesionSuccesfullyAnsweredDates,
                clearDojoQuesionSuccesfullyAnsweredDates,
                clearSeenContent,
            },
            dispatch
        ),
    };
};

const History = connect(null, mapDispatchToProps)(HistoryComponent);

export { History };
