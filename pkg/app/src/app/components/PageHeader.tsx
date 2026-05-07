import { IonIcon } from "@ionic/react";
import { arrowBackOutline } from "ionicons/icons";
import type React from "react";
import { Translate } from "react-translated";
import styled from "styled-components";

export type PageSection = "study" | "quiz" | "test" | "profile";

type Props = {
  title: string;
  subTitle?: string;
  page: PageSection;
  compact?: boolean;
  onBackClick?: () => void;
  rightSection?: React.ReactNode;
};

const gradients: Record<PageSection, string> = {
  study: "var(--app-study-header-gradient)",
  quiz: "var(--app-quiz-header-gradient)",
  test: "var(--app-test-header-gradient)",
  profile: "var(--app-profile-header-gradient)",
};

const PageHeader: React.FC<Props> = ({ title, subTitle, page, compact = false, onBackClick, rightSection }) => {
  return (
    <Shell $gradient={gradients[page]} $compact={compact}>
      <Bar $hasSubtitle={Boolean(subTitle)} $compact={compact}>
        <Col1>
          {onBackClick && (
            <BackBtn type="button" aria-label="Go back" onClick={onBackClick}>
              <IonIcon icon={arrowBackOutline} />
            </BackBtn>
          )}
        </Col1>
        <Col2>
          <Title>
            <Translate text={title} />
          </Title>
          {subTitle && (
            <SubTitle>
              <Translate text={subTitle} />
            </SubTitle>
          )}
        </Col2>
        <Col3>{rightSection}</Col3>
      </Bar>
    </Shell>
  );
};

const Shell = styled.div<{ $gradient: string; $compact: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
  pointer-events: none;
  background: ${(p) => p.$gradient};
  padding-top: var(--app-page-header-padding-top);
  height: ${(p) => (p.$compact ? "var(--app-page-header-collapsed-height)" : "var(--app-page-header-height)")};
  box-sizing: border-box;
  transition: height 180ms ease;
`;

const Bar = styled.div<{ $hasSubtitle: boolean; $compact: boolean }>`
  display: grid;
  grid-template-columns: 44px minmax(0, 1fr) 44px;
  align-items: center;
  height: ${(p) =>
    p.$compact ? "var(--app-page-header-collapsed-visual-height)" : "var(--app-page-header-visual-height)"};
  padding: 0 8px;
  font-family: var(--ion-font-family-bold);
  font-size: var(--app-font-size-l);
  font-weight: bolder;
  color: var(--ion-color-light);
  text-transform: uppercase;
  letter-spacing: 0;
  text-align: center;
  transition: height 180ms ease;
`;

const Col1 = styled.div`
  pointer-events: auto;
  text-align: left;
`;

const Col2 = styled.div`
  min-width: 0;
  line-height: 1;
`;

const Title = styled.div`
  line-height: 1;
`;

const SubTitle = styled.div`
  margin: 10px -44px 0;
  font-family: var(--ion-font-family);
  font-size: var(--app-font-size-xs);
  font-weight: 600;
  line-height: 1.25;
  text-transform: none;
  white-space: normal;
`;

const Col3 = styled.div`
  pointer-events: auto;
  display: flex;
  justify-content: flex-end;
`;

const BackBtn = styled.button`
  width: 44px;
  height: 44px;
  display: grid;
  place-items: center;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--ion-color-light);
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;

  ion-icon {
    font-size: var(--app-font-size-xxl);
    opacity: 0.8;
  }
`;

export { PageHeader };
