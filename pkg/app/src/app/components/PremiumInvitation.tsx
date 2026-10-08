import { IonIcon } from "@ionic/react";
import { Translate, Translator } from "@k53studyguide/shared/translation";
import { arrowForwardOutline, closeOutline } from "ionicons/icons";
import { useDispatch, useSelector } from "react-redux";
import type { Action, Dispatch } from "redux";
import styled from "styled-components";
import { usePremiumOffer } from "@/app/hooks/usePremiumOffer";
import PurchaseModal from "@/app/modals/PurchaseModal";
import { ownedSelector } from "@/state/purchase";
import { dismissQuizHomePremium, quizHomePremiumDismissedSelector } from "@/state/settings";
import { PrimaryButton } from "./PrimaryButton";

type Props = { origin: "quiz_home" | "quiz_results"; needsPractice?: boolean; enabled?: boolean };

export function PremiumInvitation({ origin, needsPractice = false, enabled = true }: Props) {
  const owned = useSelector(ownedSelector);
  const dismissed = useSelector(quizHomePremiumDismissedSelector);
  const dispatch = useDispatch<Dispatch<Action>>();
  const dismissible = origin === "quiz_home";
  const showInvitation = enabled && !(dismissible && dismissed);
  const offer = usePremiumOffer(origin, showInvitation);
  const title =
    origin === "quiz_home" ? "premiumQuizTitle" : needsPractice ? "premiumResultsImproveTitle" : "premiumResultsTitle";
  const info =
    origin === "quiz_home" ? "premiumQuizInfo" : needsPractice ? "premiumResultsImproveInfo" : "premiumResultsInfo";

  return (
    <>
      {showInvitation && !owned && (
        <Card ref={offer.invitationRef}>
          {dismissible && (
            <Translator>
              {({ translate }) => (
                <DismissButton
                  type="button"
                  aria-label={translate({ text: "dismissPremiumInvitation" })}
                  title={translate({ text: "dismissPremiumInvitation" })}
                  onClick={() => dispatch(dismissQuizHomePremium())}
                >
                  <IonIcon icon={closeOutline} aria-hidden="true" />
                </DismissButton>
              )}
            </Translator>
          )}
          <Eyebrow $dismissible={dismissible}>
            <Translate text="premium" />
          </Eyebrow>
          <Title>
            <Translate text={title} />
          </Title>
          <Copy>
            <Translate text={info} />
          </Copy>
          <PrimaryButton section="test" text="premiumSeeOffer" rightIcon={arrowForwardOutline} onClick={offer.open} />
          <Note>
            <Translate text="premiumOneTime" />
          </Note>
        </Card>
      )}
      <PurchaseModal origin={origin} isOpen={offer.isOpen} onDidDismiss={offer.dismiss} />
    </>
  );
}

const Card = styled.div`
  position: relative;
  margin: var(--app-section-gap) var(--app-padding);
  padding: var(--app-card-padding);
  border: 2px solid var(--app-test-illustration-border);
  border-radius: 22px;
  background: var(--app-card-background);
`;
const DismissButton = styled.button`
  position: absolute;
  top: 0;
  right: 0;
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: transparent;
  color: var(--app-text-muted);
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;

  ion-icon { font-size: 20px; }
  &:hover { color: var(--app-text-primary); }
  &:focus-visible {
    outline: 2px solid var(--app-test-accent);
    outline-offset: -4px;
  }
`;
const Eyebrow = styled.div<{ $dismissible: boolean }>`
  padding-inline-end: ${(props) => (props.$dismissible ? "44px" : "0")};
  color: var(--app-test-accent);
  font-size: var(--app-font-size-sm);
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 1px;
`;
const Title = styled.h2`
  margin: 8px 0;
  color: var(--app-text-primary);
  font-size: var(--app-font-size-card-title);
  font-family: var(--ion-font-family-bold);
  font-weight: 900;
  line-height: 1.2;
`;
const Copy = styled.p`
  margin: 0 0 var(--app-stack-gap);
  color: var(--app-text-muted);
  font-size: var(--app-font-size-sm);
  line-height: 1.45;
`;
const Note = styled.p`
  margin: 12px 0 0;
  text-align: center;
  color: var(--app-text-muted);
  font-size: var(--app-font-size-sm);
`;
