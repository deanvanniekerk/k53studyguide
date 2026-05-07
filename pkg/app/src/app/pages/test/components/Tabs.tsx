import type React from "react";
import { connect } from "react-redux";
import { Translate } from "react-translated";
import { bindActionCreators, type Dispatch } from "redux";
import styled from "styled-components";
import type { RootState } from "@/state";
import {
  currentSectionSelector,
  recieveCurrentSection,
  type TestSection,
  testResultsSelector,
} from "@/state/test/session";

type Props = {
  hideInfo?: boolean;
  onSectionClicked?: (section: TestSection) => void;
} & PropsFromState &
  PropsFromDispatch;

const TabsComponent: React.FC<Props> = ({
  currentSection,
  testResults,
  recieveCurrentSection,
  hideInfo,
  onSectionClicked,
}) => {
  const selectSection = (section: TestSection) => {
    if (onSectionClicked) onSectionClicked(section);
    else recieveCurrentSection(section);
  };

  return (
    <TabsWrapper>
      <Tab type="button" selected={currentSection === "A"} onClick={() => selectSection("A")}>
        <Translate text="sectionA" />
        {!hideInfo && (
          <TabInfo selected={currentSection === "A"}>{`${testResults.A.answered} / ${testResults.A.total}`}</TabInfo>
        )}
      </Tab>
      <Tab type="button" selected={currentSection === "B"} onClick={() => selectSection("B")}>
        <Translate text="sectionB" />
        {!hideInfo && (
          <TabInfo selected={currentSection === "B"}>{`${testResults.B.answered} / ${testResults.B.total}`}</TabInfo>
        )}
      </Tab>
      <Tab type="button" selected={currentSection === "C"} onClick={() => selectSection("C")}>
        <Translate text="sectionC" />
        {!hideInfo && (
          <TabInfo selected={currentSection === "C"}>{`${testResults.C.answered} / ${testResults.C.total}`}</TabInfo>
        )}
      </Tab>
    </TabsWrapper>
  );
};

const TabsWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0;
  margin: 16px var(--app-padding) 30px;
  padding: 6px;
  border: var(--app-card-border);
  border-radius: 22px;
  background: var(--app-card-background);
  box-shadow: var(--app-card-shadow);
`;

const Tab = styled.button<{ selected: boolean }>`
  min-width: 0;
  min-height: 72px;
  padding: 10px 4px;
  border: 0;
  border-radius: 18px;
  background: ${(props) => (props.selected ? "var(--app-test-action-background)" : "transparent")};
  color: ${(props) => (props.selected ? "var(--ion-color-light)" : "var(--app-text-muted)")};
  font-family: var(--ion-font-family-bold);
  font-size: var(--app-font-size-md);
  font-weight: 900;
  line-height: 1.1;
  text-align: center;
`;

const TabInfo = styled.div<{ selected: boolean }>`
  display: block;
  padding-top: 8px;
  font-family: var(--ion-font-family-bold);
  font-size: var(--app-font-size-l);
  font-weight: 900;
  opacity: ${(props) => (props.selected ? "1" : "0.72")};
`;

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
  return {
    currentSection: currentSectionSelector(state),
    testResults: testResultsSelector(state),
  };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    ...bindActionCreators({ recieveCurrentSection }, dispatch),
  };
};

const Tabs = connect(mapStateToProps, mapDispatchToProps)(TabsComponent);

export { Tabs };
