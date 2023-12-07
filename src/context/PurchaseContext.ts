import { PurchaseService } from '@/services';
import React from 'react';

export const PurchaseContext = React.createContext<PurchaseService | null>(null);
