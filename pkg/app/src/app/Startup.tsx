import { Capacitor } from "@capacitor/core";
import type React from "react";
import { useContext, useEffect, useLayoutEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { UnknownAction } from "redux";
import type { ThunkDispatch } from "redux-thunk";
import { PurchaseContext } from "@/context";
import { analytics } from "@/services/analytics";
import type { RootState } from "@/state";
import { ownedSelector } from "@/state/purchase";
import { displayModeSelector, languageSelector, themeSelector } from "@/state/settings";
import { ensureLocale } from "@/state/translations";
import { usePurchaseRecovery } from "./hooks/usePurchaseRecovery";
import Router from "./Router";

const Startup: React.FC = () => {
  const dispatch = useDispatch<ThunkDispatch<RootState, unknown, UnknownAction>>();
  const purchaseService = useContext(PurchaseContext);
  const displayMode = useSelector(displayModeSelector);
  const theme = useSelector(themeSelector);
  const language = useSelector(languageSelector);
  const hasFullAccess = useSelector(ownedSelector);
  usePurchaseRecovery(purchaseService);

  useEffect(() => {
    void dispatch(ensureLocale(language));
    document.documentElement.lang = language;
  }, [dispatch, language]);

  useLayoutEffect(() => {
    const isWeb = Capacitor.getPlatform() === "web";
    document.documentElement.dataset.platform = isWeb ? "web" : "native";
    if (isWeb)
      document
        .querySelector('meta[name="viewport"]')
        ?.setAttribute("content", "viewport-fit=cover, width=device-width, initial-scale=1.0");
  }, []);

  useLayoutEffect(() => {
    // Measure Study in Comfortable before saving a default for this device.
    document.documentElement.dataset.displayMode = displayMode ?? "comfortable";
  }, [displayMode]);

  useEffect(() => {
    const html = document.documentElement;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");

    const apply = (isDark: boolean) => {
      html.classList.toggle("ion-palette-dark", isDark);
      let color = document.querySelector('meta[name="theme-color"]');
      if (!color) {
        color = document.createElement("meta");
        color.setAttribute("name", "theme-color");
        document.head.append(color);
      }
      color.setAttribute("content", isDark ? "#13121f" : "#fafaf7");
    };

    if (theme === "dark") {
      apply(true);
      return;
    }
    if (theme === "light") {
      apply(false);
      return;
    }
    // "system" — follow OS preference
    apply(mq.matches);
    const handler = (e: MediaQueryListEvent) => apply(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [theme]);

  useEffect(() => {
    if (purchaseService) {
      purchaseService.initialize();
    }

    analytics.trackAppOpen({
      language,
      theme,
      premium_status: hasFullAccess ? "premium" : "free",
    });
  }, []);

  return <Router />;
};

export default Startup;
