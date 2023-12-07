import { NavigationItem as NavItem, StarRating } from '@/app/components';
import { RootState } from '@/state';
import { correctlyAnsweredQuestionsTotalsSelector } from '@/state/dojo/navigation';
import React from 'react';
import { connect } from 'react-redux';

type Props = {
  navigationItemKey: string;
  onClick: (navigationItemKey: string) => void;
  index: number;
} & PropsFromState;

const NavigationItemComponent: React.FC<Props> = (props) => {
  const total = props.correctlyAnsweredQuestionsTotals[props.navigationItemKey];
  const current = total ? total.level : 0;

  const indicator = (
    <StarRating total={5} current={current} size="0.7rem" padding="1px" activeOpacity={0.5} inActiveOpacity={0.2} />
  );

  return (
    <NavItem
      index={props.index}
      navigationItemKey={props.navigationItemKey}
      onClick={() => props.onClick(props.navigationItemKey)}
      indicator={indicator}
      disableAnimation={true}
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
