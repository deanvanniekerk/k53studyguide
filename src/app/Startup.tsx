import React, { useContext, useEffect } from "react";

import { PurchaseContext } from "@/context";
import { AppRate } from "@ionic-native/app-rate";

import Router from "./Router";

const Startup: React.FC = () => {
    const purchaseService = useContext(PurchaseContext);

    useEffect(() => {
        if (purchaseService) {
            purchaseService.initialize();
        }

        //https://github.com/pushandplay/cordova-plugin-apprate
        AppRate.preferences = {
            ...AppRate.preferences,
            simpleMode: true,
            storeAppURL: {
                android: "market://details?id=deanvniekerk.k53ninja.app",
                ios: "1503354808",
            },
            customLocale: {
                title: "Would you mind rating K53 Ninja?",
                message: "Any feedback would be greatly appreciated. Thank you for your support!",
                cancelButtonLabel: "No thanks",
                laterButtonLabel: "Remind me later",
                rateButtonLabel: "Rate it Now",
            },
        };

        setTimeout(() => {
            AppRate.promptForRating(false);
        }, 5000);
    }, []);

    return <Router />;
};

export default Startup;
