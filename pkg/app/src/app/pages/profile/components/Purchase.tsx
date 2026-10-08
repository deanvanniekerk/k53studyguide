import { IonIcon } from "@ionic/react";
import { Translate } from "@k53studyguide/shared/translation";
import { checkmarkCircle } from "ionicons/icons";
import type React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { PrimaryButton } from "@/app/components";
import { Illustration } from "@/app/components/Illustration";
import { usePremiumOffer } from "@/app/hooks/usePremiumOffer";
import PurchaseModal from "@/app/modals/PurchaseModal";
import type { RootState } from "@/state";
import { canPurchaseSelector, ownedSelector, purchaseSelector } from "@/state/purchase";
import { Section, SectionTitle } from "./";

type Props = PropsFromState;

const PurchaseComponent: React.FC<Props> = (props) => {
  const offer = usePremiumOffer("profile");

  return (
    <Section>
      <SectionTitle>
        <Translate text="account" />
      </SectionTitle>
      {!props.hasFullAccess && (
        <PremiumCard ref={offer.invitationRef}>
          <PremiumIcon>
            <Illustration name="premium-trophy" size={52} />
          </PremiumIcon>
          <PremiumCopy>
            <PremiumTitle>
              <Translate text="premiumOfferTitle" />
            </PremiumTitle>
            <PremiumText>
              <Translate text="accessTheTestInfo" />
            </PremiumText>
          </PremiumCopy>
          <PremiumButtonWrap>
            <PrimaryButton section="profile" text="goPremium" onClick={offer.open} />
          </PremiumButtonWrap>
        </PremiumCard>
      )}
      {props.hasFullAccess && (
        <PremiumCard>
          <PremiumIcon>
            <Illustration name="premium-trophy" size={52} />
          </PremiumIcon>
          <PremiumCopy>
            <PremiumTitle>
              <Translate text="premiumPurchased" />
            </PremiumTitle>
            <PremiumText>
              <Translate text="premiumPurchasedInfo" />
            </PremiumText>
          </PremiumCopy>
          <PurchasedIcon icon={checkmarkCircle} />
        </PremiumCard>
      )}
      <PurchaseModal origin="profile" isOpen={offer.isOpen} onDidDismiss={offer.dismiss} />
    </Section>
  );
};

const PremiumCard = styled.div`
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 16px;
  padding: var(--app-card-padding);
  border: 2px solid var(--app-profile-premium-border);
  border-radius: 22px;
  background: var(--app-profile-premium-background);
`;

const PremiumIcon = styled.div`
  display: grid;
  width: 56px;
  height: 56px;
  place-items: center;
  border-radius: 18px;
  background: var(--app-profile-premium-icon-background);
  color: var(--app-profile-premium-text);
`;

const PremiumCopy = styled.div`
  min-width: 0;
`;

const PremiumTitle = styled.div`
  color: var(--app-profile-premium-text);
  font-family: var(--ion-font-family-bold);
  font-size: var(--app-font-size-card-title);
  font-weight: 900;
  line-height: 1.15;
`;

const PremiumText = styled.div`
  margin-top: 4px;
  color: var(--app-profile-premium-subtext);
  font-size: var(--app-font-size-md);
  font-weight: 700;
  line-height: 1.35;
`;

const PurchasedIcon = styled(IonIcon)`
  color: var(--app-profile-status-complete);
  font-size: var(--app-font-size-xxxl);
`;

const PremiumButtonWrap = styled.div`
  grid-column: 1 / -1;
`;

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
  return {
    purchase: purchaseSelector(state),
    hasFullAccess: ownedSelector(state),
    canPurchase: canPurchaseSelector(state),
  };
};

const Purchase = connect(mapStateToProps)(PurchaseComponent);

export { Purchase };
