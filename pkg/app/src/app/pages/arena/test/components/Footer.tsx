import { IonAlert, IonButton, IonIcon, IonToast } from "@ionic/react";
import { arrowBackOutline, arrowForwardOutline, checkmarkCircleOutline } from "ionicons/icons";
import type React from "react";
import { useState } from "react";
import { connect } from "react-redux";
import { Translate, Translator } from "react-translated";
import styled from "styled-components";
import { PrimaryButton } from "@/app/components";
import type { RootState } from "@/state";
import { allQuestionsAnsweredSelector } from "@/state/arena/test";

type Props = {
  canGoBack: boolean;
  hasAnswer: boolean;
  isLastQuestion: boolean;
  onBackClicked: () => void;
  onEndTestClicked: () => void;
  onNextClicked: () => void;
  onSubmitClicked: () => void;
} & PropsFromState;

const FooterComponent: React.FC<Props> = (props) => {
  const [showNotComplete, setShowNotComplete] = useState(false);
  const [showEndTestAlert, setShowEndTestAlert] = useState(false);

  const onPrimaryClicked = () => {
    if (!props.hasAnswer) {
      setShowNotComplete(true);
      return;
    }

    if (!props.isLastQuestion) {
      props.onNextClicked();
      return;
    }

    if (!props.allQuestionsAnswered) {
      setShowNotComplete(true);
      return;
    }

    props.onSubmitClicked();
  };

  return (
    <Wrapper>
      <NavActions>
        <BackButton
          shape="round"
          fill="outline"
          className="button-med-large"
          disabled={!props.canGoBack}
          onClick={props.onBackClicked}
        >
          <IonIcon slot="start" icon={arrowBackOutline} />
          <Translate text="back" />
        </BackButton>
        <PrimaryButton
          section="arena"
          text={props.isLastQuestion ? "submit" : "continue"}
          rightIcon={props.isLastQuestion ? checkmarkCircleOutline : arrowForwardOutline}
          onClick={onPrimaryClicked}
        />
      </NavActions>
      <EndTestButton fill="clear" onClick={() => setShowEndTestAlert(true)}>
        <Translate text="endCurrentTest" />
      </EndTestButton>

      <Translator>
        {({ translate }) => (
          <>
            <IonToast
              isOpen={showNotComplete}
              message={translate({ text: "pleaseAnswerAllQuestions" })}
              onDidDismiss={() => setShowNotComplete(false)}
              duration={3000}
              position="top"
              color="light"
            />
            <IonAlert
              isOpen={showEndTestAlert}
              onDidDismiss={() => setShowEndTestAlert(false)}
              message={translate({ text: "endCurrentTestConfirm" })}
              buttons={[
                translate({ text: "cancel" }),
                {
                  text: translate({ text: "endCurrentTest" }),
                  handler: () => {
                    props.onEndTestClicked();
                    setShowEndTestAlert(false);
                  },
                },
              ]}
            />
          </>
        )}
      </Translator>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  padding: 0 var(--app-padding) 35px;
`;

const NavActions = styled.div`
  display: grid;
  grid-template-columns: minmax(96px, 0.48fr) minmax(0, 1fr);
  gap: 12px;
`;

const BackButton = styled(IonButton)`
  height: 56px;
  margin: 0;
  font-size: var(--app-font-size-md);
  font-weight: 900;
  --border-color: var(--app-card-border-color);
  --color: var(--app-text-muted);
  --border-radius: 20px;
  --box-shadow: none;
`;

const EndTestButton = styled(IonButton)`
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
    allQuestionsAnswered: allQuestionsAnsweredSelector(state),
  };
};

const Footer = connect(mapStateToProps)(FooterComponent);

export { Footer };
