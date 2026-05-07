import { IonIcon } from "@ionic/react";
import { checkmarkCircle, checkmarkCircleOutline, closeCircle, radioButtonOff, radioButtonOn } from "ionicons/icons";
import type React from "react";
import { Translate } from "react-translated";
import styled from "styled-components";
import { QuestionText } from "@/app/components/questions";
import type { QuestionItem, QuestionOption } from "@/data";

type Props = {
  question: QuestionItem;
  answer: string | null;
  showResult?: boolean;
  onOptionClicked?: (questionId: string, option: QuestionOption) => void;
};

type OptionState = "idle" | "selected" | "correct" | "incorrect" | "correctMissed";

const QuizQuestionCard: React.FC<Props> = ({ question, answer, showResult, onOptionClicked }) => {
  const getIcon = (option: QuestionOption): string => {
    if (!showResult) return option.id === answer ? radioButtonOn : radioButtonOff;
    if (option.id === answer && answer === question.answer) return checkmarkCircle;
    if (option.id === answer && answer !== question.answer) return closeCircle;
    if (option.id === question.answer) return checkmarkCircleOutline;
    return radioButtonOff;
  };

  const getState = (option: QuestionOption): OptionState => {
    if (!showResult) return option.id === answer ? "selected" : "idle";
    if (option.id === answer && answer === question.answer) return "correct";
    if (option.id === answer && answer !== question.answer) return "incorrect";
    if (option.id === question.answer) return "correctMissed";
    return "idle";
  };

  return (
    <Card>
      <QuestionCopy>
        <QuestionText question={question} />
      </QuestionCopy>
      {(question.image || question.image2) && (
        <ImageFrame>
          {question.image && <QuestionImage alt="" src={`assets/images/${question.image}`} />}
          {question.image2 && <QuestionImage alt="" src={`assets/images/${question.image2}`} />}
        </ImageFrame>
      )}
      <Options>
        {question.option.map((option) => (
          <OptionButton
            key={option.id}
            state={getState(option)}
            type="button"
            onClick={() => {
              if (onOptionClicked) onOptionClicked(question.id, option);
            }}
          >
            <OptionIcon icon={getIcon(option)} state={getState(option)} />
            <OptionText>
              <Translate text={option.value} />
            </OptionText>
          </OptionButton>
        ))}
      </Options>
    </Card>
  );
};

const Card = styled.div`
  margin: 0 var(--app-padding) 26px;
  padding: 22px 22px 24px;
  border: var(--app-card-border);
  border-radius: 24px;
  background: var(--app-card-background);
  box-shadow: var(--app-card-shadow);
`;

const QuestionCopy = styled.div`
  color: var(--app-text-primary);
  font-family: var(--ion-font-family-bold);
  font-size: var(--app-font-size-l);
  font-weight: 600;
  line-height: 1.32;

  ul {
    margin-block-start: 0;
    margin-block-end: 0;
    padding-inline-start: 20px;
  }

  li {
    padding: 3px 0;
  }
`;

const ImageFrame = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 14px;
  min-height: 160px;
  margin-top: 22px;
  padding: 12px;
  border: 2px dashed var(--app-card-border-color);
  border-radius: 20px;
  background: var(--app-card-background);
`;

const QuestionImage = styled.img`
  max-width: 100%;
  max-height: 250px;
  object-fit: contain;
`;

const Options = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding-top: 24px;
`;

const OptionButton = styled.button<{ state: OptionState }>`
  display: flex;
  align-items: center;
  width: 100%;
  min-height: 76px;
  padding: 14px 22px;
  border: 2px solid ${(props) => optionBorder(props.state)};
  border-radius: 20px;
  background: ${(props) => optionBackground(props.state)};
  color: var(--app-text-primary);
  font-family: var(--ion-font-family);
  font-size: var(--app-font-size-l);
  font-weight: 500;
  line-height: 1.35;
  text-align: left;
`;

const OptionIcon = styled(IonIcon)<{ state: OptionState }>`
  flex: 0 0 auto;
  margin-right: 18px;
  color: ${(props) => optionIconColor(props.state)};
  font-size: 2.1rem;
`;

const OptionText = styled.div`
  min-width: 0;
`;

const optionBorder = (state: OptionState): string => {
  if (state === "selected") return "var(--app-question-accent)";
  if (state === "correct" || state === "correctMissed") return "var(--ion-color-primary)";
  if (state === "incorrect") return "var(--ion-color-danger)";
  return "var(--app-card-border-color)";
};

const optionBackground = (state: OptionState): string => {
  if (state === "selected") return "var(--app-question-selected-background)";
  if (state === "correct" || state === "correctMissed") return "rgba(var(--ion-color-primary-rgb), 0.08)";
  if (state === "incorrect") return "rgba(var(--ion-color-danger-rgb), 0.08)";
  return "var(--app-card-background)";
};

const optionIconColor = (state: OptionState): string => {
  if (state === "selected") return "var(--app-question-accent)";
  if (state === "incorrect") return "var(--ion-color-danger)";
  if (state === "correct" || state === "correctMissed") return "var(--ion-color-primary)";
  return "var(--app-decorative-icon-color)";
};

export { QuizQuestionCard };
