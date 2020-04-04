import { checkmarkCircle, checkmarkCircleOutline, closeCircle } from "ionicons/icons";
import React from "react";
import { connect } from "react-redux";
import { Translate, Translator } from "react-translated";
import styled from "styled-components";

import { HorizontalRule } from "@/app/components";
import { RootState } from "@/state";
import { testsPassedSelector } from "@/state/arena/log";
import { dojoLevelSelector } from "@/state/dojo/log";
import { ROOT_NAVIGATION_KEY } from "@/state/navigation";
import { seenTotalsSelector } from "@/state/study/log";
import { IonCol, IonGrid, IonIcon, IonRow, IonText } from "@ionic/react";

import { Row } from "./";

type Props = PropsFromState;

const ChecklistComponent: React.FC<Props> = props => {
    const total = props.seenTotals[ROOT_NAVIGATION_KEY] || 0;
    const seenProgress = Math.floor((total.seen / total.total) * 100);

    return (
        <Grid>
            <FullRow>
                <TitleCol>
                    <Title>
                        <IonIcon icon={checkmarkCircleOutline} style={{ marginRight: 5 }} />
                        <Translate text="checklist" />
                    </Title>
                </TitleCol>
            </FullRow>
            <Translator>
                {({ translate }) => (
                    <React.Fragment>
                        <Row
                            name={translate({ text: "checklistReadAll" })}
                            value={`${seenProgress}%`}
                            icon={seenProgress === 100 ? checkmarkCircle : closeCircle}
                            iconColor={seenProgress === 100 ? "success" : "danger"}
                        />
                        <Row
                            name={translate({ text: "checklistReachLevel" })}
                            value={translate({
                                text: "levelNumber",
                                data: { number: props.dojoLevel },
                            })}
                            icon={props.dojoLevel === 5 ? checkmarkCircle : closeCircle}
                            iconColor={props.dojoLevel === 5 ? "success" : "danger"}
                        />
                        <Row
                            name={translate({ text: "checklistCompleteArena" })}
                            value={props.areaTestsPassed}
                            icon={props.areaTestsPassed >= 3 ? checkmarkCircle : closeCircle}
                            iconColor={props.areaTestsPassed >= 3 ? "success" : "danger"}
                        />
                        <FullRow>
                            <IonCol>{LineBreak}</IonCol>
                        </FullRow>
                    </React.Fragment>
                )}
            </Translator>
        </Grid>
    );
};

const Grid = styled(IonGrid)`
    padding: 0 16px;
    margin-top: 60px;
`;

const FullRow = styled(IonRow)`
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

const LineBreak = (
    <HorizontalRule leftMargin={0} rightMargin={0} paddingBottom={0} paddingTop={0} />
);

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    return {
        seenTotals: seenTotalsSelector(state),
        areaTestsPassed: testsPassedSelector(state),
        dojoLevel: dojoLevelSelector(state),
    };
};

const Checklist = connect(mapStateToProps)(ChecklistComponent);

export { Checklist };
