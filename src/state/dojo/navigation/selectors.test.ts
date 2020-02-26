import { NavigationData } from "@/data";

import { NavigationState } from "./reducer";
import * as selectors from "./selectors";

describe("state > study > navigation > selectors", () => {
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

    const defaultState: NavigationState = {
        targetNavigationKey: "key1",
    };
    //-----------------------------------------------------------

    it("targetNavigationChildrenSelector", () => {
        const actual = selectors.targetNavigationChildrenSelector.resultFunc(
            navigationData,
            "nav.roadSignals"
        );

        expect(actual).toEqual([
            "nav.roadSignals.regulatorySignals",
            "nav.roadSignals.warningSignals",
        ]);
    });

    it("targetNavigationParentSelector", () => {
        const actual = selectors.targetNavigationParentSelector.resultFunc(
            "nav.signs.guidance.freewayDirectionSigns"
        );

        expect(actual).toEqual("nav.signs.guidance");
    });

    it("targetNavigationKeySelector", () => {
        const actual = selectors.targetNavigationKeySelector.resultFunc(defaultState);

        expect(actual).toEqual(defaultState.targetNavigationKey);
    });
});
