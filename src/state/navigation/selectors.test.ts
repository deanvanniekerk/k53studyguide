import { NavigationData, NavigationIcons } from "@/data";

import { NavigationState } from "./";
import * as selectors from "./selectors";

describe("state > navigation > selectors", () => {
    //Setup Data --------------------------------------------
    const navigationData: NavigationData = {
        nav: ["nav.roadSignals", "nav.signs"],
        "nav.roadSignals": ["nav.roadSignals.regulatorySignals", "nav.roadSignals.warningSignals"],
        "nav.roadSignals.regulatorySignals": [
            "nav.roadSignals.regulatorySignals.otherRegulatorySignals",
            "nav.roadSignals.regulatorySignals.overheadLaneDirectionControlSignals",
            "nav.roadSignals.regulatorySignals.redFlashingSignals",
        ],
        "nav.roadSignals.regulatorySignals.otherRegulatorySignals": [
            "nav.roadSignals.regulatorySignals.otherRegulatorySignals.flagSignals",
            "nav.roadSignals.regulatorySignals.otherRegulatorySignals.handSignals",
        ],
        "nav.signs": [
            "nav.signs.guidance",
            "nav.signs.information",
            "nav.signs.regulatory",
            "nav.signs.warning",
        ],
        "nav.signs.guidance": [
            "nav.signs.guidance.diagrammaticSigns",
            "nav.signs.guidance.directionSigns",
            "nav.signs.guidance.freewayDirectionSigns",
        ],
    };

    const navigationIcons: NavigationIcons = {
        "nav.roadSignals": "icon1",
        "nav.signs": "ion2",
    };

    const defaultState: NavigationState = {
        navigationData: {},
        navigationIcons: navigationIcons,
    };
    //-----------------------------------------------------------

    it("navigationDataSelector", () => {
        const actual = selectors.navigationDataSelector.resultFunc(defaultState);

        expect(actual).toEqual(defaultState.navigationData);
    });

    it("rootNavigationChildrenSelector", () => {
        const actual = selectors.rootNavigationChildrenSelector.resultFunc(navigationData);

        expect(actual).toEqual(["nav.roadSignals", "nav.signs"]);
    });

    it("navigationIconsSelector", () => {
        const actual = selectors.navigationIconsSelector.resultFunc(defaultState);

        expect(actual).toEqual(navigationIcons);
    });
});
