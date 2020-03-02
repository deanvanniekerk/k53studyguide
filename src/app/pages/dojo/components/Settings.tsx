import { caretForward } from "ionicons/icons";
import React from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { Translate } from "react-translated";
import { bindActionCreators, Dispatch } from "redux";
import styled from "styled-components";

import { Breadcrumb, HorizontalRule } from "@/app/components";
import { RootState } from "@/state";
import { targetNavigationKeySelector } from "@/state/dojo/navigation";
import {
    maxQuestionsSelector,
    recieveMaxQuestions,
    testInProgressSelector,
} from "@/state/dojo/test";
import {
    IonButton,
    IonCol,
    IonGrid,
    IonIcon,
    IonRow,
    IonSelect,
    IonSelectOption,
    IonText,
} from "@ionic/react";

type Props = {
    onStartTestClicked: () => void;
} & PropsFromState &
    PropsFromDispatch;

const SettingsComponent: React.FC<Props> = props => {
    const history = useHistory();

    const onChangeTargetNavigationItem = () => {
        if (props.testInProgress) return;
        history.push(`/dojo-navigator`);
    };

    return (
        <Grid>
            <Row>
                <SettingTitleCol>
                    <SettingTitle>
                        <Translate text="testSettings" />
                    </SettingTitle>
                </SettingTitleCol>
            </Row>
            <Row>
                <SettingNameCol>
                    <SettingName>
                        <Translate text="section" />
                    </SettingName>
                </SettingNameCol>
                <SettingValueCol
                    onClick={onChangeTargetNavigationItem}
                    disabled={props.testInProgress}
                >
                    <Breadcrumb
                        navigationKey={props.targetNavigationKey}
                        disableNavigation={true}
                        rootText="allContent"
                        showLast={true}
                        opacity={0.7}
                        lastOpacity={0.9}
                    />
                </SettingValueCol>
            </Row>
            <Row>
                <IonCol>{LineBreak}</IonCol>
            </Row>
            <Row>
                <SettingNameCol>
                    <SettingName>
                        <Translate text="maxQuestions" />
                    </SettingName>
                </SettingNameCol>
                <SettingValueCol disabled={props.testInProgress}>
                    <Select
                        value={props.maxQuestions}
                        onIonChange={event => props.recieveMaxQuestions(event.detail.value)}
                        interface="action-sheet"
                        disabled={props.testInProgress}
                    >
                        <IonSelectOption value={5}>5</IonSelectOption>
                        <IonSelectOption value={10}>10</IonSelectOption>
                        <IonSelectOption value={15}>15</IonSelectOption>
                    </Select>
                </SettingValueCol>
            </Row>
            <Row>
                <IonCol>{LineBreak}</IonCol>
            </Row>
            <IonRow style={{ paddingTop: 15, paddingBottom: 20 }}>
                <IonCol style={{ textAlign: "center" }}>
                    <IonButton
                        color="secondary"
                        shape="round"
                        fill="solid"
                        className="button-med-large"
                        onClick={() => props.onStartTestClicked()}
                    >
                        <Translate text={props.testInProgress ? "continueTest" : "startTest"} />
                        <IonIcon slot="end" icon={caretForward} />
                    </IonButton>
                </IonCol>
            </IonRow>
        </Grid>
    );
};

const Grid = styled(IonGrid)`
    padding: 0 16px;
    margin-top: 30px;
`;

const Row = styled(IonRow)`
    padding: 7px 0;
    align-items: center;
`;

const SettingTitle = styled(IonText)`
    opacity: 0.5;
    font-family: var(--ion-font-family-bold);
    font-weight: bold;
`;

const SettingTitleCol = styled(IonCol)`
    padding-bottom: 5px;
`;

const SettingName = styled(IonText)`
    text-transform: uppercase;
    font-size: var(--ion-font-size-md);
    font-family: var(--ion-font-family-bold);
    font-weight: bold;
`;

const SettingNameCol = styled(IonCol)`
    flex: 0;
    white-space: nowrap;
    padding-right: 15px;
`;

interface SettingValueColProps {
    disabled: boolean;
}

const SettingValueCol = styled(IonCol)<SettingValueColProps>`
    color: ${props => (props.disabled ? "var(--ion-color-medium)" : "var(--ion-color-dark)")};
    opacity: ${props => (props.disabled ? "1" : "0.9")} !important;
    font-family: var(--ion-font-family-bold);
    font-size: var(--ion-font-size-md);
    font-weight: bold;
    text-align: end;
    line-height: 1.2rem;
`;

const Select = styled(IonSelect)`
    --padding-bottom: 0;
    --padding-top: 0;
    color: ${props => (props.disabled ? "var(--ion-color-medium)" : "var(--ion-color-dark)")};
    opacity: ${props => (props.disabled ? "1" : "0.9")} !important;
    font-family: var(--ion-font-family-bold);
    font-weight: bold;
    font-size: var(--ion-font-size-md);
`;

const LineBreak = (
    <HorizontalRule leftMargin={0} rightMargin={0} paddingBottom={0} paddingTop={0} />
);

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    return {
        targetNavigationKey: targetNavigationKeySelector(state),
        maxQuestions: maxQuestionsSelector(state),
        testInProgress: testInProgressSelector(state),
    };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        ...bindActionCreators({ recieveMaxQuestions }, dispatch),
    };
};

const Settings = connect(mapStateToProps, mapDispatchToProps)(SettingsComponent);

export { Settings };
