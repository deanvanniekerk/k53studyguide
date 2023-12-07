import { PurchaseContext } from '@/context';
import React, { useContext, useEffect } from 'react';
import { useAppRate } from './hooks/useAppRate';
import Router from './Router';

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
      title: 'Would you mind rating K53 Study Guide?',
      message: 'Any feedback would be greatly appreciated. Thank you for your support!',
      cancelButtonLabel: 'No thanks',
      laterButtonLabel: 'Remind me later',
      rateButtonLabel: 'Rate it Now',
    };
    preferences.storeAppURL = {
      android: 'market://details?id=deanvniekerk.k53studyguide.app',
    };
    appRate.setPreferences(preferences);

    setTimeout(() => {
      appRate.promptForRating(false);
    }, 5000);
  }, []);

  return <Router />;
};

export default Startup;
