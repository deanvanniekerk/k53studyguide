/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";
/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";
/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";
/* Theme variables */
import "./theme/variables.css";
/* Global CSS */
import "./global.css";

import React from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import { configureStore } from "@/state/configureStore";
import { IonApp, setupConfig } from "@ionic/react";

import Startup from "./app/Startup";
import { PurchaseContext } from "./context";

const { store, purchaseService, persistor } = configureStore();

setupConfig({
    mode: "md",
});

const App: React.FC = () => (
    <IonApp>
        <Provider store={store}>
            <PurchaseContext.Provider value={purchaseService}>
                <PersistGate loading={null} persistor={persistor}>
                    <Startup />
                </PersistGate>
            </PurchaseContext.Provider>
        </Provider>
    </IonApp>
);

export default App;
