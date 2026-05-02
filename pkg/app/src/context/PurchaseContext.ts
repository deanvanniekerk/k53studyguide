import React from "react";
import type { PurchaseService } from "@/services";

export const PurchaseContext = React.createContext<PurchaseService | null>(null);
