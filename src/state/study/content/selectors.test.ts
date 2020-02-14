import { ContentData } from "src/data";

import { ContentState } from "./";
import * as selectors from "./selectors";

describe("state > study > content > selectors", () => {
    //Setup Data --------------------------------------------
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

    const defaultState: ContentState = {
        contentData: contentData,
    };
    //-----------------------------------------------------------

    it("contentDataSelector", () => {
        const actual = selectors.contentDataSelector.resultFunc(defaultState);

        expect(actual).toEqual(defaultState.contentData);
    });

    it("currentNavigationItemsSelector", () => {
        const actual = selectors.currentContentItemsSelector.resultFunc(
            contentData,
            "nav.rulesOfTheRoad.theDriver.learnerDrivers"
        );

        expect(actual).toEqual(contentData["nav.rulesOfTheRoad.theDriver.learnerDrivers"]);
    });
});
