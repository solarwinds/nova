import { LinearScale } from "../../core/common/scales/linear-scale";
import { IScale } from "../../core/common/scales/types";
import { IAccessors, IChartSeries } from "../../core/common/types";
import { radialPreprocessor } from "./radial-preprocessor";

describe("Radial Preprocessor >", () => {
    let scale: IScale<any>;
    let generatePieData: Function;
    let generateSeriesSet: Function;
    beforeEach(() => {
        scale = new LinearScale();
        generatePieData = (names: string[], count: number = 1) =>
            names.map((el, index) => ({
                id: `series-${index}`,
                name: el,
                data: Array.from({ length: count }, (_, i) => ({
                    value: 10 * (index + 1),
                    name: `${el}`,
                })),
                accessors: {
                    data: {
                        value: (d: any) => d.value,
                    },
                },
            }));
        generateSeriesSet = (donutSeriesSet: any): any[] =>
            donutSeriesSet.map((dataSeries: any) => ({
                ...dataSeries,
                scales: {
                    r: scale,
                },
                renderer: {},
                showInLegend: true,
            }));
    });
    it("should modify generated data", () => {
        const res = radialPreprocessor(
            generateSeriesSet(generatePieData(["Up", "Down"])),
            () => true
        );
        expect(res[0].data[0].value).toBe(10);
        expect(res[1].data[0].value).toBe(20);
        expect(res[1].name).toBe("Down");
        expect(res.length).toBe(2);
    });
    it("should modify pie value, but not series data when not visible", () => {
        const res = radialPreprocessor(
            generateSeriesSet(generatePieData(["Up", "Down"])),
            (series: IChartSeries<IAccessors>) => series.name === "Up"
        );
        expect(res[0].data[0].value).toBe(10);
        expect(res[0].data[0].data.value).toBe(10);
        expect(res[1].data[0].value).toBe(0);
        expect(res[1].data[0].data.value).toBe(20);
        expect(res[1].name).toBe("Down");
        expect(res.length).toBe(2);
    });
});
