import { Breadcrumb, HorizontalRule } from '@/app/components';
import { RootState } from '@/state';
import { targetNavigationKeySelector } from '@/state/dojo/navigation';
import { totalQuestionsSelector } from '@/state/dojo/test';
import { ROOT_NAVIGATION_KEY } from '@/state/navigation';
import { IonCol, IonGrid, IonListHeader, IonRow, IonText } from '@ionic/react';
import React from 'react';
import { connect } from 'react-redux';
import { Translate } from 'react-translated';
import styled from 'styled-components';

type Props = PropsFromState;

const HeaderComponent: React.FC<Props> = (props) => {
  return (
    <React.Fragment>
      <IonListHeader>
        <IonGrid>
          <IonRow style={{ paddingTop: 55 }}>
            <IonCol>
              <IonText>
                <h2>
                  <Translate
                    text={props.targetNavigationKey === ROOT_NAVIGATION_KEY ? 'allContent' : props.targetNavigationKey}
                  />
                </h2>
              </IonText>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <Breadcrumb navigationKey={props.targetNavigationKey} rootText="allContent" />
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonListHeader>
      <HorizontalRule leftMargin={20} rightMargin={36} paddingBottom={0} paddingTop={20} />
      <QuestionCount>
        <Translate text="totalQuestions" />: {props.totalQuestions}
      </QuestionCount>
      <HorizontalRule leftMargin={20} rightMargin={36} paddingBottom={30} paddingTop={20} />
    </React.Fragment>
  );
};

const QuestionCount = styled.div`
  padding-top: 17px;
  font-size: var(--ion-font-size-l);
  text-align: center;
`;

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
  return {
    targetNavigationKey: targetNavigationKeySelector(state),
    totalQuestions: totalQuestionsSelector(state),
  };
};

const Header = connect(mapStateToProps)(HeaderComponent);

export { Header };
