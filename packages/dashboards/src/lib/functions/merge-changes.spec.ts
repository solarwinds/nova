import moment from "moment/moment";

import { KpiComponent } from "../components/kpi-widget/kpi.component";
import { DEFAULT_PIZZAGNA_ROOT } from "../services/types";

import { IValueChange, mergeChanges } from "./merge-changes";
import { MERGED, TILES_MOCK, TILES_PROVIDERS_MOCK } from "./spec-mocks";

describe("merge changes", () => {
    it("merges primitive values", () => {
        const changes: IValueChange[] = [
            {
                previousValue: 1,
                currentValue: 2,
            },
        ];

        const result = mergeChanges(1, ...changes);

        expect(result).toBe(2);
    });

    it("respects priority of changes - last one wins", () => {
        const changes: IValueChange[] = [
            {
                previousValue: 1,
                currentValue: 2,
            },
            {
                previousValue: 3,
                currentValue: 3,
            },
        ];

        const result = mergeChanges(1, ...changes);

        expect(result).toBe(3);
    });

    it("merges arrays by using the value with highest priority", () => {
        const changes: IValueChange[] = [
            {
                previousValue: [1],
                currentValue: [2],
            },
            {
                previousValue: [3],
                currentValue: [3],
            },
        ];

        const result = mergeChanges([1], ...changes);

        expect(result).toEqual([3]);
    });

    describe("objects", () => {
        it("doesn't perform any change when the object reference remains unchanged", () => {
            const a = { a: 1 };
            const changes: IValueChange[] = [
                {
                    previousValue: a,
                    currentValue: a,
                },
            ];

            const current = { b: 1 };
            const result = mergeChanges(current, ...changes);

            expect(result).toBe(current);
        });

        it("changes references only to objects along the path upward", () => {
            const a = { a: 1 };
            const b = { b: 1 };

            const c1 = {};
            const d1 = {};

            const c2 = { c: 1, merge: a };
            const d2 = { d: 1, merge: b };

            const result1: any = mergeChanges(
                {},
                { previousValue: c1, currentValue: c2 },
                { previousValue: d1, currentValue: d2 }
            );

            const c3 = { c: 2, merge: a };
            const d3 = { d: 2, merge: b };

            const result2: any = mergeChanges(
                result1,
                { previousValue: c2, currentValue: c3 },
                { previousValue: d2, currentValue: d3 }
            );

            expect(result1.merge).toEqual(result2.merge);
            expect(result1).not.toEqual(result2);
        });

        it("handles real world example", () => {
            const structure: any = {
                [DEFAULT_PIZZAGNA_ROOT]: {
                    id: DEFAULT_PIZZAGNA_ROOT,
                    componentType: "FlexLayoutComponent",
                    properties: {
                        direction: "column",
                        nodes: ["header", "grid-layout"],
                    },
                },
                header: {
                    id: "header",
                    componentType: "WidgetHeaderComponent",
                    properties: {
                        widgetTitle: "KPI Widget!",
                        subtitle: "A bunch of number boxes",
                    },
                },
                "grid-layout": {
                    id: "grid-layout",
                    componentType: "GridLayoutComponent",
                    properties: {
                        elementClass: "flex-grow-1 m-3",
                    },
                },
            };
            const configuration: any = {
                header: {
                    properties: {
                        widgetTitle: "KPI Widget!",
                        subtitle: "A bunch of number boxes",
                    },
                },
                "grid-layout": {
                    properties: {
                        nodes: ["kpi1", "kpi2"],
                    },
                },
                kpi1: {
                    id: "kpi1",
                    componentType: KpiComponent.lateLoadKey,
                    properties: {
                        elementClass: "flex-grow-1",
                    },
                },
                kpi2: {
                    id: "kpi2",
                    componentType: KpiComponent.lateLoadKey,
                    properties: {
                        elementClass: "flex-grow-1",
                    },
                },
            };
            const data: any = {
                kpi1: {
                    properties: {
                        widgetData: {
                            id: "totalStorage",
                            value: 50.4,
                            units: "EB",
                            description: "Total storage",
                            // backgroundColor: null,
                            // textColor: null,
                        },
                    },
                },
                kpi2: {
                    properties: {
                        widgetData: {
                            id: "downloadSpeed",
                            value: 30,
                            units: "MB/S",
                            description: "Download speed",
                            backgroundColor: "yellow",
                            textColor: "black",
                        },
                    },
                },
            };

            const result: any = mergeChanges(
                {},
                ...[structure, configuration, data].map((x) => ({
                    previousValue: undefined,
                    currentValue: x,
                }))
            );

            expect(result.kpi1.componentType).toBeDefined();
        });

        it("handles moment", () => {
            const moment1 = moment().add(1, "month");
            const moment2 = moment().add(2, "months");

            const result1: any = mergeChanges(
                {},
                { previousValue: undefined, currentValue: moment1 },
                { previousValue: undefined, currentValue: moment2 }
            );

            expect(result1).toBe(moment2);
        });
    });

    describe("arrays", () => {
        it("should merge changes for object[] type", () => {
            const changes: IValueChange[] = [
                {
                    currentValue: TILES_PROVIDERS_MOCK,
                    previousValue: undefined,
                },
                {
                    currentValue: TILES_MOCK,
                    previousValue: undefined,
                },
            ];

            const result: any[] = mergeChanges([], ...changes);

            expect(result).toEqual(MERGED);
        });
    });
});
