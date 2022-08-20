import { Atom, TimeFrameBarAtom } from "@nova-ui/bits/sdk/atoms";
import { by, element, ElementFinder } from "protractor";

import { ChartAtom } from "./atoms/chart.atom";

export class TimeFrameBarTestPage {
    private root: ElementFinder;
    private delayCheckbox: ElementFinder;

    constructor() {
        this.root = element(by.className("nui-time-frame-bar-test"));
        this.delayCheckbox = this.root.element(by.id("delay"));
    }

    public get chart(): ChartAtom {
        return Atom.findIn(ChartAtom, element(by.className("chart")));
    }

    public get timeFrameBar(): TimeFrameBarAtom {
        return Atom.findIn(
            TimeFrameBarAtom,
            element(by.className("time-frame-bar"))
        );
    }

    public async removeDelay(): Promise<void> {
        if (await this.delayCheckbox.isSelected()) {
            return this.delayCheckbox.click();
        }

        return;
    }
}
