import { IonToast } from "@ionic/react";
import { caretForward, checkmarkCircleOutline } from "ionicons/icons";
import type React from "react";
import { useState } from "react";
import { connect } from "react-redux";
import { Translator } from "react-translated";
import styled from "styled-components";
import { PrimaryButton } from "@/app/components";
import type { RootState } from "@/state";
import { allQuestionsAnsweredSelector } from "@/state/quiz/session";

type Props = {
  hasAnswer: boolean;
  isLastQuestion: boolean;
  onNextClicked: () => void;
  onSubmitClicked: () => void;
} & PropsFromState;

const FooterComponent: React.FC<Props> = (props) => {
  const [showNotComplete, setShowNotComplete] = useState(false);

  const onSubmitClicked = () => {
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
      <PrimaryButton
        section="quiz"
        text={props.isLastQuestion ? "submit" : "continue"}
        rightIcon={props.isLastQuestion ? checkmarkCircleOutline : caretForward}
        onClick={onSubmitClicked}
      />

      <Translator>
        {({ translate }) => (
          <IonToast
            isOpen={showNotComplete}
            message={translate({ text: "pleaseAnswerAllQuestions" })}
            onDidDismiss={() => setShowNotComplete(false)}
            duration={3000}
            position="top"
            color="light"
          />
        )}
      </Translator>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  text-align: center;
  padding: 0 var(--app-padding) 35px;
`;

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
  return {
    allQuestionsAnswered: allQuestionsAnsweredSelector(state),
  };
};

const Footer = connect(mapStateToProps)(FooterComponent);

export { Footer };
