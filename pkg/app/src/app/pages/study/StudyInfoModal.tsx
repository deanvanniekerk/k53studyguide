import { CreateAnimation, IonContent, IonIcon, IonModal } from "@ionic/react";
import { eyeOffOutline, eyeOutline, trashBinOutline } from "ionicons/icons";
import type React from "react";
import { useRef, useState } from "react";
import styled from "styled-components";
import { CloseButton, ProgressBar } from "@/app/components";
import { BookOutlineIcon } from "@/app/components/icons";
import { useInterval } from "@/app/hooks";
import { watermarkStyle } from "@/app/styles";

type Props = {
  isOpen: boolean;
  onDidDismiss: () => void;
};

const StudyInfoModal: React.FC<Props> = (props) => {
  return (
    <Modal mode="ios" isOpen={props.isOpen} onDidDismiss={props.onDidDismiss}>
      <Watermark />
      <CloseButton onClick={() => props.onDidDismiss()} />
      <Content>
        <Container>
          <Hero>
            <SubHeader>Welcome to the</SubHeader>
            <Header>Study Section</Header>
            <ParagraphCenter>
              The study section contains all the K53 material you need to study in order to pass your leaners license
              test
            </ParagraphCenter>
          </Hero>

          <Cards>
            <InfoCard>
              <IconTile>
                <SeenIcon />
              </IconTile>
              <CardText>
                All sections that have been <b>read</b> through are tracked, this is indicated by the <b>seen</b> icon
              </CardText>
            </InfoCard>

            <InfoCard>
              <IconTile>
                <ProgressBarIndicator />
              </IconTile>
              <CardText>
                Progress bars indictate <b>cumulative</b> totals of sections that have been read through
              </CardText>
            </InfoCard>

            <InfoCard>
              <IconTile>
                <TrashIcon />
              </IconTile>
              <CardText>
                Your <b>read</b> history can be <b>reset</b> in the <b>Profile</b> tab
              </CardText>
            </InfoCard>
          </Cards>
        </Container>
      </Content>
    </Modal>
  );
};

const SeenIcon: React.FC = () => {
  const [icon, setIcon] = useState("eyeOff");
  const animation1 = useRef<CreateAnimation>(null);

  useInterval(() => {
    setIcon(icon === "eye" ? "eyeOff" : "eye");
    if (animation1.current) animation1.current.animation.play();
  }, 6000);

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
          icon={icon === "eye" ? eyeOutline : eyeOffOutline}
          style={{
            opacity: icon === "eye" ? 0.8 : 0.5,
          }}
        />
      </div>
    </CreateAnimation>
  );
};

const ProgressBarIndicator: React.FC = () => {
  const [percent, setPercent] = useState(25);

  useInterval(
    () => {
      let next = percent + 25;
      if (next > 100) next = 25;
      setPercent(next);
    },
    6000,
    2000,
  );

  return (
    <ProgressBarWrapper>
      <ProgressBar progress={percent} height={8} />
    </ProgressBarWrapper>
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

const Watermark = styled(BookOutlineIcon)`
  ${watermarkStyle}
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
  background: var(--app-study-header-gradient);
  box-shadow: var(--app-study-action-shadow);

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
    --info-card-accent: var(--app-study-section-rules);
    --info-card-accent-rgb: var(--app-study-section-rules-rgb);
  }

  &:nth-child(2) {
    --info-card-accent: var(--app-study-section-signals);
    --info-card-accent-rgb: var(--app-study-section-signals-rgb);
  }

  &:nth-child(3) {
    --info-card-accent: var(--app-study-section-vehicle);
    --info-card-accent-rgb: var(--app-study-section-vehicle-rgb);
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

const ProgressBarWrapper = styled.div`
  width: min(120px, 100%);
  padding: 0 14px;
`;

const Content = styled(IonContent)`
  --background: transparent;
`;

const Modal = styled(IonModal)`
  color: var(--app-text-primary);
  --background: var(--app-study-background);
`;

export { StudyInfoModal };
