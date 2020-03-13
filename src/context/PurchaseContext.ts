import React from "react";

import { PurchaseService } from "@/services";

export const PurchaseContext = React.createContext<PurchaseService | null>(null);
