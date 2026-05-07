import { IonAlert, IonButton, IonIcon, IonText } from "@ionic/react";
import { help } from "ionicons/icons";
import type React from "react";
import { useState } from "react";
import { connect, useDispatch } from "react-redux";
import { useHistory } from "react-router";
import { Translate, Translator } from "react-translated";
import type { AnyAction, Dispatch } from "redux";
import type { ThunkDispatch } from "redux-thunk";
import styled from "styled-components";
import { Breadcrumb } from "@/app/components/Breadcrumb";
import type { RootState } from "@/state";
import { recieveTargetNavigationKey } from "@/state/dojo/navigation";
import { loadQuestionAnswers } from "@/state/dojo/test";
import { recieveLastSeenParentContentKey } from "@/state/study/log";
import { currentNavigationKeySelector } from "@/state/study/navigation";
import { SeenProgress } from "./SeenProgress";

type Props = PropsFromState;

const HeaderComponent: React.FC<Props> = (props) => {
  const history = useHistory();
  const dispatch = useDispatch<Dispatch<AnyAction> & ThunkDispatch<RootState, null, AnyAction>>();
  const [showStartQuizAlert, setShowStartQuizAlert] = useState(false);

  return (
    <>
      <HeaderShell>
        <Breadcrumb navigationKey={props.currentNavigationKey} />
        <Title>
          <Translate text={props.currentNavigationKey} />
        </Title>
        <ProgressPanel>
          <SeenProgress navigationKey={props.currentNavigationKey} />
          <QuizButton
            color="secondary"
            shape="round"
            fill="solid"
            size="small"
            aria-label="Start quiz"
            onClick={() => setShowStartQuizAlert(true)}
          >
            <IonIcon icon={help} />
          </QuizButton>
        </ProgressPanel>
      </HeaderShell>

      <Translator>
        {({ translate }) => (
          <IonAlert
            isOpen={showStartQuizAlert}
            onDidDismiss={() => setShowStartQuizAlert(false)}
            message={`Start a new Quiz on '${translate({
              text: props.currentNavigationKey,
            })}' content?`}
            buttons={[
              {
                text: "Cancel",
                handler: () => {
                  setShowStartQuizAlert(false);
                },
              },
              {
                text: "Yes",
                handler: () => {
                  // so that we can continue
                  dispatch(recieveLastSeenParentContentKey(props.currentNavigationKey));
                  dispatch(recieveTargetNavigationKey(props.currentNavigationKey));
                  dispatch(loadQuestionAnswers());
                  history.push(`/test-dojo`);
                },
              },
            ]}
          />
        )}
      </Translator>
    </>
  );
};

const HeaderShell = styled.header`
  --breadcrumb-color: var(--app-text-muted);

  padding: calc(var(--content-page-header-height, var(--app-page-header-height)) + 44px) var(--app-padding) 22px;
  transition: padding 180ms ease;
`;

const Title = styled(IonText)`
  color: var(--app-text-primary);
  display: block;
  font-family: var(--ion-font-family-bold);
  font-size: var(--app-font-size-xxxl);
  font-weight: 900;
  letter-spacing: 0;
  line-height: 1.05;
  margin: 12px 0 24px;

  @media (max-width: 420px) {
    font-size: var(--app-font-size-xxl);
  }
`;

const ProgressPanel = styled.div`
  align-items: center;
  background: var(--app-card-background);
  border: 2px solid var(--app-card-border-color);
  border-radius: 28px;
  box-shadow: 0 2px 0 var(--app-card-border-color);
  display: grid;
  gap: 14px;
  grid-template-columns: minmax(0, 1fr) 44px;
  min-height: 78px;
  padding: 14px 16px;
`;

const QuizButton = styled(IonButton)`
  --background: var(--app-study-primary-gradient);
  --background-activated: var(--app-study-primary-gradient);
  --background-hover: var(--app-study-primary-gradient);
  --box-shadow: none;
  height: 44px;
  margin: 0;
  width: 44px;

  ion-icon {
    font-size: 1.25rem;
  }
`;

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
  return {
    currentNavigationKey: currentNavigationKeySelector(state),
  };
};

const Header = connect(mapStateToProps)(HeaderComponent);

export { Header };
