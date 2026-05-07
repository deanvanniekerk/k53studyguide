import { IonAlert, IonButton, IonGrid, IonIcon, IonSelect, IonSelectOption, IonText } from "@ionic/react";
import { caretForward, chevronForwardOutline } from "ionicons/icons";
import type React from "react";
import { useState } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { Translate, Translator } from "react-translated";
import { bindActionCreators, type Dispatch } from "redux";
import styled from "styled-components";
import { Breadcrumb, PrimaryButton } from "@/app/components";
import type { RootState } from "@/state";
import { recieveTargetNavigationKey, targetNavigationKeySelector } from "@/state/dojo/navigation";
import {
  maxQuestionsSelector,
  questionAnswersSelector,
  recieveMaxQuestions,
  recieveQuestionAnswers,
  testInProgressSelector,
} from "@/state/dojo/test";
import { ROOT_NAVIGATION_KEY } from "@/state/navigation";
import { navigationKeyToBreadcrumb } from "@/utils";

type Props = {
  onStartTestClicked: () => void;
} & PropsFromState &
  PropsFromDispatch;

const SettingsComponent: React.FC<Props> = (props) => {
  const history = useHistory();
  const [showResetTestAlert, setShowResetTestAlert] = useState(false);
  const answeredQuestions = props.questionAnswers.filter((questionAnswer) => questionAnswer.answer).length;
  const breadcrumbKeys = navigationKeyToBreadcrumb(props.targetNavigationKey);
  const selectedSectionKey = breadcrumbKeys[breadcrumbKeys.length - 1] || ROOT_NAVIGATION_KEY;
  const parentBreadcrumbKeys = breadcrumbKeys.slice(0, -1);

  const onChangeTargetNavigationItem = () => {
    history.push(`/navigator-dojo`);
  };

  const resetTest = () => {
    props.recieveQuestionAnswers([]);
    props.recieveTargetNavigationKey(ROOT_NAVIGATION_KEY);
    setShowResetTestAlert(false);
  };

  return (
    <>
      <Grid>
        <SettingTitle>
          <Translate text="testSettings" />
        </SettingTitle>
        {props.testInProgress ? (
          <InProgressCard>
            <InProgressTop>
              <InProgressEyebrow>
                <Translate text="currentQuiz" />
              </InProgressEyebrow>
              <ProgressDots>
                {props.questionAnswers.map((questionAnswer, index) => (
                  <ProgressDot key={questionAnswer.question.id || index} $answered={Boolean(questionAnswer.answer)} />
                ))}
              </ProgressDots>
            </InProgressTop>
            <InProgressSection>
              <Translate
                text={props.targetNavigationKey === ROOT_NAVIGATION_KEY ? "allContent" : props.targetNavigationKey}
              />
            </InProgressSection>
            <InProgressBreadcrumb>
              <Breadcrumb navigationKey={props.targetNavigationKey} rootText="allContent" showLast={true} />
            </InProgressBreadcrumb>
            <InProgressMeta>
              {answeredQuestions} of {props.questionAnswers.length} <Translate text="answered" />
            </InProgressMeta>
          </InProgressCard>
        ) : (
          <SettingsCard>
            <SettingRow onClick={onChangeTargetNavigationItem}>
              <SettingCopy>
                <SettingName>
                  <Translate text="quizSection" />
                </SettingName>
                {parentBreadcrumbKeys.length > 0 && (
                  <SettingPath>
                    {parentBreadcrumbKeys.map((key) => (
                      <PathSegment key={key}>
                        <Translate text={key === ROOT_NAVIGATION_KEY ? "allContent" : key} />
                      </PathSegment>
                    ))}
                  </SettingPath>
                )}
                <SettingValue>
                  <Translate text={selectedSectionKey === ROOT_NAVIGATION_KEY ? "allContent" : selectedSectionKey} />
                </SettingValue>
              </SettingCopy>
              <Chevron icon={chevronForwardOutline} />
            </SettingRow>
            <Divider />
            <SettingRow>
              <SettingCopy>
                <SettingName>
                  <Translate text="maxQuestions" />
                </SettingName>
                <SettingValue>
                  <Translator>
                    {({ translate }) => (
                      <Select
                        value={props.maxQuestions}
                        onIonChange={(event) => props.recieveMaxQuestions(event.detail.value)}
                        interface="action-sheet"
                        cancelText={translate({ text: "cancel" })}
                      >
                        <IonSelectOption value={5}>5</IonSelectOption>
                        <IonSelectOption value={10}>10</IonSelectOption>
                        <IonSelectOption value={15}>15</IonSelectOption>
                      </Select>
                    )}
                  </Translator>
                </SettingValue>
              </SettingCopy>
              <Chevron icon={chevronForwardOutline} />
            </SettingRow>
          </SettingsCard>
        )}
        <StartButtonWrapper>
          <PrimaryButton
            section="dojo"
            text={props.testInProgress ? "continueQuiz" : "startTest"}
            rightIcon={caretForward}
            onClick={() => props.onStartTestClicked()}
          />
          {props.testInProgress && (
            <ResetButton fill="clear" onClick={() => setShowResetTestAlert(true)}>
              <Translate text="resetCurrentQuiz" />
            </ResetButton>
          )}
        </StartButtonWrapper>
      </Grid>

      <Translator>
        {({ translate }) => (
          <IonAlert
            isOpen={showResetTestAlert}
            onDidDismiss={() => setShowResetTestAlert(false)}
            message={translate({ text: "resetCurrentQuizConfirm" })}
            buttons={[
              translate({ text: "cancel" }),
              {
                text: translate({ text: "resetCurrentQuiz" }),
                handler: resetTest,
              },
            ]}
          />
        )}
      </Translator>
    </>
  );
};

const Grid = styled(IonGrid)`
  padding: 0 var(--app-padding);
  margin-top: 34px;
`;

const SettingTitle = styled(IonText)`
  display: block;
  margin-bottom: 14px;
  color: var(--app-text-muted);
  font-family: var(--ion-font-family-bold);
  font-size: var(--app-font-size-l);
  font-weight: 900;
  letter-spacing: 1px;
  text-transform: uppercase;
`;

const SettingsCard = styled.div`
  overflow: hidden;
  border: var(--app-card-border);
  border-radius: 24px;
  background: var(--app-card-background);
  box-shadow: var(--app-card-shadow);
`;

const InProgressCard = styled.div`
  --breadcrumb-color: var(--app-text-muted);

  overflow: hidden;
  padding: 22px 26px 24px;
  border: var(--app-card-border);
  border-radius: 24px;
  background: var(--app-card-background);
  box-shadow: var(--app-card-shadow), 0 18px 38px rgba(var(--app-progress-foreground-rgb), 0.08);
`;

const InProgressTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
`;

const InProgressEyebrow = styled.div`
  color: var(--app-text-muted);
  font-family: var(--ion-font-family-bold);
  font-size: var(--app-font-size-md);
  font-weight: 900;
  letter-spacing: 0.8px;
  text-transform: uppercase;
`;

const ProgressDots = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 8px;
`;

const ProgressDot = styled.div<{ $answered: boolean }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${(props) => (props.$answered ? "var(--app-progress-foreground)" : "var(--app-card-border-color)")};
`;

const InProgressSection = styled.div`
  margin-top: 12px;
  color: var(--app-text-primary);
  font-family: var(--ion-font-family-bold);
  font-size: var(--app-font-size-xl);
  font-weight: 900;
  line-height: 1.2;
`;

const InProgressBreadcrumb = styled.div`
  margin-top: 8px;
  color: var(--app-text-muted);
  font-family: var(--ion-font-family-bold);
  font-weight: 800;
  line-height: 1.35;
`;

const InProgressMeta = styled.div`
  display: inline-flex;
  align-items: center;
  margin-top: 18px;
  padding: 8px 12px;
  border-radius: 999px;
  background: rgba(var(--app-progress-foreground-rgb), 0.08);
  color: var(--app-progress-foreground);
  font-family: var(--ion-font-family-bold);
  font-size: var(--app-font-size-sm);
  font-weight: 900;
  gap: 4px;
`;

const SettingRow = styled.button`
  width: 100%;
  min-height: 104px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  padding: 18px 26px;
  border: 0;
  background: transparent;
  text-align: left;
  opacity: 1;
`;

const SettingCopy = styled.div`
  min-width: 0;
  flex: 1;
`;

const SettingName = styled.div`
  color: var(--app-text-muted);
  text-transform: uppercase;
  font-size: var(--app-font-size-md);
  font-family: var(--ion-font-family-bold);
  font-weight: 900;
  letter-spacing: 0.8px;
`;

const SettingPath = styled.div`
  display: block;
  margin-top: 8px;
  max-width: 100%;
  overflow: hidden;
  color: rgba(var(--app-text-muted-rgb), 0.74);
  font-family: var(--ion-font-family-bold);
  font-size: var(--app-font-size-sm);
  font-weight: 800;
  line-height: 1.25;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const PathSegment = styled.span`
  &::after {
    content: " / ";
  }

  &:last-child::after {
    content: "";
  }
`;

const SettingValue = styled.div`
  --breadcrumb-color: currentColor;

  margin-top: 6px;
  color: var(--app-text-primary);
  font-family: var(--ion-font-family-bold);
  font-size: var(--app-font-size-xl);
  font-weight: 900;
  line-height: 1.25;
`;

const Divider = styled.div`
  height: 1px;
  background: var(--app-divider-color);
`;

const Chevron = styled(IonIcon)`
  flex: 0 0 auto;
  color: var(--app-decorative-icon-color);
  font-size: var(--app-font-size-xl);
`;

const Select = styled(IonSelect)`
  --padding-bottom: 0;
  --padding-end: 0;
  --padding-start: 0;
  --padding-top: 0;
  min-height: 1.5rem;
  color: inherit;
  opacity: 0.9 !important;
  font-family: var(--ion-font-family-bold);
  font-weight: 900;
  font-size: var(--app-font-size-xl);
  line-height: 1.5rem;

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

const StartButtonWrapper = styled.div`
  padding-top: 30px;
`;

const ResetButton = styled(IonButton)`
  width: 100%;
  min-height: 42px;
  margin: 10px 0 0;
  color: var(--app-text-muted);
  font-family: var(--ion-font-family-bold);
  font-size: var(--app-font-size-md);
  font-weight: 900;
`;

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
  return {
    targetNavigationKey: targetNavigationKeySelector(state),
    maxQuestions: maxQuestionsSelector(state),
    questionAnswers: questionAnswersSelector(state),
    testInProgress: testInProgressSelector(state),
  };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    ...bindActionCreators({ recieveMaxQuestions, recieveQuestionAnswers, recieveTargetNavigationKey }, dispatch),
  };
};

const Settings = connect(mapStateToProps, mapDispatchToProps)(SettingsComponent);

export { Settings };
