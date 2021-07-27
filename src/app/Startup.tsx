import React, { useContext, useEffect } from "react";

import { PurchaseContext } from "@/context";

import Router from "./Router";
import { useAppRate } from "./hooks/useAppRate";

const Startup: React.FC = () => {
    const purchaseService = useContext(PurchaseContext);
    const appRate = useAppRate();

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

        //https://github.com/pushandplay/cordova-plugin-apprate
        // appRate.preferences = {
        //     ...appRate.preferences,
        //     simpleMode: true,
        //     storeAppURL: {
        //         android: "market://details?id=deanvniekerk.k53studyguide.app",
        //         ios: "1503354808",
        //     },
        //     customLocale: {
        //         title: "Would you mind rating K53 Study Guide?",
        //         message: "Any feedback would be greatly appreciated. Thank you for your support!",
        //         cancelButtonLabel: "No thanks",
        //         laterButtonLabel: "Remind me later",
        //         rateButtonLabel: "Rate it Now",
        //     },
        // };

        setTimeout(() => {
            appRate.promptForRating(false);
        }, 5000);
    }, []);

    return <Router />;
};

export default Startup;
