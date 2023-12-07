import { RootState } from '@/state';
import {
  allQuestionsAnsweredSelector,
  currentSectionSelector,
  recieveCurrentSection,
  TestSection,
} from '@/state/arena/test';
import { IonButton, IonIcon, IonToast } from '@ionic/react';
import { arrowForwardOutline, checkmarkCircleOutline } from 'ionicons/icons';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Translate, Translator } from 'react-translated';
import { bindActionCreators, Dispatch } from 'redux';
import styled from 'styled-components';

type Props = {
  onSubmitClicked: () => void;
  onScrollTop: () => void;
} & PropsFromState &
  PropsFromDispatch;

const FooterComponent: React.FC<Props> = (props) => {
  const [showNotComplete, setShowNotComplete] = useState(false);

  const onSubmitClicked = () => {
    if (!props.allQuestionsAnswered) {
      setShowNotComplete(true);
      return;
    }

    props.onSubmitClicked();
  };

  const changeCurrentSection = (section: TestSection) => {
    props.onScrollTop();
    props.recieveCurrentSection(section);
  };

  return (
    <Wrapper>
      {props.currentSection === 'A' && (
        <IonButton
          color="tertiary"
          shape="round"
          fill="outline"
          className="button-med-large"
          onClick={() => changeCurrentSection('B')}
        >
          <Translate text="nextSection" />
          <IonIcon slot="end" icon={arrowForwardOutline} />
        </IonButton>
      )}
      {props.currentSection === 'B' && (
        <IonButton
          color="tertiary"
          shape="round"
          fill="outline"
          className="button-med-large"
          onClick={() => changeCurrentSection('C')}
        >
          <Translate text="nextSection" />
          <IonIcon slot="end" icon={arrowForwardOutline} />
        </IonButton>
      )}
      {props.currentSection === 'C' && (
        <IonButton color="tertiary" shape="round" fill="solid" className="button-med-large" onClick={onSubmitClicked}>
          <Translate text="submit" />
          <IonIcon slot="end" icon={checkmarkCircleOutline} />
        </IonButton>
      )}

      <Translator>
        {({ translate }) => (
          <IonToast
            isOpen={showNotComplete}
            message={translate({ text: 'pleaseAnswerAllQuestions' })}
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
  padding-bottom: 35px;
`;

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
  return {
    allQuestionsAnswered: allQuestionsAnsweredSelector(state),
    currentSection: currentSectionSelector(state),
  };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    ...bindActionCreators({ recieveCurrentSection }, dispatch),
  };
};

const Footer = connect(mapStateToProps, mapDispatchToProps)(FooterComponent);

export { Footer };
