import { Capacitor } from "@capacitor/core";
import { IonButton, IonLoading, IonModal, IonToast } from "@ionic/react";
import React, { useContext, useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { Translate, Translator } from "react-translated";
import { bindActionCreators, type Dispatch } from "redux";
import styled from "styled-components";
import { CloseButton } from "@/app/components";
import { BookOutlineIcon, ResetIcon, TestPenIcon, YinYangIcon } from "@/app/components/icons";
import { PurchaseContext } from "@/context";
import { DEFAULT_PREMIUM_PRODUCT_ID } from "@/services";
import type { OfferOrigin } from "@/services/purchase/types";
import type { RootState } from "@/state";
import { purchaseSelector, recievePurchaseOrderState } from "@/state/purchase";
import { useAnalytics } from "../hooks/useAnalytics";
import { watermarkStyle } from "../styles";

type Props = {
  isOpen: boolean;
  origin: OfferOrigin;
  onDidDismiss: () => void;
} & PropsFromState &
  PropsFromDispatch;

const PurchaseModal: React.FC<Props> = (props) => {
  const { analytics } = useAnalytics();

  const purchaseService = useContext(PurchaseContext);

  const [showOwnedToast, setShowOwnedToast] = useState(false);
  const [showRestoreToast, setShowRestoreToast] = useState(false);
  const [showFailedToast, setShowFailedToast] = useState(false);
  const [showRestoreFailedToast, setShowRestoreFailedToast] = useState(false);
  const [showCancelledToast, setShowCancelledToast] = useState(false);
  const activeOperation = useRef<"purchase" | "restore" | null>(null);

  const isPending = props.purchase.orderState === "pending";
  const premiumProductId = purchaseService?.productId ?? DEFAULT_PREMIUM_PRODUCT_ID;

  useEffect(() => {
    if (!props.isOpen) return;

    return purchaseService?.offerOpened(props.origin);
  }, [props.isOpen, props.origin, purchaseService]);

  useEffect(() => {
    const operation = activeOperation.current;
    if (!operation) return;

    const { orderState, owned } = props.purchase;
    const purchased = operation === "purchase" && orderState === "finished";
    const restored = operation === "restore" && orderState === "ready" && owned;
    if (!purchased && !restored && orderState !== "error" && orderState !== "cancelled") return;

    // A saved terminal state is not a new checkout. Only its initiating modal
    // consumes the result, once, even when other pages are mounted.
    activeOperation.current = null;
    if (purchased) setShowOwnedToast(true);
    if (restored) setShowRestoreToast(true);
    if (orderState === "error") {
      if (operation === "restore") setShowRestoreFailedToast(true);
      else setShowFailedToast(true);
    }
    if (orderState === "cancelled") setShowCancelledToast(true);
    if (orderState !== "ready") props.recievePurchaseOrderState("ready");
  }, [props.purchase, props.recievePurchaseOrderState]);

  useEffect(() => {
    if (!props.isOpen || !props.purchase.owned) return;
    const timeout = setTimeout(props.onDidDismiss, 500);
    return () => clearTimeout(timeout);
  }, [props.isOpen, props.purchase.owned, props.onDidDismiss]);

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
              mode={Capacitor.getPlatform() === "android" ? "md" : "ios"}
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
                disabled={!props.purchase.canPurchase || isPending || !purchaseService || undefined}
                onClick={() => {
                  activeOperation.current = "purchase";
                  analytics.trackPromotionSelect({
                    product_id: premiumProductId,
                    price: props.purchase.price,
                    offer_surface: "purchase_modal",
                    offer_origin: props.origin,
                    cta_location: "purchase_modal_get_premium",
                  });
                  if (purchaseService) purchaseService.purchase(props.origin);
                }}
              >
                <Translate text="getPremium" />
              </PurchaseButton>
              <RestoreButton
                mode="md"
                fill="clear"
                disabled={isPending || !purchaseService || undefined}
                onClick={() => {
                  activeOperation.current = "restore";
                  void purchaseService?.restore(props.origin);
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
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 100%;
  overflow: hidden;
  background: var(--app-purchase-background);
`;

const Hero = styled.div`
  flex: 0 0 auto;
  padding: calc(var(--app-safe-area-top) + 58px) var(--app-padding) 34px;
  background: var(--app-premium-hero-background);
  text-align: center;

  @media (max-height: 520px) {
    padding: calc(var(--app-safe-area-top) + 42px) var(--app-padding) 18px;
  }
`;

const Header = styled.div`
  color: var(--ion-color-light);
  font-size: var(--app-font-size-xxl);
  font-family: var(--ion-font-family-bold);
  font-weight: 900;
  line-height: 1.15;

  @media (max-height: 520px) {
    font-size: var(--app-font-size-xl);
  }
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

  @media (max-height: 520px) {
    height: 26px;
    margin-bottom: 10px;
  }
`;

const HeroText = styled.div`
  margin-top: 10px;
  color: var(--ion-color-light);
  font-size: var(--app-font-size-l);
  font-weight: 800;
  opacity: 0.82;

  @media (max-height: 520px) {
    margin-top: 6px;
    font-size: var(--app-font-size-md);
  }
`;

const ContentPanel = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  min-height: 0;
  margin-top: -18px;
  overflow: hidden;
  padding: 0 var(--app-padding) calc(32px + env(safe-area-inset-bottom, 0px));

  @media (max-height: 520px) {
    margin-top: -4px;
    padding-bottom: calc(16px + env(safe-area-inset-bottom, 0px));
  }
`;

const Benefits = styled.div`
  display: flex;
  flex: 0 1 auto;
  flex-direction: column;
  gap: 14px;
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding-bottom: 2px;

  @media (max-height: 520px) {
    gap: 8px;
  }
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

  @media (max-height: 520px) {
    align-items: center;
    gap: 10px;
    padding: 10px;
    border-radius: 18px;
  }
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

  @media (max-height: 520px) {
    flex-basis: 44px;
    width: 44px;
    height: 44px;
    border-radius: 14px;

    svg {
      width: 24px;
      height: 24px;
    }
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

  @media (max-height: 520px) {
    font-size: var(--app-font-size-md);
  }
`;

const BenefitText = styled.div`
  margin-top: 6px;
  color: var(--app-text-muted);
  font-size: var(--app-font-size-sm);
  font-weight: 700;
  line-height: 1.45;

  @media (max-height: 520px) {
    display: none;
  }
`;

const PriceCard = styled.div`
  flex: 0 0 auto;
  margin-top: 18px;
  padding: 22px;
  border: var(--app-card-border);
  border-radius: 24px;
  background: var(--app-premium-panel-background);
  box-shadow: var(--app-card-shadow), var(--app-test-action-shadow);
  text-align: center;

  @media (max-height: 520px) {
    margin-top: 10px;
    padding: 14px;
    border-radius: 20px;
  }
`;

const PurchasePriceText = styled.div`
  color: var(--app-text-primary);
  font-size: var(--app-font-size-xxxl);
  font-family: var(--ion-font-family-bold);
  font-weight: 900;
  line-height: 1;

  @media (max-height: 520px) {
    font-size: var(--app-font-size-xxl);
  }
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

  @media (max-height: 520px) {
    height: 50px;
    margin-top: 12px;
    font-size: var(--app-font-size-md);
  }
`;

const RestoreButton = styled(IonButton)`
  width: 100%;
  min-height: 44px;
  margin: 10px 0 0;
  color: var(--app-text-muted);
  font-size: var(--app-font-size-md);
  font-weight: 900;

  @media (max-height: 520px) {
    min-height: 36px;
    margin-top: 6px;
    font-size: var(--app-font-size-sm);
  }
`;

const Modal = styled(IonModal)`
  --background: var(--app-purchase-background);

  @media (min-width: 768px) {
    --width: min(var(--app-readable-content-max-width), calc(100vw - 48px));
    --height: min(860px, calc(100vh - 48px));
    --border-radius: 24px;
  }
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
