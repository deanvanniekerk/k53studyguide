import { Capacitor } from "@capacitor/core";
import { IonButton, IonLoading, IonModal, IonToast } from "@ionic/react";
import React, { useContext, useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { Translate, Translator } from "react-translated";
import { bindActionCreators, type Dispatch } from "redux";
import styled from "styled-components";
import { CloseButton } from "@/app/components/CloseButton";
import { Illustration } from "@/app/components/Illustration";
import { PurchaseContext } from "@/context";
import { DEFAULT_PREMIUM_PRODUCT_ID } from "@/services";
import type { OfferOrigin } from "@/services/purchase/types";
import type { RootState } from "@/state";
import { purchaseSelector, recievePurchaseOrderState } from "@/state/purchase";
import { useAnalytics } from "../hooks/useAnalytics";

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

  const isLoadingStore = props.purchase.availability === "loading";
  const isUnavailable = props.purchase.availability === "unavailable";
  const isPending = props.purchase.orderState === "pending";
  const premiumProductId = purchaseService?.productId ?? DEFAULT_PREMIUM_PRODUCT_ID;

  useEffect(() => {
    if (!props.isOpen) {
      activeOperation.current = null;
      return;
    }

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

  const closeOffer = () => {
    if (isPending) return;
    analytics.logEvent("premium_offer_close", {
      offer_origin: props.origin,
      product_id: premiumProductId,
      close_reason: "close_button",
    });
    props.onDidDismiss();
  };

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
      <Modal
        mode="ios"
        isOpen={props.isOpen}
        onDidDismiss={props.onDidDismiss}
        backdropDismiss={false}
        canDismiss={!isPending}
        aria-labelledby="premium-offer-title"
      >
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
          <CloseButton onClick={closeOffer} />
          <OfferContent>
            <Hero>
              <PremiumBadge>
                <Translate text="premium" />
              </PremiumBadge>
              <Header id="premium-offer-title">
                <Translate text="premiumOfferTitle" />
              </Header>
              <HeroText>
                <Translate text="premiumOfferInfo" />
              </HeroText>
            </Hero>
            <Benefits>
              {(
                [
                  ["mock-tests", "premiumTestsBenefit", "premiumTestsDetail"],
                  ["score-breakdown", "premiumScoresBenefit", "premiumScoresDetail"],
                  ["repeat-practice", "premiumRepeatBenefit", "premiumRepeatDetail"],
                ] as const
              ).map(([icon, title, detail]) => (
                <Benefit key={title}>
                  <BenefitIcon aria-hidden="true">
                    <Illustration name={icon} size={40} />
                  </BenefitIcon>
                  <BenefitCopy>
                    <BenefitTitle>
                      <Translate text={title} />
                    </BenefitTitle>
                    <BenefitText>
                      <Translate text={detail} />
                    </BenefitText>
                  </BenefitCopy>
                </Benefit>
              ))}
              <FreeNote>
                <Translate text="premiumFreeReminder" />
              </FreeNote>
            </Benefits>
          </OfferContent>
          <PriceCard>
            <PurchasePriceText>
              {isLoadingStore ? <Translate text="premiumPriceLoading" /> : props.purchase.price}
            </PurchasePriceText>
            <PaymentNote>
              <Translate text="premiumOneTime" />
            </PaymentNote>
            {props.purchase.paymentPending && (
              <Availability role="status">
                <Translate text="premiumPaymentPending" />
              </Availability>
            )}
            {!props.purchase.canPurchase && !props.purchase.owned && !props.purchase.paymentPending && (
              <Availability role="status">
                <Translate text={isLoadingStore ? "premiumPriceLoading" : "premiumUnavailable"} />
              </Availability>
            )}
            {isUnavailable && (
              <RestoreButton
                disabled={isPending || !purchaseService || undefined}
                onClick={() => void purchaseService?.initialize(true)}
              >
                <Translate text="premiumRetry" />
              </RestoreButton>
            )}
            {import.meta.env.DEV && Capacitor.getPlatform() === "web" && (
              <PaymentNote>Browser preview · simulated price and purchase</PaymentNote>
            )}
            <PurchaseButton
              mode="md"
              shape="round"
              fill="solid"
              disabled={
                !props.purchase.canPurchase ||
                props.purchase.paymentPending ||
                isUnavailable ||
                isLoadingStore ||
                isPending ||
                !purchaseService ||
                undefined
              }
              onClick={() => {
                if (isPending || props.purchase.paymentPending || !props.purchase.canPurchase || isLoadingStore) return;
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
                if (isPending) return;
                activeOperation.current = "restore";
                void purchaseService?.restore(props.origin);
              }}
            >
              <Translate text="restorePurchase" />
            </RestoreButton>
          </PriceCard>
        </Shell>
      </Modal>
    </React.Fragment>
  );
};

const Shell = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  overflow: hidden;
  background: var(--app-purchase-background);
`;
const OfferContent = styled.div`
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding-top: calc(var(--app-safe-area-top) + 54px);
`;
const Hero = styled.div`
  padding: 8px var(--app-padding) 16px;
`;
const Header = styled.h1`
  margin: 8px 0 0;
  color: var(--app-text-primary);
  font-size: var(--app-font-size-xxl);
  font-family: var(--ion-font-family-bold);
  font-weight: 900;
  line-height: 1.12;
`;
const PremiumBadge = styled.span`
  color: var(--app-test-accent);
  font-size: var(--app-font-size-sm);
  font-weight: 900;
  letter-spacing: 1px;
  text-transform: uppercase;
`;
const HeroText = styled.p`
  margin: 10px 0 0;
  color: var(--app-text-muted);
  font-size: var(--app-font-size-md);
  line-height: 1.45;
`;
const Benefits = styled.div`
  padding: 0 var(--app-padding) 16px;
`;
const Benefit = styled.div`
  display: flex;
  gap: 12px;
  align-items: flex-start;
  padding: 16px 0;
  border-top: var(--app-card-border);
`;
const BenefitIcon = styled.div`
  flex: 0 0 40px;
`;
const BenefitCopy = styled.div`min-width: 0;`;
const BenefitTitle = styled.h2`
  margin: 0;
  color: var(--app-text-primary);
  font-family: var(--ion-font-family-bold);
  font-size: var(--app-font-size-md);
  font-weight: 900;
  line-height: 1.3;
`;
const BenefitText = styled.p`
  margin: 5px 0 0;
  color: var(--app-text-muted);
  font-size: var(--app-font-size-sm);
  line-height: 1.45;
`;
const FreeNote = styled.p`
  color: var(--app-text-muted);
  font-size: var(--app-font-size-sm);
  line-height: 1.45;
`;
const PriceCard = styled.div`
  flex: 0 0 auto;
  padding: 14px var(--app-padding) calc(12px + env(safe-area-inset-bottom, 0px));
  border-top: var(--app-card-border);
  background: var(--app-premium-panel-background);
  text-align: center;
`;
const PurchasePriceText = styled.div`
  color: var(--app-text-primary);
  font-size: var(--app-font-size-xl);
  font-family: var(--ion-font-family-bold);
  font-weight: 900;
  line-height: 1.2;
`;
const PaymentNote = styled.p`
  margin: 4px 0 0;
  color: var(--app-text-muted);
  font-size: var(--app-font-size-sm);
  line-height: 1.35;
`;
const Availability = styled.p`
  margin: 8px 0;
  color: var(--app-text-primary);
  font-size: var(--app-font-size-sm);
`;
const PurchaseButton = styled(IonButton)`
  width: 100%;
  min-height: 54px;
  height: auto;
  margin: 12px 0 0;
  white-space: normal;
  font-size: var(--app-font-size-l);
  font-weight: 900;
  --padding-top: 12px;
  --padding-bottom: 12px;
  --background: var(--app-test-action-background);
  --background-hover: var(--app-test-action-background);
  --background-activated: var(--app-test-action-background);
  --border-radius: 18px;
  --box-shadow: var(--app-test-action-shadow);
`;
const RestoreButton = styled(IonButton)`
  width: 100%;
  min-height: 44px;
  height: auto;
  white-space: normal;
  margin: 4px 0 0;
  color: var(--app-text-muted);
  font-size: var(--app-font-size-sm);
  font-weight: 800;
`;
const Modal = styled(IonModal)`
  --background: var(--app-purchase-background);
  @media (min-width: 768px) {
    --width: min(520px, calc(100vw - 48px));
    --height: min(780px, calc(100dvh - 48px));
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
