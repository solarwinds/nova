import { axisLeft } from "d3-axis";

import { LineAccessors } from "../../../../renderers/line/line-accessors";
import { LineRenderer } from "../../../../renderers/line/line-renderer";
import { XYGridConfig } from "../../../grid/config/xy-grid-config";
import { IXYGridConfig } from "../../../grid/types";
import { IAccessors, IChartSeries } from "../../types";
import { LinearScale } from "../linear-scale";
import { Scales } from "../types";
import { getAutomaticDomain } from "./automatic-domain";
import { getAutomaticDomainWithTicks } from "./domain-with-ticks";

describe("getAutomaticDomainWithTicks", () => {
    let config: IXYGridConfig;
    let domainCalculator: any;
    beforeEach(() => {
        config = new XYGridConfig();
    });
    it("should set the domain based off of the d3 ticks", () => {
        domainCalculator = getAutomaticDomainWithTicks(
            config.axis.left,
            axisLeft,
            getAutomaticDomain
        );

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
        domainCalculator = getAutomaticDomainWithTicks(
            config.axis.left,
            axisLeft,
            getAutomaticDomain
        );
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
