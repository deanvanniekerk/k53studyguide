import { CreateAnimation, IonContent, IonIcon, IonModal } from "@ionic/react";
import { flashOffOutline, flashOutline, optionsOutline, star, trashBinOutline } from "ionicons/icons";
import type React from "react";
import { useRef, useState } from "react";
import styled from "styled-components";
import { CloseButton } from "@/app/components";
import { useInterval } from "@/app/hooks";
import { DojoWatermark } from "./DojoWatermark";

type Props = {
  isOpen: boolean;
  onDidDismiss: () => void;
};

const DojoInfoModal: React.FC<Props> = (props) => {
  return (
    <Modal mode="ios" isOpen={props.isOpen} onDidDismiss={props.onDidDismiss}>
      <DojoWatermark />
      <CloseButton onClick={() => props.onDidDismiss()} />
      <Content>
        <Container>
          <Hero>
            <SubHeader>Welcome to the</SubHeader>
            <Header>Quiz</Header>
            <ParagraphCenter>
              In the <b>Quiz</b> you can <b>practise</b> by completing <b>test questions</b>
            </ParagraphCenter>
          </Hero>

          <Cards>
            <InfoCard>
              <IconTile>
                <StarsIndicator />
              </IconTile>
              <CardText>
                The <b>5 star level</b> indicator shows your <b>proficiency</b> for a particular section
              </CardText>
            </InfoCard>

            <InfoCard>
              <IconTile>
                <ExperienceIcon />
              </IconTile>
              <CardText>
                Your can <b>level up</b> by obtaining <b>quiz</b> points. Obtain <b>Quiz</b> points by answering test
                questions correctly for the <b>first</b> time.
              </CardText>
            </InfoCard>

            <InfoCard>
              <IconTile>
                <OptionsIcon />
              </IconTile>
              <CardText>
                You can <b></b>control the <b>settings</b> of the <b>quiz</b> by changing the <b>Section</b> and{" "}
                <b>Max Questions</b>
              </CardText>
            </InfoCard>

            <InfoCard>
              <IconTile>
                <TrashIcon />
              </IconTile>
              <CardText>
                Your <b>Quiz</b> history can be <b>reset</b> in the <b>Profile</b> tab
              </CardText>
            </InfoCard>
          </Cards>
        </Container>
      </Content>
    </Modal>
  );
};

const StarsIndicator: React.FC = () => {
  const animation1 = useRef<CreateAnimation>(null);

  useInterval(() => {
    if (animation1.current) animation1.current.animation.play();
  }, 6000);

  return (
    <CreateAnimation
      play={false}
      ref={animation1}
      duration={900}
      easing="ease"
      keyframes={[
        { offset: 0, transform: "rotate(0deg) scale(1)" },
        { offset: 0.5, transform: "rotate(180deg) scale(1.14)" },
        { offset: 1, transform: "rotate(360deg) scale(1)" },
      ]}
    >
      <div>
        <StarIcon icon={star} />
      </div>
    </CreateAnimation>
  );
};

const ExperienceIcon: React.FC = () => {
  const [icon, setIcon] = useState("flash");
  const animation1 = useRef<CreateAnimation>(null);

  useInterval(
    () => {
      setIcon(icon === "flash" ? "flashOff" : "flash");
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
        { offset: 0.5, transform: "scale(1.05)" },
        { offset: 1, transform: "scale(1)" },
      ]}
    >
      <div>
        <LargeIcon
          icon={icon === "flash" ? flashOutline : flashOffOutline}
          style={{
            opacity: icon === "flash" ? 0.8 : 0.5,
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

const OptionsIcon: React.FC = () => {
  return (
    <LargeIcon
      icon={optionsOutline}
      style={{
        opacity: 0.8,
      }}
    />
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
  background: var(--app-dojo-header-gradient);
  box-shadow: var(--app-dojo-action-shadow);

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
  --info-card-accent: var(--app-progress-foreground);
  --info-card-accent-rgb: var(--app-progress-foreground-rgb);

  display: flex;
  align-items: center;
  gap: 18px;
  padding: 18px;
  border: var(--app-card-border);
  border-radius: 18px;
  background: var(--app-card-background);
  box-shadow: var(--app-card-shadow);

  &:nth-child(1) {
    --info-card-accent: var(--ion-color-warning);
    --info-card-accent-rgb: var(--ion-color-warning-rgb);
  }

  &:nth-child(2) {
    --info-card-accent: var(--ion-color-tertiary);
    --info-card-accent-rgb: var(--ion-color-tertiary-rgb);
  }

  &:nth-child(3) {
    --info-card-accent: var(--app-progress-foreground);
    --info-card-accent-rgb: var(--app-progress-foreground-rgb);
  }

  &:nth-child(4) {
    --info-card-accent: var(--ion-color-secondary);
    --info-card-accent-rgb: var(--ion-color-secondary-rgb);
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

const StarIcon = styled(LargeIcon)`
  color: var(--info-card-accent);
  filter: drop-shadow(0 2px 0 rgba(var(--app-text-primary-rgb), 0.18));
`;

const Content = styled(IonContent)`
  --background: transparent;
`;

const Modal = styled(IonModal)`
  color: var(--app-text-primary);
  --background: var(--app-dojo-background);
`;

export { DojoInfoModal };
