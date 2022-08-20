import { LineAccessors } from "../../renderers/line/line-accessors";
import { LineRenderer } from "../../renderers/line/line-renderer";
import { RenderState } from "../../renderers/types";

import { DataManager } from "./data-manager";
import { LinearScale } from "./scales/linear-scale";
import { IAccessors, IChartSeries } from "./types";

describe("data manager", () => {
    let dataManager: DataManager;
    let seriesSet: IChartSeries<IAccessors>[];
    let xScale: LinearScale;

    beforeEach(() => {
        dataManager = new DataManager({} as any);

        xScale = new LinearScale();

        const scales = {
            x: xScale,
        };

        seriesSet = [
            {
                id: "1",
                name: "1",
                data: [
                    { x: 1, y: 5 },
                    { x: 2, y: 5 },
                    { x: 3, y: 5 },
                    { x: 4, y: 5 },
                    { x: 5, y: 5 },
                ],
                scales: scales,
                renderer: new LineRenderer(),
                accessors: new LineAccessors(),
            },
            {
                id: "2",
                name: "2",
                data: [
                    { x: 6, y: 5 },
                    { x: 7, y: 5 },
                    { x: 8, y: 5 },
                    { x: 9, y: 5 },
                    { x: 10, y: 5 },
                ],
                scales: scales,
                renderer: new LineRenderer(),
                accessors: new LineAccessors(),
            },
        ];
    });

    it("doesn't recalculate fixed domain", () => {
        const fixedDomain = [0, 10];
        xScale.fixDomain(fixedDomain);

        dataManager.update(seriesSet);
        dataManager.updateScaleDomains();

        expect(xScale.domain()).toEqual(fixedDomain);

        // unfixing the domain
        xScale.isDomainFixed = false;
        dataManager.update(seriesSet);
        dataManager.updateScaleDomains();

        expect(xScale.domain()).toEqual([1, 10]);
    });

    it("doesn't include hidden series in the domain calculation", () => {
        seriesSet[0].renderState = RenderState.hidden;
        dataManager.update(seriesSet);
        dataManager.updateScaleDomains();

        expect(xScale.domain()).toEqual([6, 10]);
    });
});
