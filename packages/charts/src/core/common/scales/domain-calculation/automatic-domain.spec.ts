import { axisLeft } from "d3-axis";

import { IBarAccessors } from "../../../../renderers/bar/accessors/bar-accessors";
import { VerticalBarAccessors } from "../../../../renderers/bar/accessors/vertical-bar-accessors";
import { BarRenderer } from "../../../../renderers/bar/bar-renderer";
import { LineAccessors } from "../../../../renderers/line/line-accessors";
import { LineRenderer } from "../../../../renderers/line/line-renderer";
import { XYGridConfig } from "../../../grid/config/xy-grid-config";
import { IXYGridConfig } from "../../../grid/types";
import { IAccessors, IChartSeries } from "../../types";
import { BandScale } from "../band-scale";
import { LinearScale } from "../linear-scale";
import { TimeScale } from "../time-scale";
import { Scales } from "../types";

import { getAutomaticDomain, getAutomaticDomainWithTicks } from "./automatic-domain";

describe("automatic domain >", () => {

    describe("respects fixed domain for domain calculation", () => {

        it("for number based scale", () => {
            const scales: Scales = {
                x: new LinearScale(),
                y: new LinearScale(),
            };
            scales.x.fixDomain([1.5, 2.5]);

            const renderer = new LineRenderer();

            const chartSeries: IChartSeries<IAccessors> = {
                id: "1",
                name: "Series 1",
                data: [
                    { x: 1, y: 10 },
                    { x: 2, y: 20 },
                    { x: 3, y: 30 },
                ],
                accessors: new LineAccessors(),
                renderer: renderer,
                scales: scales,
            };

            const domain = getAutomaticDomain([chartSeries], "y", scales.x);
            expect(domain[0]).toBe(20);
            expect(domain[1]).toBe(20);
        });

        it("for date based scale", () => {
            const scales: Scales = {
                x: new TimeScale(),
                y: new LinearScale(),
            };
            scales.x.fixDomain([new Date("2017-06-01T00:00:00Z"), new Date("2018-06-01T00:00:00Z")]);

            const chartSeries: IChartSeries<IAccessors> = {
                id: "1",
                name: "Series 1",
                data: [
                    { x: new Date("2017-01-01T00:00:00Z"), y: 10 },
                    { x: new Date("2018-01-01T00:00:00Z"), y: 20 },
                    { x: new Date("2019-01-01T00:00:00Z"), y: 30 },
                ],
                renderer: new LineRenderer(),
                accessors: new LineAccessors(),
                scales: scales,
            };

            const domain = getAutomaticDomain([chartSeries], "y", scales.y);
            expect(domain[0]).toBe(20);
            expect(domain[1]).toBe(20);
        });

    });

    describe("band scale", () => {

        it("calculates bands", () => {
            const scales: Scales = {
                x: new BandScale(),
                y: new LinearScale(),
            };

            const renderer = new BarRenderer();

            const accessors = new VerticalBarAccessors();
            accessors.data.category = (d, i, s, ds) => [d.category, ds.name];
            const chartSeriesSet: IChartSeries<IBarAccessors>[] = [
                {
                    id: "1",
                    name: "Brno",
                    data: [
                        {
                            category: "Q1",
                            value: 10,
                        },
                        {
                            category: "Q2",
                            value: 10,
                        },
                        {
                            category: "Q3",
                            value: 10,
                        },
                        {
                            category: "Q4",
                            value: 10,
                        },
                    ],
                    accessors: accessors,
                    renderer: renderer,
                    scales: scales,
                },
                {
                    id: "2",
                    name: "Austin",
                    data: [
                        {
                            category: "Q1",
                            value: 10,
                        },
                        {
                            category: "Q2",
                            value: 10,
                        },
                        {
                            category: "Q3",
                            value: 10,
                        },
                        {
                            category: "Q4",
                            value: 10,
                        },
                    ],
                    accessors: accessors,
                    renderer: renderer,
                    scales: scales,
                },
            ];

            const domain = getAutomaticDomain(chartSeriesSet, "x", scales.x);
            expect(domain).toEqual([["Q1", "Q2", "Q3", "Q4"], ["Brno", "Austin"]]);
        });

    });

    describe("getAutomaticDomainWithTicks", () => {
        let config: IXYGridConfig;
        let domainCalculator: any;
        beforeEach(() => {
            config = new XYGridConfig();
        });
        it("should set the domain based off of the d3 ticks", () => {
            domainCalculator = getAutomaticDomainWithTicks(config.axis.left, axisLeft);

            const scales: Scales = {
                x: new LinearScale(),
                y: new LinearScale(),
            };

            const renderer = new LineRenderer();

            const chartSeries: IChartSeries<IAccessors> = {
                id: "1",
                name: "Series 1",
                data: [
                    { x: 1, y: 30 },
                    { x: 2, y: 95 },
                    { x: 3, y: 15 },
                    { x: 4, y: 60 },
                    { x: 5, y: 35 },
                ],
                accessors: new LineAccessors(),
                renderer: renderer,
                scales: scales,
            };
            let domain = getAutomaticDomain([chartSeries], "y", scales.y);
            expect(domain[0]).toBe(15);
            expect(domain[1]).toBe(95);

            domain = domainCalculator([chartSeries], "y", scales.y);
            expect(domain[0]).toBe(0);
            expect(domain[1]).toBe(100);
        });

        it("should escape out of function if ticks array is smaller than 1", () => {
            config.axis.left.approximateTicks = 1;
            domainCalculator = getAutomaticDomainWithTicks(config.axis.left, axisLeft);
            const scales: Scales = {
                x: new LinearScale(),
                y: new LinearScale(),
            };

            const renderer = new LineRenderer();

            const chartSeries: IChartSeries<IAccessors> = {
                id: "1",
                name: "Series 1",
                data: [
                    { x: 1, y: 30 },
                    { x: 2, y: 95 },
                    { x: 3, y: 15 },
                    { x: 4, y: 60 },
                    { x: 5, y: 35 },
                ],
                accessors: new LineAccessors(),
                renderer: renderer,
                scales: scales,
            };
            let domain = getAutomaticDomain([chartSeries], "y", scales.y);
            expect(domain[0]).toBe(15);
            expect(domain[1]).toBe(95);

            domain = domainCalculator([chartSeries], "y", scales.y);
            expect(domain[0]).toBe(15);
            expect(domain[1]).toBe(95);
        });

    });
});
