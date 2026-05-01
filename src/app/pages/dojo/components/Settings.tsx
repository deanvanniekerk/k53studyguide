import {
  IonAlert,
  IonButton,
  IonCol,
  IonGrid,
  IonIcon,
  IonRow,
  IonSelect,
  IonSelectOption,
  IonText,
} from "@ionic/react";
import { caretForward } from "ionicons/icons";
import type React from "react";
import { useState } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { Translate, Translator } from "react-translated";
import { bindActionCreators, type Dispatch } from "redux";
import styled from "styled-components";
import { Breadcrumb, HorizontalRule } from "@/app/components";
import type { RootState } from "@/state";
import { targetNavigationKeySelector } from "@/state/dojo/navigation";
import { maxQuestionsSelector, recieveMaxQuestions, testInProgressSelector } from "@/state/dojo/test";

type Props = {
  onStartTestClicked: () => void;
} & PropsFromState &
  PropsFromDispatch;

const SettingsComponent: React.FC<Props> = (props) => {
  const history = useHistory();
  const [showCompleteTestAlert, setShowCompleteTestAlert] = useState(false);

  const onChangeTargetNavigationItem = () => {
    if (!checkCanChangeTestSettings()) return;
    history.push(`/navigator-dojo`);
  };

  const checkCanChangeTestSettings = () => {
    if (props.testInProgress) {
      setShowCompleteTestAlert(true);
      return false;
    }
    return true;
  };

  return (
    <>
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
          <SettingValueCol onClick={onChangeTargetNavigationItem} disabled={props.testInProgress}>
            <Breadcrumb
              navigationKey={props.targetNavigationKey}
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
          <SettingValueCol disabled={props.testInProgress} onClick={checkCanChangeTestSettings}>
            <Translator>
              {({ translate }) => (
                <Select
                  value={props.maxQuestions}
                  onIonChange={(event) => props.recieveMaxQuestions(event.detail.value)}
                  interface="action-sheet"
                  justify="end"
                  disabled={props.testInProgress}
                  cancelText={translate({ text: "cancel" })}
                >
                  <IonSelectOption value={5}>5</IonSelectOption>
                  <IonSelectOption value={10}>10</IonSelectOption>
                  <IonSelectOption value={15}>15</IonSelectOption>
                </Select>
              )}
            </Translator>
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

      <Translator>
        {({ translate }) => (
          <IonAlert
            isOpen={showCompleteTestAlert}
            onDidDismiss={() => setShowCompleteTestAlert(false)}
            message={translate({ text: "completeTestToChangeSettings" })}
            buttons={[translate({ text: "ok" })]}
          />
        )}
      </Translator>
    </>
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
  color: ${(props) => (props.disabled ? "var(--ion-color-medium)" : "var(--ion-color-light)")};
  opacity: ${(props) => (props.disabled ? "1" : "0.9")} !important;
  font-family: var(--ion-font-family-bold);
  font-size: var(--ion-font-size-md);
  font-weight: bold;
  text-align: end;
  line-height: 1.2rem;
`;

const Select = styled(IonSelect)`
  --padding-bottom: 0;
  --padding-end: 0;
  --padding-start: 0;
  --padding-top: 0;
  min-height: 1.2rem;
  color: ${(props) => (props.disabled ? "var(--ion-color-medium)" : "var(--ion-color-light)")};
  opacity: ${(props) => (props.disabled ? "1" : "0.9")} !important;
  font-family: var(--ion-font-family-bold);
  font-weight: bold;
  font-size: var(--ion-font-size-md);
  line-height: 1.2rem;

  &::part(container) {
    flex: 0 0 auto;
    color: inherit;
  }

  &::part(icon) {
    color: currentColor;
  }

  &::part(wrapper) {
    align-items: center;
  }
`;

const LineBreak = <HorizontalRule leftMargin={0} rightMargin={0} paddingBottom={0} paddingTop={0} />;

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
