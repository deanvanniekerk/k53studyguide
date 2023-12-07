import { useAnalytics } from '@/app/hooks/useAnalytics';
import { RootState } from '@/state';
import { loadQuestionAnswers, testInProgressSelector } from '@/state/arena/test';
import { notificationsSelector, recieveRecieveNotificationState } from '@/state/notifications';
import { IonContent, IonPage } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router';
import { bindActionCreators, Dispatch } from 'redux';
import styled from 'styled-components';
import { ArenaInfoModal } from './ArenaInfoModal';
import { ArenaPageHeader } from './ArenaPageHeader';
import { ArenaWatermark } from './ArenaWatermark';
import { Header } from './components';

type Props = PropsFromState & PropsFromDispatch;

const ArenaPage: React.FC<Props> = (props) => {
  const history = useHistory();

  const { logEvent } = useAnalytics('TestPage');

  const [infoModalVisible, setInfoModalVisible] = useState(false);

  useEffect(() => {
    if (!props.infoSeen) {
      showInfoModal();
    }
  }, [props.infoSeen]);

  const showInfoModal = () => {
    setInfoModalVisible(true);
    props.recieveRecieveNotificationState('arenaInfo', { seen: true });
  };

  const onStartTestClicked = () => {
    logEvent(props.testInProgress ? 'CONTINUE_TEST' : 'START_TEST');

    //If no test exists, load one, else continue with previous
    if (!props.testInProgress) props.loadQuestionAnswers();

    history.push(`/test-arena`);
  };

  return (
    <Page>
      <ArenaInfoModal
        isOpen={infoModalVisible}
        onDidDismiss={() => {
          setInfoModalVisible(false);
        }}
      />
      <ArenaPageHeader onInfoClicked={() => showInfoModal()} />
      <ArenaWatermark />
      <Content>
        <Header onStartTestClicked={onStartTestClicked} />
      </Content>
    </Page>
  );
};

const Content = styled(IonContent)`
  --background: transparent;
`;

const Page = styled(IonPage)`
  background: var(--arena-background);
`;

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
  return {
    testInProgress: testInProgressSelector(state),
    infoSeen: notificationsSelector(state).arenaInfo.seen,
  };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    ...bindActionCreators({ loadQuestionAnswers, recieveRecieveNotificationState }, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ArenaPage);
