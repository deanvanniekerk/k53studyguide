import { HorizontalRule, StarRating } from '@/app/components';
import { useInterval } from '@/app/hooks';
import { CreateAnimation, IonContent, IonIcon, IonModal } from '@ionic/react';
import { closeOutline, flashOffOutline, flashOutline, optionsOutline, trashBinOutline } from 'ionicons/icons';
import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { DojoWatermark } from './DojoWatermark';

type Props = {
  isOpen: boolean;
  onDidDismiss: () => void;
};

const DojoInfoModal: React.FC<Props> = (props) => {
  return (
    <Modal mode="ios" isOpen={props.isOpen} onDidDismiss={props.onDidDismiss}>
      <DojoWatermark />
      <CloseIcon icon={closeOutline} onClick={() => props.onDidDismiss()} />
      <Content>
        <Container>
          <SubHeader>Welcome to the</SubHeader>
          <Header>Quiz</Header>
          <ParagraphCenter>
            In the <b>Quiz</b> you can <b>practise</b> by completing <b>test questions</b>
          </ParagraphCenter>

          <HorizontalRule leftMargin={10} rightMargin={10} paddingTop={20} paddingBottom={20} />
          <Center>
            <StarsIndicator />
          </Center>
          <ParagraphCenter>
            The <b>5 star level</b> indicator shows your <b>proficiency</b> for a particular section
          </ParagraphCenter>

          <HorizontalRule leftMargin={10} rightMargin={10} paddingTop={25} paddingBottom={35} />
          <Center>
            <ExperienceIcon />
          </Center>
          <ParagraphCenter>
            Your can <b>level up</b> by obtaining <b>quiz</b> points. Obtain <b>Quiz</b> points by answering test
            questions correctly for the <b>first</b> time.
          </ParagraphCenter>

          <HorizontalRule leftMargin={10} rightMargin={10} paddingTop={20} paddingBottom={35} />
          <Center>
            <OptionsIcon />
          </Center>
          <ParagraphCenter>
            You can <b></b>control the <b>settings</b> of the <b>quiz</b> by changing the <b>Section</b> and{' '}
            <b>Max Questions</b>
          </ParagraphCenter>

          <HorizontalRule leftMargin={10} rightMargin={10} paddingTop={20} paddingBottom={35} />
          <Center>
            <TrashIcon />
          </Center>
          <ParagraphCenter>
            Your <b>Quiz</b> history can be <b>reset</b> in the <b>Profile</b> tab
          </ParagraphCenter>
        </Container>
      </Content>
    </Modal>
  );
};

const StarsIndicator: React.FC = () => {
  const [level, setLevel] = useState(1);

  useInterval(() => {
    let next = level + 2;
    if (next > 5) next = 1;
    setLevel(next);
  }, 6000);

  return (
    <StarWrapper>
      <StarRating total={5} current={level} size="2rem" padding="6px" />
    </StarWrapper>
  );
};

const ExperienceIcon: React.FC = () => {
  const [icon, setIcon] = useState('flash');
  const animation1 = useRef<CreateAnimation>(null);

  useInterval(
    () => {
      setIcon(icon === 'flash' ? 'flashOff' : 'flash');
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
        { offset: 0, transform: 'scale(1)' },
        { offset: 0.5, transform: 'scale(1.05)' },
        { offset: 1, transform: 'scale(1)' },
      ]}
    >
      <div>
        <LargeIcon
          icon={icon === 'flash' ? flashOutline : flashOffOutline}
          style={{
            opacity: icon === 'flash' ? 0.8 : 0.5,
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
        { offset: 0, transform: 'rotate(0deg)' },
        { offset: 0.2, transform: 'rotate(5deg)' },
        { offset: 0.4, transform: 'rotate(-5deg)' },
        { offset: 0.6, transform: 'rotate(5deg)' },
        { offset: 0.8, transform: 'rotate(-5deg)' },
        { offset: 1, transform: 'rotate(0deg)' },
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
  padding: 0 var(--default-padding);
  padding-bottom: 50px;
`;

const CloseIcon = styled(IonIcon)`
  position: absolute;
  z-index: 102;
  font-size: var(--ion-font-size-xxxl);
  padding-left: var(--default-padding);
  padding-top: var(--default-padding);
`;

const Header = styled.div`
  font-size: var(--ion-font-size-xxl);
  font-family: var(--ion-font-family-bold);
  font-weight: bold;
  text-align: center;
  margin-bottom: 30px;
`;

const SubHeader = styled.div`
  text-align: center;
  padding-bottom: 20px;
  padding-top: 55px;
`;

const Paragraph = styled.p`
  font-size: var(--ion-font-size-md);
`;

const ParagraphCenter = styled(Paragraph)`
  text-align: center;
`;

const Center = styled.div`
  text-align: center;
`;

const LargeIcon = styled(IonIcon)`
  font-size: 4rem;
`;

const Content = styled(IonContent)`
  --background: transparent;
`;

const StarWrapper = styled.div`
  padding-top: 10px;
  padding-bottom: 5px;
  display: flex;
  justify-content: center;
`;

const Modal = styled(IonModal)`
  color: var(--ion-color-light);
  --background: var(--dojo-background);
`;

export { DojoInfoModal };
