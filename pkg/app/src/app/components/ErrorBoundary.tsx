import { IonButton, IonContent, IonIcon, IonPage } from "@ionic/react";
import { translations } from "@k53studyguide/shared/data";
import { Translate, Provider as TranslationProvider } from "@k53studyguide/shared/translation";
import { reload } from "ionicons/icons";
import React from "react";
import { connect } from "react-redux";
import { bindActionCreators, type Dispatch } from "redux";
import styled from "styled-components";
import type { RootState } from "@/state";
import { recieveLogMessage } from "@/state/log";
import { languageSelector } from "@/state/settings";
import { TestFailedIcon } from "./icons";

type State = {
  hasError: boolean;
};

type Props = {
  children: React.ReactNode;
  language?: string;
} & PropsFromDispatch;

export class ErrorBoundaryComponent extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error: Error | null, info: unknown) {
    // Display fallback UI
    this.setState({ hasError: true });

    const message = `Error Boundary: ${error ? error.message : ""}`;
    const name = error ? error.name : "";

    const data = {
      message: message,
      name: name,
      info: JSON.stringify(info),
    };

    this.props.recieveLogMessage("ERROR", message, data);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <TranslationProvider language={this.props.language ?? "en"} translation={translations}>
          <Page>
            <Content>
              <Icon>
                <TestFailedIcon />
              </Icon>
              <Header>
                <Translate text="crashTitle" />
              </Header>

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
                  <Translate text="restart" />
                  <IonIcon slot="end" icon={reload} />
                </IonButton>
              </Button>
            </Content>
          </Page>
        </TranslationProvider>
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
  font-size: var(--app-font-size-xxl);
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
  background: var(--app-error-background);
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

const ErrorBoundary = connect(
  (state: RootState) => ({ language: languageSelector(state) }),
  mapDispatchToProps,
)(ErrorBoundaryComponent);

export { ErrorBoundary };
