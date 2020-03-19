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
            storeAppURL: {
                android: "market://details?id=deanvniekerk.k53ninja.app",
                ios: "1503354808",
            },
        };
        AppRate.promptForRating(false);
    }, []);

    return <Router />;
};

export default Startup;
