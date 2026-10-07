import { arrowForwardOutline } from "ionicons/icons";
import { useSelector } from "react-redux";
import { Translate } from "react-translated";
import styled from "styled-components";
import { usePremiumOffer } from "@/app/hooks/usePremiumOffer";
import PurchaseModal from "@/app/modals/PurchaseModal";
import { ownedSelector } from "@/state/purchase";
import { PrimaryButton } from "./PrimaryButton";

type Props = { origin: "quiz_home" | "quiz_results"; needsPractice?: boolean; enabled?: boolean };

export function PremiumInvitation({ origin, needsPractice = false, enabled = true }: Props) {
  const owned = useSelector(ownedSelector);
  const offer = usePremiumOffer(origin, enabled);
  const title =
    origin === "quiz_home" ? "premiumQuizTitle" : needsPractice ? "premiumResultsImproveTitle" : "premiumResultsTitle";
  const info =
    origin === "quiz_home" ? "premiumQuizInfo" : needsPractice ? "premiumResultsImproveInfo" : "premiumResultsInfo";

  return (
    <>
      {enabled && !owned && (
        <Card ref={offer.invitationRef}>
          <Eyebrow>
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
  margin: 20px var(--app-padding) 28px;
  padding: 16px;
  border: 2px solid var(--app-test-illustration-border);
  border-radius: 22px;
  background: var(--app-card-background);
`;
const Eyebrow = styled.div`
  color: var(--app-test-accent);
  font-size: var(--app-font-size-sm);
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 1px;
`;
const Title = styled.h2`
  margin: 8px 0;
  color: var(--app-text-primary);
  font-size: var(--app-font-size-xl);
  font-family: var(--ion-font-family-bold);
  font-weight: 900;
  line-height: 1.2;
`;
const Copy = styled.p`
  margin: 0 0 16px;
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
