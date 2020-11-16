import { by, element, ElementFinder } from "protractor";

import { Atom } from "../../../atom";

import { TimeFrameBarAtom } from "./time-frame-bar.atom";

export class TimeFrameBarTestPage {
    private root: ElementFinder;
    private zoomInButton: ElementFinder;
    private resetButton: ElementFinder;

    constructor() {
        this.root = element(by.className("nui-time-frame-bar-test"));
        this.zoomInButton = this.root.element(by.className("btn-zoom-in"));
        this.resetButton = this.root.element(by.className("btn-set-default"));
    }

    public get timeFrameBar(): TimeFrameBarAtom {
        return Atom.findIn(TimeFrameBarAtom, this.root);
    }

    public async zoomIn(): Promise<void> {
        return this.zoomInButton.click();
    }

    public async reset(): Promise<void> {
        return this.resetButton.click();
    }
}
