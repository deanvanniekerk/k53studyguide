import { QuizNavigatorItem } from "@k53studyguide/shared/react";
import type React from "react";
import { connect } from "react-redux";
import type { RootState } from "@/state";
import { correctlyAnsweredQuestionsTotalsSelector } from "@/state/quiz/navigation";

type Props = {
  navigationItemKey: string;
  onClick: (navigationItemKey: string) => void;
  index: number;
} & PropsFromState;

const NavigationItemComponent: React.FC<Props> = (props) => {
  const total = props.correctlyAnsweredQuestionsTotals[props.navigationItemKey];

  return (
    <QuizNavigatorItem
      navigationItemKey={props.navigationItemKey}
      correct={total ? total.correctlyAnswered : 0}
      total={total ? total.total : 0}
      index={props.index}
      onClick={props.onClick}
    />
  );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
  return {
    correctlyAnsweredQuestionsTotals: correctlyAnsweredQuestionsTotalsSelector(state),
  };
};

const NavigationItem = connect(mapStateToProps)(NavigationItemComponent);

export { NavigationItem };
