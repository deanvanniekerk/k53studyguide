import { NavigationData, QuestionData, QuestionItem } from "@/data";
import { NavigationTreeItem } from "@/state/navigation";

import { QuesionsSuccesfullyAnsweredDates } from "../log";
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

    describe("correctlyAnsweredQuestionsTotalsSelector", () => {
        //Setup Data --------------------------------------------
        const questions: QuestionItem[] = Array.from(new Array(10), (q, n) => ({
            id: `${n}`,
            answer: "B",
            text: `Question ${n}:`,
            option: [
                {
                    id: "A",
                    value: "Answer A.",
                },
                {
                    id: "B",
                    value: "Answer B.",
                },
            ],
        }));

        const questionData: QuestionData = {
            "root.child1": [questions[0], questions[1]],
            "root.child2": [questions[2]],
            "root.child3.child1": [questions[3], questions[4], questions[5], questions[6]],
            "root.child4": [questions[7], questions[8], questions[9]],
        };

        const navigationTreeItem: NavigationTreeItem = {
            key: "root",
            children: [
                {
                    key: "root.child1",
                    children: [],
                },
                {
                    key: "root.child2",
                    children: [],
                },
                {
                    key: "root.child3",
                    children: [
                        {
                            key: "root.child3.child1",
                            children: [],
                        },
                    ],
                },
                {
                    key: "root.child4",
                    children: [],
                },
            ],
        };

        //-------------------------------------------------------

        it("no correct answers", () => {
            const quesionsSuccesfullyAnsweredDates: QuesionsSuccesfullyAnsweredDates = {};

            const actual = selectors.correctlyAnsweredQuestionsTotalsSelector.resultFunc(
                questionData,
                quesionsSuccesfullyAnsweredDates,
                navigationTreeItem
            );

            const expected = {
                root: {
                    correctlyAnswered: 0,
                    total: 10,
                },
                "root.child1": {
                    correctlyAnswered: 0,
                    total: 2,
                },
                "root.child2": {
                    correctlyAnswered: 0,
                    total: 1,
                },
                "root.child3": {
                    correctlyAnswered: 0,
                    total: 4,
                },
                "root.child3.child1": {
                    correctlyAnswered: 0,
                    total: 4,
                },
                "root.child4": {
                    correctlyAnswered: 0,
                    total: 3,
                },
            };

            expect(actual).toEqual(expected);
        });
    });
});
