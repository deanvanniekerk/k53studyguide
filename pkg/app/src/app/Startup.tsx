import type React from "react";
import { useContext, useEffect } from "react";
import { useSelector } from "react-redux";
import { PurchaseContext } from "@/context";
import { analytics } from "@/services/analytics";
import { ownedSelector } from "@/state/purchase";
import { languageSelector, themeSelector } from "@/state/settings";
import Router from "./Router";

const Startup: React.FC = () => {
  const purchaseService = useContext(PurchaseContext);
  const theme = useSelector(themeSelector);
  const language = useSelector(languageSelector);
  const hasFullAccess = useSelector(ownedSelector);

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

    analytics.trackAppOpen({
      language,
      theme,
      premium_status: hasFullAccess ? "premium" : "free",
    });
  }, []);

  return <Router />;
};

export default Startup;
