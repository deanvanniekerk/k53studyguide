import { ContentData, NavigationData, NavigationIcons } from "@/data";
import { NavigationState } from "@/state/study/navigation";
import * as selectors from "@/state/study/navigation/selectors";

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

    const navigationIcons: NavigationIcons = {
        "nav.roadSignals": {
            type: "font-awesome",
            name: "hand-stop-o",
        },
        "nav.signs": {
            type: "feather",
            name: "alert-triangle",
        },
    };

    const contentData: ContentData = {
        "nav.roadSignals.warningSignals": [
            {
                imageName: "",
                heading: "1",
                description: "description 1",
            },
            {
                imageName: "",
                heading: "2",
                description: "description 2",
            },
        ],
        "nav.roadSignals.regulatorySignals.otherRegulatorySignals.flagSignals": [
            {
                imageName: "rules-of-the-road/vehicleControls.png",
                heading: "1",
                description: "description 1",
            },
        ],
        "nav.roadSignals.regulatorySignals.otherRegulatorySignals.handSignals": [
            {
                imageName: "",
                heading: "1",
                description: "description 1",
            },
            {
                imageName: "",
                heading: "2",
                description: "description 2",
            },
            {
                imageName: "",
                heading: "3",
                description: "description 3",
            },
        ],
    };

    const defaultState: NavigationState = {
        navigationData: navigationData,
        currentNavigationKey: "nav",
        navigationIcons: navigationIcons,
    };
    //-----------------------------------------------------------

    it("navigationDataSelector", () => {
        const actual = selectors.navigationDataSelector.resultFunc(defaultState);

        expect(actual).toEqual(defaultState.navigationData);
    });

    it("currentNavigationItemsSelector", () => {
        const actual = selectors.currentNavigationItemsSelector.resultFunc(
            navigationData,
            "nav.roadSignals"
        );

        expect(actual).toEqual([
            "nav.roadSignals.regulatorySignals",
            "nav.roadSignals.warningSignals",
        ]);
    });

    it("rootNavigationItemsSelector", () => {
        const actual = selectors.rootNavigationItemsSelector.resultFunc(navigationData);

        expect(actual).toEqual(["nav.roadSignals", "nav.signs"]);
    });

    it("navigationIconsSelector", () => {
        const actual = selectors.navigationIconsSelector.resultFunc(defaultState);

        expect(actual).toEqual(navigationIcons);
    });

    it("currentNavigationBreadcrumbSelector", () => {
        const actual = selectors.currentNavigationBreadcrumbSelector.resultFunc(
            navigationData,
            "nav.signs.guidance.freewayDirectionSigns"
        );

        expect(actual).toEqual([
            "nav",
            "nav.signs",
            "nav.signs.guidance",
            "nav.signs.guidance.freewayDirectionSigns",
        ]);
    });
});
