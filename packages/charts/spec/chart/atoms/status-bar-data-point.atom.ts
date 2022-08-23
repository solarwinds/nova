import { by } from "protractor";

import { BarDataPointAtom } from "./bar-data-point.atom";

export class StatusBarDataPointAtom extends BarDataPointAtom {
    private barIconClass = "bar-icon";

    public async hasIcon(): Promise<boolean> {
        return this.getElement()
            .element(by.css(`.${this.barIconClass} g`))
            .isPresent();
    }
}
