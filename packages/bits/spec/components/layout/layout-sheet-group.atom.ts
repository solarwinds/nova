import { browser, by, ElementFinder } from "protractor";

import { Atom } from "../../atom";

export class LayoutSheetGroupAtom extends Atom {
    public static CSS_CLASS = "nui-sheet-group";

    public async mouseDownHorizontalResizerByIndex(
        index: number
    ): Promise<void> {
        await browser
            .actions()
            .mouseMove(this.getHorizontalResizerByIndex(index))
            .perform();
        await browser.actions().mouseDown().perform();
    }

    public async mouseDownVerticalResizerByIndex(index: number): Promise<void> {
        await browser
            .actions()
            .mouseMove(this.getVerticalResizerByIndex(index))
            .perform();
        await browser.actions().mouseDown().perform();
    }

    public async mouseUp(): Promise<void> {
        await browser.actions().mouseUp().perform();
    }

    public async moveLeftHorizontalResizerByIndex(
        index: number,
        pixels: number
    ): Promise<void> {
        await this.mouseDownHorizontalResizerByIndex(index);
        await browser.actions().mouseMove({ x: -pixels, y: 0 }).perform();
        await this.mouseUp();
    }

    public async moveRightHorizontalResizerByIndex(
        index: number,
        pixels: number
    ): Promise<void> {
        await this.mouseDownHorizontalResizerByIndex(index);
        await browser.actions().mouseMove({ x: pixels, y: 0 }).perform();
        await this.mouseUp();
    }

    public async moveUpVerticalResizerByIndex(
        index: number,
        pixels: number
    ): Promise<void> {
        await this.mouseDownVerticalResizerByIndex(index);
        await browser.actions().mouseMove({ x: 0, y: -pixels }).perform();
        await this.mouseUp();
    }

    public async moveDownVerticalResizerByIndex(
        index: number,
        pixels: number
    ): Promise<void> {
        await this.mouseDownVerticalResizerByIndex(index);
        await browser.actions().mouseMove({ x: 0, y: pixels }).perform();
        await this.mouseUp();
    }

    public getHorizontalResizerByIndex(index: number): ElementFinder {
        return this.getElement()
            .all(by.className("nui-layout-resizer--horizontal"))
            .get(index);
    }

    public getVerticalResizerByIndex(index: number): ElementFinder {
        return this.getElement()
            .all(by.className("nui-layout-resizer--vertical"))
            .get(index);
    }
}
