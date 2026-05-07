import type React from "react";
import { useContext, useEffect } from "react";
import { useSelector } from "react-redux";
import { PurchaseContext } from "@/context";
import { themeSelector } from "@/state/settings";
import { useAppRate } from "./hooks/useAppRate";
import Router from "./Router";

const Startup: React.FC = () => {
  const purchaseService = useContext(PurchaseContext);
  const appRate = useAppRate();
  const theme = useSelector(themeSelector);

  useEffect(() => {
    const html = document.documentElement;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");

    const apply = (isDark: boolean) => {
      html.classList.toggle("ion-palette-dark", isDark);
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

    const preferences = appRate.getPreferences();
    preferences.simpleMode = true;
    preferences.customLocale = {
      title: "Would you mind rating K53 Study Guide?",
      message: "Any feedback would be greatly appreciated. Thank you for your support!",
      cancelButtonLabel: "No thanks",
      laterButtonLabel: "Remind me later",
      rateButtonLabel: "Rate it Now",
    };
    preferences.storeAppURL = {
      android: "market://details?id=deanvniekerk.k53studyguide.app",
    };
    appRate.setPreferences(preferences);

    setTimeout(() => {
      appRate.promptForRating(false);
    }, 5000);
  }, []);

  return <Router />;
};

export default Startup;
