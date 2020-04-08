import { lockClosed, trashBinOutline } from "ionicons/icons";
import React, { useState } from "react";
import { connect } from "react-redux";
import { Translate, Translator } from "react-translated";
import { bindActionCreators, Dispatch } from "redux";
import styled from "styled-components";

import { HorizontalRule } from "@/app/components";
import { RootState } from "@/state";
import {
    clearPassedTests,
    clearQuesionSuccesfullyAnsweredDates as clearArenaQuesionSuccesfullyAnsweredDates,
} from "@/state/arena/log";
import { clearQuesionSuccesfullyAnsweredDates as clearDojoQuesionSuccesfullyAnsweredDates } from "@/state/dojo/log";
import { hasFullAccessSelector } from "@/state/purchase";
import { clearSeenContent } from "@/state/study/log";
import { IonAlert, IonCol, IonGrid, IonIcon, IonRow, IonText } from "@ionic/react";

type Props = PropsFromState & PropsFromDispatch;

const HistoryComponent: React.FC<Props> = (props) => {
    const [showClearSeenHistory, setShowClearSeenHistory] = useState(false);
    const [showClearDojoHistory, setShowClearDojoHistory] = useState(false);
    const [showClearArenaHistory, setShowClearArenaHistory] = useState(false);

    const [showFullAccessAlert, setShowFullAccessAlert] = useState(false);

    const checkFullAccess = (): boolean => {
        if (props.hasFullAccess) return true;

        setShowFullAccessAlert(true);
        return false;
    };

    return (
        <React.Fragment>
            <Grid>
                <Row>
                    <TitleCol>
                        <Title>
                            {!props.hasFullAccess && (
                                <IonIcon icon={lockClosed} style={{ marginRight: 5 }} />
                            )}
                            <Translate text="history" />
                        </Title>
                    </TitleCol>
                </Row>
                <Row onClick={() => (checkFullAccess() ? setShowClearSeenHistory(true) : null)}>
                    <NameCol>
                        <Name>
                            <Translate text="clearSeenHistory" />
                        </Name>
                    </NameCol>
                    <ValueCol>
                        <IonIcon icon={trashBinOutline} />
                    </ValueCol>
                </Row>
                <Row onClick={() => (checkFullAccess() ? setShowClearDojoHistory(true) : null)}>
                    <NameCol>
                        <Name>
                            <Translate text="clearDojoHistory" />
                        </Name>
                    </NameCol>
                    <ValueCol>
                        <IonIcon icon={trashBinOutline} />
                    </ValueCol>
                </Row>
                <Row onClick={() => (checkFullAccess() ? setShowClearArenaHistory(true) : null)}>
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
            <Translator>
                {({ translate }) => (
                    <React.Fragment>
                        <IonAlert
                            isOpen={showClearSeenHistory}
                            onDidDismiss={() => setShowClearSeenHistory(false)}
                            message={translate({ text: "historyCleanSeenConfirm" })}
                            buttons={[
                                {
                                    text: translate({ text: "no" }),
                                },
                                {
                                    text: translate({ text: "yes" }),
                                    handler: () => {
                                        props.clearSeenContent();
                                    },
                                },
                            ]}
                        />
                        <IonAlert
                            isOpen={showClearDojoHistory}
                            onDidDismiss={() => setShowClearDojoHistory(false)}
                            message={translate({ text: "historyCleanDojoConfirm" })}
                            buttons={[
                                {
                                    text: translate({ text: "no" }),
                                },
                                {
                                    text: translate({ text: "yes" }),
                                    handler: () => {
                                        props.clearDojoQuesionSuccesfullyAnsweredDates();
                                    },
                                },
                            ]}
                        />
                        <IonAlert
                            isOpen={showClearArenaHistory}
                            onDidDismiss={() => setShowClearArenaHistory(false)}
                            message={translate({ text: "historyCleanArenaConfirm" })}
                            buttons={[
                                {
                                    text: translate({ text: "no" }),
                                },
                                {
                                    text: translate({ text: "yes" }),
                                    handler: () => {
                                        props.clearArenaQuesionSuccesfullyAnsweredDates();
                                        props.clearPassedTests();
                                    },
                                },
                            ]}
                        />
                        <IonAlert
                            isOpen={showFullAccessAlert}
                            onDidDismiss={() => setShowFullAccessAlert(false)}
                            header={translate({ text: "premiumPackageRequired" })}
                            message={translate({ text: "historyPurchaseFullAccess" })}
                            buttons={[translate({ text: "ok" })]}
                        />
                    </React.Fragment>
                )}
            </Translator>
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

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    return {
        hasFullAccess: hasFullAccessSelector(state),
    };
};

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

const History = connect(mapStateToProps, mapDispatchToProps)(HistoryComponent);

export { History };
