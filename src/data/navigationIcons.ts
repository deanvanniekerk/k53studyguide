import {
    documentTextOutline,
    handLeftOutline,
    informationCircleOutline,
    shieldOutline,
    shuffleOutline,
    speedometerOutline,
    warningOutline,
} from "ionicons/icons";

import { NavigationIcons } from "./";

const navigationIcons: NavigationIcons = {
    "nav.introduction": informationCircleOutline,
    "nav.vehicleControls": speedometerOutline,
    "nav.rulesOfTheRoad": documentTextOutline,
    "nav.defensiveDriving": shieldOutline,
    "nav.roadMarkings": shuffleOutline,
    "nav.roadSignals": handLeftOutline,
    "nav.signs": warningOutline,
};

export { navigationIcons };
