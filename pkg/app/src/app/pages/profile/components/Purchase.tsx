import { IonIcon } from "@ionic/react";
import { checkmarkCircle, trophy } from "ionicons/icons";
import type React from "react";
import { useState } from "react";
import { connect } from "react-redux";
import { Translate } from "react-translated";
import styled from "styled-components";
import { PrimaryButton } from "@/app/components";
import PurchaseModal from "@/app/modals/PurchaseModal";
import type { RootState } from "@/state";
import { canPurchaseSelector, ownedSelector, purchaseSelector } from "@/state/purchase";
import { Section, SectionTitle } from "./";

type Props = PropsFromState;

const PurchaseComponent: React.FC<Props> = (props) => {
  const [purchaseModalVisible, setPurchaseModalVisible] = useState(false);

  return (
    <Section>
      <SectionTitle>
        <Translate text="account" />
      </SectionTitle>
      {!props.hasFullAccess && (
        <PremiumCard>
          <PremiumIcon>
            <IonIcon icon={trophy} />
          </PremiumIcon>
          <PremiumCopy>
            <PremiumTitle>
              <Translate text="premiumPackageRequired" />
            </PremiumTitle>
            <PremiumText>
              <Translate text="accessTheArenaInfo" />
            </PremiumText>
          </PremiumCopy>
          <PremiumButtonWrap>
            <PrimaryButton
              section="profile"
              text="goPremium"
              disabled={!props.canPurchase}
              onClick={() => setPurchaseModalVisible(true)}
            />
          </PremiumButtonWrap>
        </PremiumCard>
      )}
      {props.hasFullAccess && (
        <PremiumCard>
          <PremiumIcon>
            <IonIcon icon={trophy} />
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
      <PurchaseModal
        isOpen={purchaseModalVisible}
        onDidDismiss={() => {
          setPurchaseModalVisible(false);
        }}
      />
    </Section>
  );
};

const PremiumCard = styled.div`
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 16px;
  padding: 20px 18px;
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

  ion-icon {
    font-size: var(--app-font-size-xxl);
  }
`;

const PremiumCopy = styled.div`
  min-width: 0;
`;

const PremiumTitle = styled.div`
  color: var(--app-profile-premium-text);
  font-family: var(--ion-font-family-bold);
  font-size: var(--app-font-size-xl);
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
