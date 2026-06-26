import { Device } from "@awesome-cordova-plugins/device";
import { IonButton, IonLoading, IonModal, IonToast } from "@ionic/react";
import React, { useContext, useEffect, useState } from "react";
import { connect } from "react-redux";
import { Translate, Translator } from "react-translated";
import { bindActionCreators, type Dispatch } from "redux";
import styled from "styled-components";
import { CloseButton } from "@/app/components";
import { BookOutlineIcon, ResetIcon, TestPenIcon, YinYangIcon } from "@/app/components/icons";
import { PurchaseContext } from "@/context";
import { DEFAULT_PREMIUM_PRODUCT_ID } from "@/services";
import type { RootState } from "@/state";
import { purchaseSelector, recievePurchaseOrderState } from "@/state/purchase";
import { useAnalytics } from "../hooks/useAnalytics";
import { watermarkStyle } from "../styles";

type Props = {
  isOpen: boolean;
  onDidDismiss: () => void;
} & PropsFromState &
  PropsFromDispatch;

const PurchaseModal: React.FC<Props> = (props) => {
  const { analytics, logEvent } = useAnalytics();

  const purchaseService = useContext(PurchaseContext);

  const [showOwnedToast, setShowOwnedToast] = useState(false);
  const [showRestoreToast, setShowRestoreToast] = useState(false);
  const [showFailedToast, setShowFailedToast] = useState(false);
  const [showRestoreFailedToast, setShowRestoreFailedToast] = useState(false);
  const [showCancelledToast, setShowCancelledToast] = useState(false);
  const [restoreAttempted, setRestoreAttempted] = useState(false);

  const isPending = props.purchase.orderState === "pending";
  const premiumProductId = purchaseService?.productId ?? DEFAULT_PREMIUM_PRODUCT_ID;

  useEffect(() => {
    if (!props.isOpen) return;

    analytics.trackPromotionView({
      product_id: premiumProductId,
      price: props.purchase.price,
      offer_surface: "purchase_modal",
    });
    logEvent("PRESENT_OFFER");
  }, [analytics, logEvent, premiumProductId, props.isOpen, props.purchase.price]);

  useEffect(() => {
    if (props.purchase.orderState === "finished") {
      if (restoreAttempted) {
        setShowRestoreToast(true);
        setRestoreAttempted(false);
      } else {
        setShowOwnedToast(true);
      }
    }
    if (props.purchase.owned) {
      if (restoreAttempted) {
        setShowRestoreToast(true);
        setRestoreAttempted(false);
      }
      setTimeout(props.onDidDismiss, 500);
    }
    if (props.purchase.orderState === "error") {
      if (restoreAttempted) {
        setShowRestoreFailedToast(true);
        setRestoreAttempted(false);
      } else {
        setShowFailedToast(true);
      }
      props.recievePurchaseOrderState("ready"); //reset
    }
    if (props.purchase.orderState === "cancelled") {
      setShowCancelledToast(true);
      props.recievePurchaseOrderState("ready"); //reset
    }
  }, [props.purchase]);

  return (
    <React.Fragment>
      <Translator>
        {({ translate }) => (
          <React.Fragment>
            <IonToast
              isOpen={showOwnedToast}
              onDidDismiss={() => setShowOwnedToast(false)}
              message={translate({ text: "purchaseSuccessful" })}
              duration={5000}
              color="success"
              position="top"
            />
            <IonToast
              isOpen={showRestoreToast}
              onDidDismiss={() => setShowRestoreToast(false)}
              message={translate({ text: "purchaseRestored" })}
              duration={5000}
              color="success"
              position="top"
            />
            <IonToast
              isOpen={showCancelledToast}
              onDidDismiss={() => setShowCancelledToast(false)}
              message={translate({ text: "purchaseCancelled" })}
              duration={2500}
              color="light"
              position="top"
            />
            <IonToast
              isOpen={showFailedToast}
              onDidDismiss={() => setShowFailedToast(false)}
              message={translate({ text: "purchaseFailed" })}
              duration={5000}
              color="danger"
              position="top"
            />
            <IonToast
              isOpen={showRestoreFailedToast}
              onDidDismiss={() => setShowRestoreFailedToast(false)}
              message={translate({ text: "purchaseRestoreFailed" })}
              duration={5000}
              color="danger"
              position="top"
            />
          </React.Fragment>
        )}
      </Translator>
      <Modal mode="ios" isOpen={props.isOpen} onDidDismiss={props.onDidDismiss}>
        <Watermark />
        <Translator>
          {({ translate }) => (
            <IonLoading
              isOpen={isPending}
              message={translate({ text: "processingPayment" })}
              mode={Device.platform === "Android" ? "md" : "ios"}
            />
          )}
        </Translator>
        <Shell>
          <CloseButton onClick={() => props.onDidDismiss()} />
          <Hero>
            <PremiumBadge mode="md" fill="solid" className="button-x-small">
              <Translate text="premium" />
            </PremiumBadge>
            <Header>
              <Translate text="k53Ninja" />
            </Header>
            <HeroText>
              <Translate text="purchasePremiumFor" />
            </HeroText>
          </Hero>
          <ContentPanel>
            <Benefits>
              <Benefit>
                <BenefitIcon>
                  <TestPenIcon />
                </BenefitIcon>
                <BenefitCopy>
                  <BenefitTitle>
                    <Translate text="accessTheTest" />
                  </BenefitTitle>
                  <BenefitText>
                    <Translate text="accessTheTestInfo" />
                  </BenefitText>
                </BenefitCopy>
              </Benefit>
              <Benefit>
                <BenefitIcon>
                  <ResetIcon />
                </BenefitIcon>
                <BenefitCopy>
                  <BenefitTitle>
                    <Translate text="resetYourHistory" />
                  </BenefitTitle>
                  <BenefitText>
                    <Translate text="resetYourHistoryInfo" />
                  </BenefitText>
                </BenefitCopy>
              </Benefit>
              <Benefit>
                <BenefitIcon>
                  <YinYangIcon />
                </BenefitIcon>
                <BenefitCopy>
                  <BenefitTitle>
                    <Translate text="supportTheDev" />
                  </BenefitTitle>
                  <BenefitText>
                    <Translate text="supportTheDevInfo" />
                  </BenefitText>
                </BenefitCopy>
              </Benefit>
            </Benefits>
            <PriceCard>
              <PurchasePriceText>{props.purchase.price}</PurchasePriceText>
              <PurchaseButton
                mode="md"
                shape="round"
                fill="solid"
                disabled={!props.purchase.canPurchase || isPending || !purchaseService}
                onClick={() => {
                  setRestoreAttempted(false);
                  analytics.trackPromotionSelect({
                    product_id: premiumProductId,
                    price: props.purchase.price,
                    offer_surface: "purchase_modal",
                    cta_location: "purchase_modal_get_premium",
                  });
                  if (purchaseService) purchaseService.purchase();
                }}
              >
                <Translate text="getPremium" />
              </PurchaseButton>
              <RestoreButton
                mode="md"
                fill="clear"
                disabled={isPending || !purchaseService}
                onClick={() => {
                  setRestoreAttempted(true);
                  void purchaseService?.restore();
                }}
              >
                <Translate text="restorePurchase" />
              </RestoreButton>
            </PriceCard>
          </ContentPanel>
        </Shell>
      </Modal>
    </React.Fragment>
  );
};

const Watermark = styled(BookOutlineIcon)`
  ${watermarkStyle}
  fill: var(--app-watermark-fill);
  opacity: 0.06;
`;

const Shell = styled.div`
  min-height: 100%;
  background: var(--app-purchase-background);
`;

const Hero = styled.div`
  padding: calc(var(--app-safe-area-top) + 58px) var(--app-padding) 34px;
  background: var(--app-premium-hero-background);
  text-align: center;
`;

const Header = styled.div`
  color: var(--ion-color-light);
  font-size: var(--app-font-size-xxl);
  font-family: var(--ion-font-family-bold);
  font-weight: 900;
  line-height: 1.15;
`;

const PremiumBadge = styled(IonButton)`
  height: 30px;
  margin: 0 0 16px;
  font-size: var(--app-font-size-xs);
  font-weight: 900;
  letter-spacing: 1px;
  --background: var(--app-premium-badge-background);
  --background-hover: var(--app-premium-badge-background);
  --background-activated: var(--app-premium-badge-background);
  --box-shadow: none;
`;

const HeroText = styled.div`
  margin-top: 10px;
  color: var(--ion-color-light);
  font-size: var(--app-font-size-l);
  font-weight: 800;
  opacity: 0.82;
`;

const ContentPanel = styled.div`
  position: relative;
  z-index: 1;
  margin-top: -18px;
  padding: 0 var(--app-padding) 32px;
`;

const Benefits = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const Benefit = styled.div`
  display: flex;
  gap: 16px;
  align-items: flex-start;
  padding: 18px;
  border: var(--app-card-border);
  border-radius: 22px;
  background: var(--app-premium-panel-background);
  box-shadow: var(--app-card-shadow);
`;

const BenefitIcon = styled.div`
  display: grid;
  flex: 0 0 54px;
  width: 54px;
  height: 54px;
  place-items: center;
  border-radius: 18px;
  background: var(--app-premium-benefit-background);
  color: var(--app-test-accent);

  svg {
    width: 30px;
    height: 30px;
  }
`;

const BenefitCopy = styled.div`
  min-width: 0;
`;

const BenefitTitle = styled.div`
  color: var(--app-text-primary);
  font-family: var(--ion-font-family-bold);
  font-size: var(--app-font-size-l);
  font-weight: 900;
  line-height: 1.2;
`;

const BenefitText = styled.div`
  margin-top: 6px;
  color: var(--app-text-muted);
  font-size: var(--app-font-size-sm);
  font-weight: 700;
  line-height: 1.45;
`;

const PriceCard = styled.div`
  margin-top: 18px;
  padding: 22px;
  border: var(--app-card-border);
  border-radius: 24px;
  background: var(--app-premium-panel-background);
  box-shadow: var(--app-card-shadow), var(--app-test-action-shadow);
  text-align: center;
`;

const PurchasePriceText = styled.div`
  color: var(--app-text-primary);
  font-size: var(--app-font-size-xxxl);
  font-family: var(--ion-font-family-bold);
  font-weight: 900;
  line-height: 1;
`;

const PurchaseButton = styled(IonButton)`
  width: 100%;
  height: 58px;
  margin: 20px 0 0;
  font-size: var(--app-font-size-l);
  font-weight: 900;
  --background: var(--app-test-action-background);
  --background-hover: var(--app-test-action-background);
  --background-activated: var(--app-test-action-background);
  --border-radius: 20px;
  --box-shadow: var(--app-test-action-shadow);
`;

const RestoreButton = styled(IonButton)`
  width: 100%;
  min-height: 44px;
  margin: 10px 0 0;
  color: var(--app-text-muted);
  font-size: var(--app-font-size-md);
  font-weight: 900;
`;

const Modal = styled(IonModal)`
  --background: var(--app-purchase-background);
`;

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
  return {
    purchase: purchaseSelector(state),
  };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    ...bindActionCreators(
      {
        recievePurchaseOrderState,
      },
      dispatch,
    ),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PurchaseModal);
