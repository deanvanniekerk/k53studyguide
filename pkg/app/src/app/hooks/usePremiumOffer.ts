import { useContext, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { PurchaseContext } from "@/context";
import { analytics } from "@/services/analytics";
import { DEFAULT_PREMIUM_PRODUCT_ID } from "@/services/purchase/productIds";
import type { OfferOrigin } from "@/services/purchase/types";
import { purchaseSelector } from "@/state/purchase";

const routes: Record<OfferOrigin, string> = {
  mock_test: "/test",
  profile: "/profile",
  quiz_home: "/quiz",
  quiz_results: "/quiz/results",
};

/** Track actual invitation visibility once per visit, including Ionic's cached pages. */
export function usePremiumOffer(origin: OfferOrigin, enabled = true) {
  const purchase = useSelector(purchaseSelector);
  const service = useContext(PurchaseContext);
  const { pathname } = useLocation();
  const invitationRef = useRef<HTMLDivElement>(null);
  const seenThisVisit = useRef(false);
  const [isOpen, setOpen] = useState(false);
  const active = pathname === routes[origin];
  const productId = service?.productId ?? DEFAULT_PREMIUM_PRODUCT_ID;

  useEffect(() => {
    if (!active) {
      seenThisVisit.current = false;
      setOpen(false);
    }
  }, [active]);

  useEffect(() => {
    const element = invitationRef.current;
    if (!enabled || purchase.owned || !active || !element || seenThisVisit.current) return;
    const observer = new IntersectionObserver((entries) => {
      if (seenThisVisit.current || !entries.some((entry) => entry.isIntersecting)) return;
      seenThisVisit.current = true;
      analytics.logEvent("premium_invitation_view", { offer_origin: origin, product_id: productId });
      observer.disconnect();
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [active, enabled, origin, productId, purchase.owned]);

  const open = () => {
    analytics.logEvent("premium_invitation_tap", { offer_origin: origin, product_id: productId });
    setOpen(true);
  };

  return { invitationRef, isOpen, open, dismiss: () => setOpen(false), purchase };
}
