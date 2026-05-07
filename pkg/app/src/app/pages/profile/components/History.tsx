import { IonAlert, IonIcon } from "@ionic/react";
import { lockClosed, trashBinOutline } from "ionicons/icons";
import React, { useState } from "react";
import { connect } from "react-redux";
import { Translate, Translator } from "react-translated";
import { bindActionCreators, type Dispatch } from "redux";
import { useAnalytics } from "@/app/hooks/useAnalytics";
import type { RootState } from "@/state";
import {
  clearQuesionSuccesfullyAnsweredDates as clearArenaQuesionSuccesfullyAnsweredDates,
  clearPassedTests,
} from "@/state/arena/log";
import { clearQuesionSuccesfullyAnsweredDates as clearDojoQuesionSuccesfullyAnsweredDates } from "@/state/dojo/log";
import { ownedSelector } from "@/state/purchase";
import { clearSeenContent } from "@/state/study/log";
import { GroupCard, Row, Section, SectionTitle } from "./";

type Props = PropsFromState & PropsFromDispatch;

const HistoryComponent: React.FC<Props> = (props) => {
  const { logEvent } = useAnalytics();

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
                  name={translate({ text: "clearDojoHistory" })}
                  value={<IonIcon icon={trashBinOutline} />}
                  action
                  onClick={() => (checkFullAccess() ? setShowClearDojoHistory(true) : undefined)}
                />
                <Row
                  name={translate({ text: "clearArenaHistory" })}
                  value={<IonIcon icon={trashBinOutline} />}
                  action
                  onClick={() => (checkFullAccess() ? setShowClearArenaHistory(true) : undefined)}
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
                    logEvent("CLEAR_HISTORY", { type: "dojo" });
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
                    logEvent("CLEAR_HISTORY", { type: "arena" });
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
        clearArenaQuesionSuccesfullyAnsweredDates,
        clearDojoQuesionSuccesfullyAnsweredDates,
        clearSeenContent,
      },
      dispatch,
    ),
  };
};

const History = connect(mapStateToProps, mapDispatchToProps)(HistoryComponent);

export { History };
