import { IonContent, IonFooter, IonModal } from "@ionic/react";
import { arrowForward } from "ionicons/icons";
import { Translate } from "react-translated";
import styled from "styled-components";
import { Illustration, type IllustrationName } from "./Illustration";
import { PrimaryButton } from "./PrimaryButton";

export type InfoModalProps = {
  isOpen: boolean;
  onDidDismiss: () => void;
};

type Section = "study" | "quiz" | "test";
type SectionIntroduction = {
  hero: IllustrationName;
  cards: readonly { image: IllustrationName; title: string; body: string }[];
};

const introductions: Record<Section, SectionIntroduction> = {
  study: {
    hero: "road-rules",
    cards: [
      { image: "study-seen", title: "infoStudySeenTitle", body: "infoStudySeenBody" },
      { image: "study-progress", title: "infoStudyProgressTitle", body: "infoStudyProgressBody" },
      { image: "study-reset", title: "infoResetTitle", body: "infoStudyResetBody" },
    ],
  },
  quiz: {
    hero: "quiz-star",
    cards: [
      { image: "quiz-star", title: "infoQuizStarsTitle", body: "infoQuizStarsBody" },
      { image: "quiz-points", title: "infoQuizPointsTitle", body: "infoQuizPointsBody" },
      { image: "quiz-settings", title: "infoQuizSettingsTitle", body: "infoQuizSettingsBody" },
      { image: "quiz-reset", title: "infoResetTitle", body: "infoQuizResetBody" },
    ],
  },
  test: {
    hero: "mock-tests",
    cards: [
      { image: "test-shuffle", title: "infoTestMixTitle", body: "infoTestMixBody" },
      { image: "test-practice", title: "infoTestFocusTitle", body: "infoTestFocusBody" },
      { image: "repeat-practice", title: "infoResetTitle", body: "infoTestResetBody" },
    ],
  },
};

export const SectionInfoModal = ({ section, isOpen, onDidDismiss }: InfoModalProps & { section: Section }) => {
  const introduction = introductions[section];
  const titleId = `${section}-intro-title`;

  return (
    <Modal mode="ios" $section={section} isOpen={isOpen} onDidDismiss={onDidDismiss} aria-labelledby={titleId}>
      <Content>
        <Container>
          <Hero $section={section}>
            <HeroTop>
              <Eyebrow>
                <Translate text={section} />
              </Eyebrow>
              <Illustration name={introduction.hero} size={56} />
            </HeroTop>
            <Heading id={titleId}>
              <Translate text={`info${section}Title`} />
            </Heading>
            <Introduction>
              <Translate text={`info${section}Body`} />
            </Introduction>
          </Hero>
          <Cards>
            {introduction.cards.map((card) => (
              <Card key={card.title}>
                <Artwork>
                  <Illustration name={card.image} size={56} />
                </Artwork>
                <CardCopy>
                  <CardTitle>
                    <Translate text={card.title} />
                  </CardTitle>
                  <CardText>
                    <Translate text={card.body} />
                  </CardText>
                </CardCopy>
              </Card>
            ))}
          </Cards>
        </Container>
      </Content>
      <Footer className="ion-no-border">
        <FooterContent>
          <PrimaryButton section={section} text="infoContinue" rightIcon={arrowForward} onClick={onDidDismiss} />
        </FooterContent>
      </Footer>
    </Modal>
  );
};

const Modal = styled(IonModal)<{ $section: Section }>`
  --background: ${(props) => `var(--app-${props.$section}-background)`};
  color: var(--app-text-primary);
`;
const Content = styled(IonContent)`--background: transparent;`;
const Container = styled.div`
  max-width: 560px;
  margin: 0 auto;
  padding: calc(var(--app-safe-area-top) + 12px) var(--app-padding) 24px;
`;
const Hero = styled.section<{ $section: Section }>`
  padding: 12px 22px 24px;
  border-radius: 24px;
  background: ${(props) => `var(--app-${props.$section}-header-gradient)`};
  color: #fff;
`;
const HeroTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 8px;
`;
const Eyebrow = styled.div`
  font-size: var(--app-font-size-xl);
  font-weight: 900;
  letter-spacing: 1px;
  line-height: 1.2;
  text-transform: uppercase;
`;
const Heading = styled.h1`
  margin: 0;
  max-width: 360px;
  font-family: var(--ion-font-family-bold);
  font-size: clamp(1.5rem, 6.5vw, 1.9rem);
  font-weight: 900;
  line-height: 1.16;
  text-wrap: balance;
`;
const Introduction = styled.p`
  margin: 12px 0 0;
  font-size: var(--app-font-size-l);
  line-height: 1.45;
`;
const Cards = styled.div`
  display: grid;
  gap: 12px;
  margin-top: 18px;
`;
const Card = styled.article`
  display: grid;
  grid-template-columns: 56px minmax(0, 1fr);
  gap: 14px;
  align-items: start;
  padding: 18px 16px;
  border: var(--app-card-border);
  border-radius: 20px;
  background: var(--app-card-background);
  box-shadow: var(--app-card-shadow);

  @media (max-width: 360px) {
    grid-template-columns: 44px minmax(0, 1fr);
    gap: 12px;
    padding: 16px 12px;
  }
`;
const Artwork = styled.div`
  padding-top: 2px;
  @media (max-width: 360px) {
    img { width: 44px; height: 44px; }
  }
`;
const CardCopy = styled.div`min-width: 0;`;
const CardTitle = styled.h2`
  margin: 0 0 6px;
  color: var(--app-text-primary);
  font-size: var(--app-font-size-l);
  font-family: var(--ion-font-family-bold);
  font-weight: 900;
  line-height: 1.25;
`;
const CardText = styled.p`
  margin: 0;
  color: var(--app-text-muted);
  font-size: 1rem;
  line-height: 1.5;
`;
const Footer = styled(IonFooter)`
  flex-shrink: 0;
  border-top: var(--app-card-border);
  background: var(--app-card-background);
  padding: 12px var(--app-padding) calc(12px + max(env(safe-area-inset-bottom, 0px), var(--ion-safe-area-bottom, 0px)));
`;
const FooterContent = styled.div`
  max-width: 528px;
  margin: auto;
`;
