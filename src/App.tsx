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
import { Provider as TranslationProvider } from "react-translated";
import { translations } from "src/data";
import { configureStore } from "src/state/configureStore";

import { IonApp } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";

import Routes from "./app/Routes";

const { store } = configureStore();

const App: React.FC = () => (
    <IonApp>
        <Provider store={store}>
            <TranslationProvider language="en" translation={translations}>
                <IonReactRouter>
                    <Routes />
                </IonReactRouter>
            </TranslationProvider>
        </Provider>
    </IonApp>
);

export default App;
