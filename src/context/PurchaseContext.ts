import React from "react";

import { PurchaseService } from "@/purchase";

export const PurchaseContext = React.createContext<PurchaseService | null>(null);
