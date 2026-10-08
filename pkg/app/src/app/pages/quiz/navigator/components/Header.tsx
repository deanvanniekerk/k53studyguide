import { Translate } from "@k53studyguide/shared/translation";
import { checkmarkCircleOutline } from "ionicons/icons";
import type React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { Breadcrumb, PrimaryButton } from "@/app/components";
import type { RootState } from "@/state";
import { ROOT_NAVIGATION_KEY } from "@/state/navigation";
import { targetNavigationKeySelector } from "@/state/quiz/navigation";

type Props = {
  selectTargetNavigationItem: () => void;
} & PropsFromState;

const HeaderComponent: React.FC<Props> = (props) => {
  return (
    <HeaderShell>
      <Title>
        <Translate
          text={props.targetNavigationKey === ROOT_NAVIGATION_KEY ? "allContent" : props.targetNavigationKey}
        />
      </Title>
      {props.targetNavigationKey !== ROOT_NAVIGATION_KEY && (
        <BreadcrumbWrap>
          <Breadcrumb navigationKey={props.targetNavigationKey || ""} rootText="allContent" />
        </BreadcrumbWrap>
      )}
      <SummaryCard>
        <SummaryTop>
          <SummaryLabel>
            <Translate text="quizQuestionPool" />
          </SummaryLabel>
        </SummaryTop>
        <IntroText>
          <Translate text="quizSectionIncludes" />
        </IntroText>
      </SummaryCard>
      <ButtonWrap>
        <PrimaryButton
          data-scroll-action
          section="quiz"
          text="useThisSection"
          rightIcon={checkmarkCircleOutline}
          onClick={props.selectTargetNavigationItem}
        />
      </ButtonWrap>
    </HeaderShell>
  );
};

const HeaderShell = styled.header`
  padding: var(--app-page-content-top) var(--app-padding) var(--app-section-gap);
`;

const Title = styled.h1`
  color: var(--app-text-primary);
  font-family: var(--ion-font-family-bold);
  font-size: var(--app-font-size-page-title);
  font-weight: 900;
  line-height: 1.05;
  margin: 0 0 var(--app-element-gap);
  overflow-wrap: anywhere;
`;

const BreadcrumbWrap = styled.div`
  --breadcrumb-color: var(--app-text-muted);

  color: var(--app-text-muted);
  font-family: var(--ion-font-family-bold);
  font-weight: 800;
  line-height: 1.35;
`;

const SummaryCard = styled.div`
  display: grid;
  gap: var(--app-element-gap);
  margin-top: var(--app-stack-gap);
  padding: var(--app-card-padding);
  border: 2px solid var(--app-card-border-color);
  border-radius: 24px;
  background: var(--app-card-background);
  box-shadow: 0 5px 0 var(--app-card-border-color);
`;

const SummaryTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
`;

const SummaryLabel = styled.div`
  color: var(--app-text-primary);
  font-family: var(--ion-font-family-bold);
  font-size: var(--app-font-size-md);
  font-weight: 900;
  letter-spacing: 0.5px;
  text-transform: uppercase;
`;

const IntroText = styled.div`
  color: var(--app-text-muted);
  font-size: var(--app-font-size-sm);
  font-weight: 800;
  line-height: 1.35;
`;

const ButtonWrap = styled.div`
  margin: var(--app-stack-gap) 0 0;
`;

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
  return {
    targetNavigationKey: targetNavigationKeySelector(state),
  };
};

const Header = connect(mapStateToProps)(HeaderComponent);

export { Header };
