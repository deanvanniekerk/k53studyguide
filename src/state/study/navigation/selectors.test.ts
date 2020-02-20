import { ContentData, NavigationData } from "@/data";

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

    const contentData: ContentData = {
        "nav.introduction": [
            {
                imageName: "",
                heading: "Welcome to Learn2Drive",
                description:
                    "K53 Ninja contains everything you need to know to pass your Learner&#39;s Licence test",
            },
            {
                imageName: "",
                heading: "Tracking your progress",
                description:
                    "<ul><li>Your progress is tracked as you read throrugh each section. A green tick will appear in the navigator after you have read through all the sections.</li></ul>",
            },
        ],
        "nav.vehicleControls": [
            {
                imageName: "rules-of-the-road/vehicleControls.png",
                heading: "Vehicle Controls",
                description:
                    "<ul class='vehicle-controls numbered'><li><strong>Accelerator</strong> <span>Press the accelerator down to make the vehicle move. </li></ul>",
            },
        ],
        "nav.rulesOfTheRoad.theDriver.learnerDrivers": [
            {
                imageName: "",
                heading: "What does the Learner&#39;s Licence entitle me to do? ",
                description:
                    "If you have a learner&#39;s licence you may drive a car, subject to the following rules:<ul></ul>",
            },
            {
                imageName: "",
                heading: "How long is the Learner&#39;s Licence valid for? ",
                description: "18 months from the date on which you passed your test.",
            },
        ],
    };
    //-----------------------------------------------------------

    it("currentNavigationChildrenSelector", () => {
        const actual = selectors.currentNavigationChildrenSelector.resultFunc(
            navigationData,
            "nav.roadSignals"
        );

        expect(actual).toEqual([
            "nav.roadSignals.regulatorySignals",
            "nav.roadSignals.warningSignals",
        ]);
    });

    it("currentNavigationParentSelector", () => {
        const actual = selectors.currentNavigationParentSelector.resultFunc(
            "nav.signs.guidance.freewayDirectionSigns"
        );

        expect(actual).toEqual("nav.signs.guidance");
    });

    it("currentNavigationChildrenSelector", () => {
        const actual = selectors.currentContentItemsSelector.resultFunc(
            contentData,
            "nav.rulesOfTheRoad.theDriver.learnerDrivers"
        );

        expect(actual).toEqual(contentData["nav.rulesOfTheRoad.theDriver.learnerDrivers"]);
    });
});
