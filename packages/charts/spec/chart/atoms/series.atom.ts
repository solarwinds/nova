import { Atom } from "@solarwinds/nova-bits/sdk/atoms";
import { ElementFinder } from "protractor";

export class SeriesAtom extends Atom {
    public static CSS_CLASS = "data-series-container";

    protected root: ElementFinder = this.getElement();

    public async getOpacity(): Promise<number> {
        return parseFloat(await this.root.getAttribute("opacity"));
    }
}
