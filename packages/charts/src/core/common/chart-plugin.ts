import { IChart, IChartPlugin } from "./types";

export abstract class ChartPlugin implements IChartPlugin {

    constructor() { }

    public chart: IChart;

    public initialize(): void { }

    public update(): void { }

    public updateDimensions(): void { }

    public destroy(): void { }
}
