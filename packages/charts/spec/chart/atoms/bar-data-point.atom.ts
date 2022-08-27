import { by, ElementFinder } from "protractor";

import { Atom } from "@nova-ui/bits/sdk/atoms";

export class BarDataPointAtom extends Atom {
    public static CSS_CLASS = "bar-container";

    private rect: ElementFinder;

    constructor(rootElement: ElementFinder) {
        super(rootElement);
        this.rect = rootElement.element(by.className("bar"));
    }

    public async getOpacity(): Promise<number> {
        return parseFloat(await this.getElement().getCssValue("opacity"));
    }

    public async getColor(): Promise<string> {
        return this.rect.getCssValue("fill");
    }

    public async getX(): Promise<number> {
        return parseInt(await this.rect.getAttribute("x"), 10);
    }

    public async getWidth(): Promise<number> {
        return parseInt(await this.rect.getAttribute("width"), 10);
    }
}
