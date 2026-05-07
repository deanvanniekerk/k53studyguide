import { CreateAnimation, IonContent, IonIcon, IonModal } from "@ionic/react";
import { search, shuffle, trashBinOutline } from "ionicons/icons";
import type React from "react";
import { useRef } from "react";
import styled from "styled-components";
import { CloseButton } from "@/app/components";
import { useInterval } from "@/app/hooks";
import { TestWatermark } from "./TestWatermark";

type Props = {
  isOpen: boolean;
  onDidDismiss: () => void;
};

const TestInfoModal: React.FC<Props> = (props) => {
  return (
    <Modal mode="ios" isOpen={props.isOpen} onDidDismiss={props.onDidDismiss}>
      <TestWatermark />
      <CloseButton onClick={() => props.onDidDismiss()} />
      <Content>
        <Container>
          <Hero>
            <SubHeader>Welcome to the</SubHeader>
            <Header>Test</Header>
            <ParagraphCenter>
              The Test is a <b>test</b> that is <b>set up</b> and <b> marked</b> in the <b>same way</b> as the{" "}
              <b>real learners license test</b>
            </ParagraphCenter>
          </Hero>

          <Cards>
            <InfoCard>
              <IconTile>
                <ShuffleIcon />
              </IconTile>
              <CardText>
                <b>Test</b> questions are <b>randomly</b> selected from a bank of over <b>400 questions</b>
              </CardText>
            </InfoCard>

            <InfoCard>
              <IconTile>
                <SearchIcon />
              </IconTile>
              <CardText>
                We apply a <b>weighting</b> when selecting your test questions. This means you more likely to see{" "}
                <i>
                  <b>new</b>
                </i>{" "}
                questions or ones you <b>previously</b> answered <b>incorrectly</b>
              </CardText>
            </InfoCard>

            <InfoCard>
              <IconTile>
                <TrashIcon />
              </IconTile>
              <CardText>
                Your <b>Test</b> history can be <b>reset</b> in the <b>Profile</b> tab
              </CardText>
            </InfoCard>
          </Cards>
        </Container>
      </Content>
    </Modal>
  );
};

const ShuffleIcon: React.FC = () => {
  const animation1 = useRef<CreateAnimation>(null);

  useInterval(() => {
    if (animation1.current) animation1.current.animation.play();
  }, 6000);

  return (
    <CreateAnimation
      play={false}
      ref={animation1}
      duration={700}
      easing="ease"
      keyframes={[
        { offset: 0, transform: "rotateX(0)" },
        { offset: 0.5, transform: "rotateX(190deg)" },
        { offset: 1, transform: "rotateX(360deg)" },
      ]}
    >
      <div>
        <LargeIcon
          icon={shuffle}
          style={{
            opacity: 0.8,
          }}
        />
      </div>
    </CreateAnimation>
  );
};

const SearchIcon: React.FC = () => {
  const animation1 = useRef<CreateAnimation>(null);

  useInterval(
    () => {
      if (animation1.current) animation1.current.animation.play();
    },
    6000,
    2000,
  );

  return (
    <CreateAnimation
      play={false}
      ref={animation1}
      duration={700}
      easing="ease"
      keyframes={[
        { offset: 0, transform: "scale(1)" },
        { offset: 0.5, transform: "scale(0.85)" },
        { offset: 1, transform: "scale(1)" },
      ]}
    >
      <div>
        <LargeIcon
          icon={search}
          style={{
            opacity: 0.8,
          }}
        />
      </div>
    </CreateAnimation>
  );
};

const TrashIcon: React.FC = () => {
  const animation1 = useRef<CreateAnimation>(null);

  useInterval(
    () => {
      if (animation1.current) animation1.current.animation.play();
    },
    6000,
    4000,
  );

  return (
    <CreateAnimation
      play={false}
      ref={animation1}
      duration={300}
      easing="ease"
      keyframes={[
        { offset: 0, transform: "rotate(0deg)" },
        { offset: 0.2, transform: "rotate(5deg)" },
        { offset: 0.4, transform: "rotate(-5deg)" },
        { offset: 0.6, transform: "rotate(5deg)" },
        { offset: 0.8, transform: "rotate(-5deg)" },
        { offset: 1, transform: "rotate(0deg)" },
      ]}
    >
      <div>
        <LargeIcon
          icon={trashBinOutline}
          style={{
            opacity: 0.8,
          }}
        />
      </div>
    </CreateAnimation>
  );
};

const Container = styled.div`
  padding: 0 var(--app-padding);
  padding-bottom: 50px;
`;

const Header = styled.div`
  color: var(--app-text-primary);
  font-size: var(--app-font-size-xxl);
  font-family: var(--ion-font-family-bold);
  font-weight: bold;
  text-align: center;
  margin-bottom: 18px;
`;

const SubHeader = styled.div`
  color: var(--app-text-primary);
  text-align: center;
  padding-bottom: 20px;
`;

const Paragraph = styled.p`
  color: var(--app-text-primary);
  font-size: var(--app-font-size-md);
  line-height: 1.45;
`;

const ParagraphCenter = styled(Paragraph)`
  text-align: center;
`;

const Hero = styled.section`
  margin-top: calc(var(--app-safe-area-top) + 56px);
  padding: 24px 18px 26px;
  border-radius: 22px;
  background: var(--app-test-header-gradient);
  box-shadow: var(--app-test-action-shadow);

  ${SubHeader},
  ${Header},
  ${ParagraphCenter} {
    color: var(--ion-color-light);
  }

  ${ParagraphCenter} {
    margin-bottom: 0;
  }
`;

const Cards = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-top: 18px;
`;

const InfoCard = styled.article`
  --info-card-accent: var(--app-test-accent);
  --info-card-accent-rgb: var(--app-test-accent-rgb);

  display: flex;
  align-items: center;
  gap: 18px;
  padding: 18px;
  border: var(--app-card-border);
  border-radius: 18px;
  background: var(--app-card-background);
  box-shadow: var(--app-card-shadow);

  &:nth-child(1) {
    --info-card-accent: var(--app-test-accent);
    --info-card-accent-rgb: var(--app-test-accent-rgb);
  }

  &:nth-child(2) {
    --info-card-accent: var(--ion-color-secondary);
    --info-card-accent-rgb: var(--ion-color-secondary-rgb);
  }

  &:nth-child(3) {
    --info-card-accent: var(--ion-color-danger);
    --info-card-accent-rgb: var(--ion-color-danger-rgb);
  }

  @media (max-width: 380px) {
    align-items: stretch;
    flex-direction: column;
    gap: 14px;
    text-align: center;
  }
`;

const IconTile = styled.div`
  display: grid;
  flex: 0 0 84px;
  width: 84px;
  min-height: 84px;
  place-items: center;
  border-radius: 18px;
  background: rgba(var(--info-card-accent-rgb), 0.12);
  color: var(--info-card-accent);

  @media (max-width: 380px) {
    width: 100%;
  }
`;

const CardText = styled(Paragraph)`
  min-width: 0;
  margin: 0;
`;

const LargeIcon = styled(IonIcon)`
  font-size: 3.2rem;
`;

const Content = styled(IonContent)`
  --background: transparent;
`;

const Modal = styled(IonModal)`
  color: var(--app-text-primary);
  --background: var(--app-test-background);
`;

export { TestInfoModal };
