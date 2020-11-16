import { Atom } from "@solarwinds/nova-bits/sdk/atoms";
import { by, ElementFinder } from "protractor";
import { ILocation } from "selenium-webdriver";

export class MarkerAtom extends Atom {
    public static CSS_CLASS = "marker";
    private root: ElementFinder = this.getElement();

    public async getColor(): Promise<string> {
        return this.root.all(by.css(`.${MarkerAtom.CSS_CLASS} > g`)).first().getAttribute("fill");
    }

    public async getPosition(): Promise<ILocation> {
        const transform = await this.root.getCssValue("transform"); // it will look like "matrix(1, 0, 0, 1, 400, 15)"
        const values = transform.match(/(-?[0-9\.]+)/g) || [];
        return {
            x: parseFloat(values[4]),
            y: parseFloat(values[5]),
        };
    }
}
