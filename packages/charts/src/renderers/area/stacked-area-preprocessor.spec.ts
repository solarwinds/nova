import { LinearScale } from "../../core/common/scales/linear-scale";
import { TimeScale } from "../../core/common/scales/time-scale";
import { IXYScales } from "../../core/common/scales/types";
import { IChartSeries } from "../../core/common/types";

import { AreaAccessors, IAreaAccessors } from "./area-accessors";
import { AreaRenderer } from "./area-renderer";
import { stackedAreaPreprocessor } from "./stacked-area-preprocessor";

describe("Stacked Area Preprocessor >", () => {
    let accessors: any;
    let renderer: any;
    let scales: IXYScales;

    beforeEach(() => {
        accessors = new AreaAccessors();
        accessors.data.x = (d: any) => d.x;
        accessors.data.y0 = () => 0;
        accessors.data.y1 = (d: any) => d.value;

        renderer = new AreaRenderer();

        scales = {
            x: new TimeScale(),
            y: new LinearScale(),
        };
    });

    it("should modify generated data and second series should start at the end of the first series if the domain is the same ", () => {
        const data = [
            {
                id: "series-1",
                name: "Series 1",
                data: [{ x: "test1", value: 30 }],
            },
            {
                id: "series-2",
                name: "Series 2",
                data: [{ x: "test1", value: 60 }],
            },
        ];

        const seriesSet: IChartSeries<IAreaAccessors>[] = data.map((d) => ({
            ...d,
            accessors,
            renderer,
            scales,
        }));

        const [firstSeries, secondSeries] = stackedAreaPreprocessor(
            seriesSet,
            () => true
        );
        expect(firstSeries.data[0]["__stack_y"].start).toEqual(0);
        expect(firstSeries.data[0]["__stack_y"].end).toEqual(30);
        expect(secondSeries.data[0]["__stack_y"].start).toEqual(30);
        expect(secondSeries.data[0]["__stack_y"].end).toEqual(90);
    });

    it("should modify generated data and second series should start 0 if the domain is not the same as the first series", () => {
        const data = [
            {
                id: "series-1",
                name: "Series 1",
                data: [{ x: "test1", value: 30 }],
            },
            {
                id: "series-2",
                name: "Series 2",
                data: [{ x: "test2", value: 60 }],
            },
        ];

        const seriesSet: IChartSeries<IAreaAccessors>[] = data.map((d) => ({
            ...d,
            accessors,
            renderer,
            scales,
        }));

        const [firstSeries, secondSeries] = stackedAreaPreprocessor(
            seriesSet,
            () => true
        );
        expect(firstSeries.data[0]["__stack_y"].start).toEqual(0);
        expect(firstSeries.data[0]["__stack_y"].end).toEqual(30);
        expect(secondSeries.data[0]["__stack_y"].start).toEqual(0);
        expect(secondSeries.data[0]["__stack_y"].end).toEqual(60);
    });
});
