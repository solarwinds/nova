import { Atom } from "@nova-ui/bits/sdk/atoms";
import { by, element, ElementFinder } from "protractor";

import { LegendSeriesAtom } from "../legend/legend-series.atom";

import { ChartAtom } from "./atoms/chart.atom";

export class SparkChartTestPage {
    private root: ElementFinder;
    private dataInput: ElementFinder;

    constructor() {
        this.root = element(by.className("nui-spark-chart-multiple-test"));
        this.dataInput = this.root.element(by.id("data-input"));
    }

    public async getChartCount(): Promise<number> {
        return Atom.findCount(ChartAtom, this.root);
    }

    public async getSparkCountInStack(className: string): Promise<number> {
        return Atom.findCount(ChartAtom, element(by.className(className)));
    }

    public async getLegendSeriesCount(): Promise<number> {
        return Atom.findCount(LegendSeriesAtom, this.root);
    }

    public getChart(index: number): ChartAtom {
        return Atom.findIn(ChartAtom, this.root, index);
    }

    public getLegendSeries(index: number): LegendSeriesAtom {
        return Atom.findIn(LegendSeriesAtom, this.root, index);
    }

    public async changeData(input: number [][]): Promise<void> {
        await this.dataInput.clear();
        return this.dataInput.sendKeys(JSON.stringify(input));
    }
}
