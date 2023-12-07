import { BackButton } from '@/app/components';
import { BookOutlineIcon } from '@/app/components/icons';
import { useAnalytics } from '@/app/hooks/useAnalytics';
import { watermarkStyle } from '@/app/styles';
import { RootState } from '@/state';
import { currentNavigationParentSelector, navigateUp, ROOT_NAVIGATION_KEY } from '@/state/study/navigation';
import { IonContent, IonPage } from '@ionic/react';
import { arrowUp } from 'ionicons/icons';
import React, { useRef } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { bindActionCreators, Dispatch } from 'redux';
import styled from 'styled-components';
import { ContentList, Header, Navigator } from './components';

type Props = PropsFromState & PropsFromDispatch;

const ContentPage: React.FC<Props> = (props) => {
  const history = useHistory();
  const content = useRef<HTMLIonContentElement>(null);

  useAnalytics('ContentPage');

  const onBackClicked = () => {
    // if (content.current) {
    //     console.log("scrollHeight", content.current.scrollHeight);
    //     console.log("scrollTop", content.current.scrollTop);
    // }

    if (props.currentNavigationParent === ROOT_NAVIGATION_KEY) {
      history.replace('/study');
      return;
    }

    props.navigateUp();
  };

  return (
    <Page>
      <Watermark />
      <Content ref={content}>
        <BackButton onClick={onBackClicked} icon={arrowUp} />
        <Header />
        <Navigator />
        <ContentList />
      </Content>
    </Page>
  );
};

const Watermark = styled(BookOutlineIcon)`
  ${watermarkStyle}
`;

const Content = styled(IonContent)`
  --background: transparent;
`;

const Page = styled(IonPage)`
  background: var(--study-background);
`;

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
  return {
    currentNavigationParent: currentNavigationParentSelector(state),
  };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    ...bindActionCreators({ navigateUp }, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ContentPage);
