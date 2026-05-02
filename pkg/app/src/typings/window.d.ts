import { AppRateOriginal } from "@awesome-cordova-plugins/app-rate";
import { compose } from "redux";

declare global {
  interface Window {
    AppRate: AppRateOriginal;
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}
