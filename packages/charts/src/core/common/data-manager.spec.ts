import { LineAccessors } from "../../renderers/line/line-accessors";
import { LineRenderer } from "../../renderers/line/line-renderer";

import { DataManager } from "./data-manager";
import { LinearScale } from "./scales/linear-scale";
import { IAccessors, IChartSeries } from "./types";

describe("data manager", () => {
    let dataManager: DataManager;
    let seriesSet: IChartSeries<IAccessors>[];
    let xScale: LinearScale;

    beforeEach(() => {
        dataManager = new DataManager();

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

        expect(xScale.domain()).toEqual([1, 5]);
    });

});
