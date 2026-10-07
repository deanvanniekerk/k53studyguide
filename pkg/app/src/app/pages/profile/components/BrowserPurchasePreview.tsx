import { IonButton } from "@ionic/react";
import { useDispatch } from "react-redux";
import type { Action, Dispatch } from "redux";
import styled from "styled-components";
import { isBrowserPreview } from "@/services/analytics/browserPreview";
import {
  recievePurchaseOrderState,
  recievePurchaseProductCanPurchase,
  recievePurchaseProductOwned,
} from "@/state/purchase";

export function BrowserPurchasePreview() {
  const dispatch = useDispatch<Dispatch<Action>>();
  if (!isBrowserPreview) return null;
  return (
    <Panel>
      <strong>Browser purchase preview</strong>
      <p>
        Purchases and restores are simulated. No charge. Use this reset to try the free experience again; your study and
        quiz progress is kept.
      </p>
      <IonButton
        onClick={() => {
          dispatch(recievePurchaseOrderState("ready"));
          dispatch(recievePurchaseProductOwned(false));
          dispatch(recievePurchaseProductCanPurchase(true));
        }}
      >
        Reset to free
      </IonButton>
    </Panel>
  );
}
const Panel = styled.div`
  margin: var(--app-page-content-top) var(--app-padding) 20px;
  padding: 16px;
  background: var(--app-card-background);
  color: var(--app-text-primary);
  border: var(--app-card-border);
  border-radius: 16px;
  p { font-size: var(--app-font-size-sm); line-height: 1.4; }
`;
