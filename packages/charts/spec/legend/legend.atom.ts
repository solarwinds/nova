import { by, ElementArrayFinder, ElementFinder } from "protractor";

import { Atom } from "@nova-ui/bits/sdk/atoms";

import { LegendSeriesAtom } from "./legend-series.atom";

export class LegendAtom extends Atom {
    public static CSS_CLASS = "nui-legend";
    private allSeries: ElementArrayFinder;

    constructor(rootElement: ElementFinder) {
        super(rootElement);
        this.allSeries = this.getElement().all(
            by.className(LegendSeriesAtom.CSS_CLASS)
        );
    }

    public getSeriesByIndex = (index: number): LegendSeriesAtom =>
        Atom.findIn(LegendSeriesAtom, this.allSeries.get(index));
}
