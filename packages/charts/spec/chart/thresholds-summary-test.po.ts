import { Atom } from "@nova-ui/bits/sdk/atoms";
import { by, element, ElementFinder } from "protractor";

import { LegendAtom } from "../legend/legend.atom";

import { ChartAtom } from "./atoms/chart.atom";

export class ThresholdsSummaryTestPage {
    private root: ElementFinder;
    private dataInput: ElementFinder;
    private zonesInput: ElementFinder;

    constructor() {
        this.root = element(by.className("nui-thresholds-summary-test-harness"));
        this.dataInput = this.root.element(by.id("data-input"));
        this.zonesInput = this.root.element(by.id("zones-input"));
    }

    public get mainChart(): ChartAtom {
        return Atom.findIn(ChartAtom, element(by.className("thresholds-main-chart")));
    }

    public get summaryChart(): ChartAtom {
        return Atom.findIn(ChartAtom, element(by.className("thresholds-summary-chart")));
    }

    public get legend(): LegendAtom {
        return Atom.findIn(LegendAtom, element(by.className("thresholds-legend")));
    }

    public async changeData(input: Record<string, number[]>): Promise<void> {
        await this.dataInput.clear();
        return this.dataInput.sendKeys(JSON.stringify(input));
    }

    public async changeZones(input: any[]): Promise<void> {
        await this.zonesInput.clear();
        return this.zonesInput.sendKeys(JSON.stringify(input));
    }
}
