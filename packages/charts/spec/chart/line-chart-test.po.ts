import { Atom } from "@nova-ui/bits/sdk/atoms";
import { by, element, ElementFinder } from "protractor";

import { ChartAtom } from "./atoms/chart.atom";

export class LineChartTestPage {
    private root: ElementFinder;
    private dataInput: ElementFinder;

    constructor() {
        this.root = element(by.className("nui-line-chart-basic-test"));
        this.dataInput = this.root.element(by.id("data-input"));
    }

    public get chart(): ChartAtom {
        return Atom.findIn(ChartAtom, this.root);
    }

    public async changeData(input: number [][]): Promise<void> {
        await this.dataInput.clear();
        return this.dataInput.sendKeys(JSON.stringify(input));
    }
}
