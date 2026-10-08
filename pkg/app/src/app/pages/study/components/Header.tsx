import { Translate } from "@k53studyguide/shared/translation";
import { caretForward } from "ionicons/icons";
import type React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { PrimaryButton } from "@/app/components";
import type { RootState } from "@/state";
import { rootNavigationChildrenSelector } from "@/state/navigation";
import { lastSeenParentContentKeySelector, seenTotalsSelector } from "@/state/study/log";

type Props = {
  onNavigationItemClicked: (navigationItemKey: string) => void;
} & PropsFromState;

const HeaderComponent: React.FC<Props> = (props) => {
  const completedSections = props.rootNavigationChildren.filter((key) => {
    const sectionTotal = props.seenTotals[key];
    return sectionTotal && sectionTotal.total > 0 && sectionTotal.seen === sectionTotal.total;
  }).length;
  const totalSections = props.rootNavigationChildren.length;

  return (
    <HeroHeader>
      <Title>
        <Translate text={props.lastSeenParentContentKey} />
      </Title>
      <SubTitle>
        <Translate text="study" /> &middot; {completedSections} of {totalSections} sections complete
      </SubTitle>
      <ButtonWrap>
        <PrimaryButton
          section="study"
          text="continue"
          rightIcon={caretForward}
          onClick={() => props.onNavigationItemClicked(props.lastSeenParentContentKey)}
        />
      </ButtonWrap>
    </HeroHeader>
  );
};

const HeroHeader = styled.div`
  display: block;
  padding: var(--app-page-content-top) var(--app-padding) var(--app-section-gap);
  background: var(--app-study-background);
`;

const Title = styled.h1`
  color: var(--app-text-primary);
  font-family: var(--ion-font-family-bold);
  font-size: var(--app-font-size-page-title);
  line-height: 1.05;
  margin: 0 0 var(--app-element-gap);
  max-width: 100%;
  overflow-wrap: anywhere;
`;

const SubTitle = styled.div`
  color: var(--app-text-muted);
  font-size: var(--app-font-size-md);
  line-height: 1.3;
`;

const ButtonWrap = styled.div`
  margin: var(--app-stack-gap) 0 0;
`;

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
  return {
    lastSeenParentContentKey: lastSeenParentContentKeySelector(state),
    rootNavigationChildren: rootNavigationChildrenSelector(state),
    seenTotals: seenTotalsSelector(state),
  };
};

const Header = connect(mapStateToProps)(HeaderComponent);

export { Header };
