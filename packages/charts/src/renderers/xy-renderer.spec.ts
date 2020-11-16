import { Subject } from "rxjs";

import { LinearScale } from "../core/common/scales/linear-scale";
import { Scales } from "../core/common/scales/types";
import { IAccessors, IDataSeries, IPosition, IRendererEventPayload } from "../core/common/types";

import { XYAccessors } from "./accessors/xy-accessors";
import { IRenderSeries } from "./types";
import { XYRenderer } from "./xy-renderer";

export class MockXYRenderer extends XYRenderer<XYAccessors> {
    public draw(renderSeries: IRenderSeries<IAccessors>, rendererSubject: Subject<IRendererEventPayload>): void {
    }
}

class TestXYAccessors extends XYAccessors {
}

describe("XY Renderer >", () => {
    let renderer: MockXYRenderer;

    beforeEach(() => {
        renderer = new MockXYRenderer();
    });

    describe("getDataPointPosition()", () => {
        let position: IPosition | undefined;
        let dataSeries: IDataSeries<XYAccessors>;
        let scales: Scales;

        beforeEach(() => {
            dataSeries = {
                id: "1",
                name: "Series 1",
                data: [{ x: 0, y: 0 }, { x: 1, y: 1 }],
                accessors: new TestXYAccessors(),
            };
            scales = {
                x: new LinearScale(),
                y: new LinearScale(),
            };
        });

        it("should return the proper position by index", () => {
            position = renderer.getDataPointPosition(dataSeries, 0, scales);
            expect(position).toEqual({ x: 0, y: 0 });
            position = renderer.getDataPointPosition(dataSeries, 1, scales);
            expect(position).toEqual({ x: 1, y: 1 });
        });

        it("should handle index out of range properly", () => {
            position = renderer.getDataPointPosition(dataSeries, -1, scales);
            expect(position).toBeUndefined();
            position = renderer.getDataPointPosition(dataSeries, 2, scales);
            expect(position).toBeUndefined();
        });

        it("should respect scale", () => {
            scales.x.range([10, 100]);
            scales.y.range([20, 200]);

            position = renderer.getDataPointPosition(dataSeries, 0, scales);
            expect(position).toEqual({ x: 10, y: 20 });
            position = renderer.getDataPointPosition(dataSeries, 1, scales);
            expect(position).toEqual({ x: 100, y: 200 });
        });
    });

});
