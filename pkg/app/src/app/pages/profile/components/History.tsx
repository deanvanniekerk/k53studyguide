import { IonAlert, IonIcon } from "@ionic/react";
import { lockClosed, trashBinOutline } from "ionicons/icons";
import React, { useState } from "react";
import { connect } from "react-redux";
import { Translate, Translator } from "react-translated";
import { bindActionCreators, type Dispatch } from "redux";
import { useAnalytics } from "@/app/hooks/useAnalytics";
import type { RootState } from "@/state";
import { ownedSelector } from "@/state/purchase";
import { clearQuesionSuccesfullyAnsweredDates as clearQuizQuesionSuccesfullyAnsweredDates } from "@/state/quiz/log";
import { clearSeenContent } from "@/state/study/log";
import {
  clearPassedTests,
  clearQuesionSuccesfullyAnsweredDates as clearTestQuesionSuccesfullyAnsweredDates,
} from "@/state/test/log";
import { GroupCard, Row, Section, SectionTitle } from "./";

type Props = PropsFromState & PropsFromDispatch;

const HistoryComponent: React.FC<Props> = (props) => {
  const { logEvent } = useAnalytics();

  const [showClearSeenHistory, setShowClearSeenHistory] = useState(false);
  const [showClearQuizHistory, setShowClearQuizHistory] = useState(false);
  const [showClearTestHistory, setShowClearTestHistory] = useState(false);

  const [showFullAccessAlert, setShowFullAccessAlert] = useState(false);

  const checkFullAccess = (): boolean => {
    if (props.hasFullAccess) return true;

    setShowFullAccessAlert(true);
    return false;
  };

  return (
    <React.Fragment>
      <Section>
        <SectionTitle>
          {!props.hasFullAccess && <IonIcon icon={lockClosed} />}
          <Translate text="history" />
        </SectionTitle>
        <GroupCard>
          <Translator>
            {({ translate }) => (
              <React.Fragment>
                <Row
                  name={translate({ text: "clearSeenHistory" })}
                  value={<IonIcon icon={trashBinOutline} />}
                  action
                  onClick={() => (checkFullAccess() ? setShowClearSeenHistory(true) : undefined)}
                />
                <Row
                  name={translate({ text: "clearQuizHistory" })}
                  value={<IonIcon icon={trashBinOutline} />}
                  action
                  onClick={() => (checkFullAccess() ? setShowClearQuizHistory(true) : undefined)}
                />
                <Row
                  name={translate({ text: "clearTestHistory" })}
                  value={<IonIcon icon={trashBinOutline} />}
                  action
                  onClick={() => (checkFullAccess() ? setShowClearTestHistory(true) : undefined)}
                />
              </React.Fragment>
            )}
          </Translator>
        </GroupCard>
      </Section>
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
                    logEvent("CLEAR_HISTORY", { type: "seen" });
                    props.clearSeenContent();
                  },
                },
              ]}
            />
            <IonAlert
              isOpen={showClearQuizHistory}
              onDidDismiss={() => setShowClearQuizHistory(false)}
              message={translate({ text: "historyCleanQuizConfirm" })}
              buttons={[
                {
                  text: translate({ text: "no" }),
                },
                {
                  text: translate({ text: "yes" }),
                  handler: () => {
                    logEvent("CLEAR_HISTORY", { type: "quiz" });
                    props.clearQuizQuesionSuccesfullyAnsweredDates();
                  },
                },
              ]}
            />
            <IonAlert
              isOpen={showClearTestHistory}
              onDidDismiss={() => setShowClearTestHistory(false)}
              message={translate({ text: "historyCleanTestConfirm" })}
              buttons={[
                {
                  text: translate({ text: "no" }),
                },
                {
                  text: translate({ text: "yes" }),
                  handler: () => {
                    logEvent("CLEAR_HISTORY", { type: "test" });
                    props.clearTestQuesionSuccesfullyAnsweredDates();
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

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
  return {
    hasFullAccess: ownedSelector(state),
  };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    ...bindActionCreators(
      {
        clearPassedTests,
        clearTestQuesionSuccesfullyAnsweredDates,
        clearQuizQuesionSuccesfullyAnsweredDates,
        clearSeenContent,
      },
      dispatch,
    ),
  };
};

const History = connect(mapStateToProps, mapDispatchToProps)(HistoryComponent);

export { History };
