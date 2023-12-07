import { recieveLogMessage } from '@/state/log';
import { IonButton, IonContent, IonIcon, IonPage } from '@ionic/react';
import { reload } from 'ionicons/icons';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import styled from 'styled-components';
import { TestFailedIcon } from './icons';

type State = {
  hasError: boolean;
};

type Props = {
  children: React.ReactNode;
} & PropsFromDispatch;

export class ErrorBoundaryComponent extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error: Error | null, info: unknown) {
    // Display fallback UI
    this.setState({ hasError: true });

    const message = `Error Boundary: ${error ? error.message : ''}`;
    const name = error ? error.name : '';

    const data = {
      message: message,
      name: name,
      info: JSON.stringify(info),
    };

    this.props.recieveLogMessage('ERROR', message, data);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <Page>
          <Content>
            <Icon>
              <TestFailedIcon />
            </Icon>
            <Header>K53 Study Guide has Crashed</Header>

            <Button>
              <IonButton
                color="light"
                shape="round"
                fill="solid"
                className="button-med-large"
                onClick={() => {
                  document.location.reload();
                }}
              >
                Restart
                <IonIcon slot="end" icon={reload} />
              </IonButton>
            </Button>
          </Content>
        </Page>
      );
    }
    return this.props.children;
  }
}

const Icon = styled.div`
  padding-top: 65px;
  font-size: 6rem;
  text-align: center;
`;

const Header = styled.div`
  padding-top: 15px;
  font-size: var(--ion-font-size-xxl);
  text-align: center;
`;

const Button = styled.div`
  padding-top: 35px;
  text-align: center;
`;

const Content = styled(IonContent)`
  --background: transparent;
`;

const Page = styled(IonPage)`
  background: linear-gradient(to right top, #c34a36, #c24541, #bf414c, #ba3f56, #b43e5f);
`;

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    ...bindActionCreators(
      {
        recieveLogMessage,
      },
      dispatch,
    ),
  };
};

const ErrorBoundary = connect(null, mapDispatchToProps)(ErrorBoundaryComponent);

export { ErrorBoundary };
