import { IonButton } from "@ionic/react";
import { Translate } from "@k53studyguide/shared/translation";
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
      <strong>
        <Translate text="browserPurchasePreview" />
      </strong>
      <p>
        <Translate text="browserPurchaseInfo" />
      </p>
      <IonButton
        onClick={() => {
          dispatch(recievePurchaseOrderState("ready"));
          dispatch(recievePurchaseProductOwned(false));
          dispatch(recievePurchaseProductCanPurchase(true));
        }}
      >
        <Translate text="resetToFree" />
      </IonButton>
    </Panel>
  );
}
const Panel = styled.div`
  margin: var(--app-page-content-top) var(--app-padding) var(--app-stack-gap);
  padding: var(--app-card-padding);
  background: var(--app-card-background);
  color: var(--app-text-primary);
  border: var(--app-card-border);
  border-radius: 16px;
  p { font-size: var(--app-font-size-sm); line-height: 1.4; }
`;
