import { By, ElementArrayFinder } from "protractor";

import { Atom } from "@nova-ui/bits/sdk/atoms";

export class DrilldownAtom extends Atom {
    public static CSS_CLASS = "drilldown-widget";

    public getGroupItems(): ElementArrayFinder {
        return this.getElement().all(By.css("nui-list-group-item"));
    }

    public async drillFirstGroup(): Promise<void> {
        await this.getGroupItems().first().click();
    }
}
