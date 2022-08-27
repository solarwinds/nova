import { by, element, ElementFinder } from "protractor";

import { Atom } from "@nova-ui/bits/sdk/atoms";

import { ChartAtom } from "./atoms/chart.atom";

export class DonutChartTestPage {
    private root: ElementFinder;

    constructor() {
        this.root = element(by.className("nui-donut-chart-basic-test"));
    }

    public get chart(): ChartAtom {
        return Atom.findIn(ChartAtom, this.root);
    }
}
