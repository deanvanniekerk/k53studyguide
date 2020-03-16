import React, { useContext, useEffect } from "react";

import { PurchaseContext } from "@/context";

import Router from "./Router";

const Startup: React.FC = () => {
    const purchaseService = useContext(PurchaseContext);

    useEffect(() => {
        if (purchaseService) {
            purchaseService.initialize();
            purchaseService.loadPurchase();
        }
    }, []);

    return <Router />;
};

export default Startup;
