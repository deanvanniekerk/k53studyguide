import { CreateAnimation, IonIcon } from "@ionic/react";
import { checkmarkCircle, closeCircle } from "ionicons/icons";
import type React from "react";
import { useEffect } from "react";
import { connect } from "react-redux";
import { Translate } from "react-translated";
import styled from "styled-components";
import { TestFailedIcon, TestPassedIcon } from "@/app/components/icons";
import { useAnalytics } from "@/app/hooks/useAnalytics";
import type { RootState } from "@/state";
import {
  passedSelector,
  sectionAPassedSelector,
  sectionBPassedSelector,
  sectionCPassedSelector,
  testResultsSelector,
} from "@/state/test/session";

type Props = PropsFromState;

const HeaderComponent: React.FC<Props> = ({ testResults, sectionAPassed, sectionBPassed, sectionCPassed, passed }) => {
  const { analytics, logEvent } = useAnalytics();
  const questionCount = testResults.A.total + testResults.B.total + testResults.C.total;
  const correctCount = testResults.A.correct + testResults.B.correct + testResults.C.correct;

  useEffect(() => {
    analytics.trackMockTestComplete({
      question_count: questionCount,
      correct_count: correctCount,
      passed,
      section_a_correct: testResults.A.correct,
      section_a_total: testResults.A.total,
      section_a_passed: sectionAPassed,
      section_b_correct: testResults.B.correct,
      section_b_total: testResults.B.total,
      section_b_passed: sectionBPassed,
      section_c_correct: testResults.C.correct,
      section_c_total: testResults.C.total,
      section_c_passed: sectionCPassed,
    });
    logEvent("TEST_RESULT", {
      question_count: questionCount,
      correct_count: correctCount,
      passed: passed ? "true" : "false",
      section_a_correct: testResults.A.correct,
      section_a_total: testResults.A.total,
      section_a_passed: sectionAPassed ? "true" : "false",
      section_b_correct: testResults.B.correct,
      section_b_total: testResults.B.total,
      section_b_passed: sectionBPassed ? "true" : "false",
      section_c_correct: testResults.C.correct,
      section_c_total: testResults.C.total,
      section_c_passed: sectionCPassed ? "true" : "false",
    });
  }, [
    analytics,
    correctCount,
    logEvent,
    passed,
    questionCount,
    sectionAPassed,
    sectionBPassed,
    sectionCPassed,
    testResults,
  ]);

  return (
    <>
      <ResultCard>
        <Glow />
        <NinjaIcon passed={passed} />
        <div style={{ overflow: "hidden" }}>
          <ResultText passed={passed} />
        </div>
        <PrimaryResultSubText>
          {passed ? <Translate text="testSuccessInfo" /> : <Translate text="testFailedInfo" />}
        </PrimaryResultSubText>
      </ResultCard>

      <SectionCard>
        <SectionResultRow>
          <SectionName>Section A</SectionName>
          <SectionScore>
            {testResults.A.correct} / {testResults.A.total}
          </SectionScore>
          <ResultStatusIcon success={sectionAPassed} />
        </SectionResultRow>
        <Divider />
        <SectionResultRow>
          <SectionName>Section B</SectionName>
          <SectionScore>
            {testResults.B.correct} / {testResults.B.total}
          </SectionScore>
          <ResultStatusIcon success={sectionBPassed} />
        </SectionResultRow>
        <Divider />
        <SectionResultRow>
          <SectionName>Section C</SectionName>
          <SectionScore>
            {testResults.C.correct} / {testResults.C.total}
          </SectionScore>
          <ResultStatusIcon success={sectionCPassed} />
        </SectionResultRow>
      </SectionCard>
    </>
  );
};

type NinjaIconProps = {
  passed: boolean;
};

const NinjaIcon: React.FC<NinjaIconProps> = (props) => {
  return (
    <CreateAnimation
      play={true}
      duration={700}
      easing="ease"
      delay={600}
      keyframes={[
        { offset: 0, transform: "scale(1)" },
        { offset: 0.5, transform: "scale(1.3)" },
        { offset: 1, transform: "scale(1)" },
      ]}
    >
      <div>
        <SuccessIcon success={props.passed} size="3.7rem" />
      </div>
    </CreateAnimation>
  );
};

type ResultTextProps = {
  passed: boolean;
};

const ResultText: React.FC<ResultTextProps> = (props) => {
  return (
    <CreateAnimation
      play={true}
      duration={700}
      easing="ease"
      delay={200}
      fromTo={{
        property: "transform",
        fromValue: "translateY(80px)",
        toValue: "translateY(0px)",
      }}
    >
      <PrimaryResultText>
        {props.passed ? <Translate text="testSuccess" /> : <Translate text="testFailed" />}
      </PrimaryResultText>
    </CreateAnimation>
  );
};

const ResultCard = styled.div`
  position: relative;
  overflow: hidden;
  margin: var(--app-page-content-top) var(--app-padding) 18px;
  padding: 28px 22px 26px;
  border-radius: 28px;
  color: var(--ion-color-light);
  background: var(--app-test-header-gradient);
  box-shadow: var(--app-test-action-shadow);
  text-align: center;
`;

const Glow = styled.div`
  position: absolute;
  right: -34px;
  top: -34px;
  width: 140px;
  height: 140px;
  border-radius: 50%;
  background: var(--app-premium-badge-background);
`;

const PrimaryResultText = styled.div`
  position: relative;
  padding: 12px 0;
  font-family: var(--ion-font-family-bold);
  font-size: var(--app-font-size-xxl);
  font-weight: 900;
  line-height: 1.1;
  text-transform: uppercase;
`;

const PrimaryResultSubText = styled.div`
  position: relative;
  max-width: 360px;
  margin: 0 auto;
  font-size: var(--app-font-size-l);
  font-weight: 800;
  line-height: 1.35;
  opacity: 0.86;
`;

const SectionCard = styled.div`
  margin: 0 var(--app-padding) 28px;
  padding: 8px 18px;
  border: var(--app-card-border);
  border-radius: 24px;
  background: var(--app-card-background);
  box-shadow: var(--app-card-shadow);
`;

const SectionResultRow = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto 34px;
  align-items: center;
  gap: 16px;
  min-height: 58px;
`;

const SectionName = styled.div`
  color: var(--app-text-primary);
  font-family: var(--ion-font-family-bold);
  font-size: var(--app-font-size-l);
  font-weight: 900;
`;

const SectionScore = styled.div`
  color: var(--app-text-muted);
  font-family: var(--ion-font-family-bold);
  font-size: var(--app-font-size-l);
  font-weight: 900;
  white-space: nowrap;
`;

const Divider = styled.div`
  height: 1px;
  background: var(--app-divider-color);
`;

type SuccessIconProps = {
  success: boolean;
  size: string;
};
const SuccessIcon: React.FC<SuccessIconProps> = (props) => {
  if (props.success) return <TestPassedIcon style={{ fontSize: props.size }} />;

  return <TestFailedIcon style={{ fontSize: props.size }} />;
};

type ResultStatusIconProps = {
  success: boolean;
};

const ResultStatusIcon: React.FC<ResultStatusIconProps> = ({ success }) => {
  return <StatusIcon icon={success ? checkmarkCircle : closeCircle} success={success} />;
};

const StatusIcon = styled(IonIcon)<{ success: boolean }>`
  color: ${(props) => (props.success ? "var(--ion-color-primary)" : "var(--ion-color-danger)")};
  font-size: 1.9rem;
`;

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
  return {
    testResults: testResultsSelector(state),
    sectionAPassed: sectionAPassedSelector(state),
    sectionBPassed: sectionBPassedSelector(state),
    sectionCPassed: sectionCPassedSelector(state),
    passed: passedSelector(state),
  };
};

const Header = connect(mapStateToProps)(HeaderComponent);

export { Header };
