import { browser, by } from "protractor";
import { ILocation } from "selenium-webdriver";

import { Atom } from "../../atom";

export class ResizerAtom extends Atom {
    public static CSS_CLASS = "nui-resize-gutter";

    private root = this.getElement();
    private resizeSplitElement = this.root.element(by.className("nui-resize-gutter__split"));

    public moveRight = async (pixelValue: number) => this.resizeElement({ x: pixelValue, y: 0 });

    public moveLeft = async (pixelValue: number) => this.resizeElement({ x: -pixelValue, y: 0 });

    public moveUp = async (pixelValue: number) => this.resizeElement({ x: 0, y: pixelValue });

    public moveDown = async (pixelValue: number) => this.resizeElement({ x: 0, y: -pixelValue });

    public getResizeDirection = async (): Promise<"horizontal" | "vertical"> => {
        const className = await this.resizeSplitElement.getAttribute("class");
        return className.includes("horizontal") ? "horizontal" : "vertical";
    }

    private resizeElement = async (resizeCoords: ILocation): Promise<void> => {
        await this.hover();
        await browser.actions().mouseDown(await this.root.getWebElement()).perform();
        await browser.actions().mouseMove(resizeCoords).perform();
        return browser.actions().mouseUp().perform();
    }
}
