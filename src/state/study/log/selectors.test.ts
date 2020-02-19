import { ContentData, NavigationData } from "src/data";

import { LogState, NavigationTreeItem, SeenContentKeys } from "./";
import * as selectors from "./selectors";

describe("state > study > log > selectors", () => {
    //Setup Data --------------------------------------------
    const navigationData: NavigationData = {
        nav: ["nav.child1", "nav.child2"],
        "nav.child1": ["nav.child1.child1", "nav.child1.child2"],
    };

    const contentData: ContentData = {
        "nav.child1.child1": [
            {
                imageName: "rules-of-the-road/vehicleControls.png",
                heading: "1",
                description: "description 1",
            },
        ],
        "nav.child1.child2": [
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
        "nav.child2": [
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
    };

    const defaultState: LogState = {
        seenContentKeys: {},
        lastSeenParentContentKey: "key1",
    };
    //-----------------------------------------------------------

    it("seenContentKeysSelector", () => {
        const actual = selectors.seenContentKeysSelector.resultFunc(defaultState);

        expect(actual).toEqual(defaultState.seenContentKeys);
    });

    it("seenContentKeysSelector", () => {
        const actual = selectors.lastSeenParentContentKeySelector.resultFunc(defaultState);

        expect(actual).toEqual(defaultState.lastSeenParentContentKey);
    });

    it("navigationTreeSelector", () => {
        const actual = selectors.navigationTreeSelector.resultFunc(navigationData, contentData);

        const expected: NavigationTreeItem = {
            key: "nav",
            children: [
                {
                    key: "nav.child1",
                    children: [
                        {
                            key: "nav.child1.child1",
                            children: [
                                {
                                    key: "nav.child1.child1.1",
                                    children: [],
                                },
                            ],
                        },
                        {
                            key: "nav.child1.child2",
                            children: [
                                {
                                    key: "nav.child1.child2.1",
                                    children: [],
                                },
                                {
                                    key: "nav.child1.child2.2",
                                    children: [],
                                },
                                {
                                    key: "nav.child1.child2.3",
                                    children: [],
                                },
                            ],
                        },
                    ],
                },
                {
                    key: "nav.child2",
                    children: [
                        {
                            key: "nav.child2.1",
                            children: [],
                        },
                        {
                            key: "nav.child2.2",
                            children: [],
                        },
                    ],
                },
            ],
        };

        expect(actual).toEqual(expected);
    });

    it("seenTotalsSelector", () => {
        const seenContentKeys: SeenContentKeys = {
            "nav.child1.child1.1": true,
            "nav.child1.child2.1": true,
            "nav.child1.child2.2": true,
            "nav.child2.1": true,
        };

        const navigationTreeItem: NavigationTreeItem = {
            key: "nav",
            children: [
                {
                    key: "nav.child1",
                    children: [
                        {
                            key: "nav.child1.child1",
                            children: [
                                {
                                    key: "nav.child1.child1.1",
                                    children: [],
                                },
                            ],
                        },
                        {
                            key: "nav.child1.child2",
                            children: [
                                {
                                    key: "nav.child1.child2.1",
                                    children: [],
                                },
                                {
                                    key: "nav.child1.child2.2",
                                    children: [],
                                },
                                {
                                    key: "nav.child1.child2.3",
                                    children: [],
                                },
                            ],
                        },
                    ],
                },
                {
                    key: "nav.child2",
                    children: [
                        {
                            key: "nav.child2.1",
                            children: [],
                        },
                        {
                            key: "nav.child2.2",
                            children: [],
                        },
                    ],
                },
            ],
        };

        const actual = selectors.seenTotalsSelector.resultFunc(seenContentKeys, navigationTreeItem);

        expect(actual).toEqual({
            "nav.child1.child1.1": { seen: 1, total: 1 },
            "nav.child1.child1": { seen: 1, total: 1 },
            "nav.child1.child2.1": { seen: 1, total: 1 },
            "nav.child1.child2.2": { seen: 1, total: 1 },
            "nav.child1.child2.3": { seen: 0, total: 1 },
            "nav.child1.child2": { seen: 2, total: 3 },
            "nav.child1": { seen: 3, total: 4 },
            "nav.child2.1": { seen: 1, total: 1 },
            "nav.child2.2": { seen: 0, total: 1 },
            "nav.child2": { seen: 1, total: 2 },
            nav: { seen: 4, total: 6 },
        });
    });
});
