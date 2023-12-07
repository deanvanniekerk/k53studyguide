import { RootState } from '@/state';
import { currentSectionSelector, recieveCurrentSection, testResultsSelector } from '@/state/arena/test';
import { IonCol, IonGrid, IonRow } from '@ionic/react';
import React from 'react';
import { connect } from 'react-redux';
import { Translate } from 'react-translated';
import { bindActionCreators, Dispatch } from 'redux';
import styled from 'styled-components';

type Props = {
  hideInfo?: boolean;
} & PropsFromState &
  PropsFromDispatch;

const TabsComponent: React.FC<Props> = ({ currentSection, testResults, recieveCurrentSection, hideInfo }) => {
  return (
    <IonGrid>
      <IonRow style={{ paddingTop: 10, paddingBottom: 10 }}>
        <IonCol size="4" onClick={() => recieveCurrentSection('A')}>
          <TabWrapper>
            <Tab selected={currentSection === 'A'}>
              <Translate text="sectionA" />
              {!hideInfo && (
                <TabInfo
                  selected={currentSection === 'A'}
                >{`${testResults.A.answered} / ${testResults.A.total}`}</TabInfo>
              )}
            </Tab>
          </TabWrapper>
        </IonCol>
        <IonCol size="4" onClick={() => recieveCurrentSection('B')}>
          <TabWrapper>
            <Tab selected={currentSection === 'B'}>
              <Translate text="sectionB" />
              {!hideInfo && (
                <TabInfo
                  selected={currentSection === 'B'}
                >{`${testResults.B.answered} / ${testResults.B.total}`}</TabInfo>
              )}
            </Tab>
          </TabWrapper>
        </IonCol>
        <IonCol size="4" onClick={() => recieveCurrentSection('C')}>
          <TabWrapper>
            <Tab selected={currentSection === 'C'}>
              <Translate text="sectionC" />
              {!hideInfo && (
                <TabInfo
                  selected={currentSection === 'C'}
                >{`${testResults.C.answered} / ${testResults.C.total}`}</TabInfo>
              )}
            </Tab>
          </TabWrapper>
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};

const TabWrapper = styled.div`
  width: 100%;
  padding: 12px;
`;

const Tab = styled.div<{ selected: boolean }>`
  text-align: center;
  font-size: var(--ion-font-size-md);
  padding-bottom: 15px;
  font-family: var(--ion-font-family-bold);
  font-weight: ${(props) => (props.selected ? 'bold' : '100')};
  border-bottom: ${(props) => (props.selected ? '2px' : '0')} solid #ffffffc9;
`;

const TabInfo = styled.div<{ selected: boolean }>`
  font-size: var(--ion-font-size-xs);
  font-family: var(--ion-font-family-bold);
  font-weight: ${(props) => (props.selected ? 'bold' : '100')};
  display: block;
  padding-top: 5px;
  opacity: 0.7;
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
