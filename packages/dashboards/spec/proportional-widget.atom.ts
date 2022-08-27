import { By, ElementFinder } from "protractor";

import { Atom } from "@nova-ui/bits/sdk/atoms";

export class ProportionalWidgetAtom extends Atom {
    public static CSS_CLASS = "proportional-widget";

    public getLegendSeries(): ElementFinder {
        return this.getElement()
            .all(By.css("nui-widget"))
            .get(2)
            .all(By.css("nui-legend-series"))
            .last();
    }
}
