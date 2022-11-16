// © 2022 SolarWinds Worldwide, LLC. All rights reserved.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
//  of this software and associated documentation files (the "Software"), to
//  deal in the Software without restriction, including without limitation the
//  rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
//  sell copies of the Software, and to permit persons to whom the Software is
//  furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
//  all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
//  THE SOFTWARE.

import { browser, by } from "protractor";
import { ILocation } from "selenium-webdriver";

import { Atom } from "../../atom";

export class ResizerAtom extends Atom {
    public static CSS_CLASS = "nui-resize-gutter";

    private root = this.getElement();
    private resizeSplitElement = this.root.element(
        by.className("nui-resize-gutter__split")
    );

    public moveRight = async (pixelValue: number): Promise<void> =>
        this.resizeElement({ x: pixelValue, y: 0 });

    public moveLeft = async (pixelValue: number): Promise<void> =>
        this.resizeElement({ x: -pixelValue, y: 0 });

    public moveUp = async (pixelValue: number): Promise<void> =>
        this.resizeElement({ x: 0, y: pixelValue });

    public moveDown = async (pixelValue: number): Promise<void> =>
        this.resizeElement({ x: 0, y: -pixelValue });

    public getResizeDirection = async (): Promise<
        "horizontal" | "vertical"
    > => {
        const className = await this.resizeSplitElement.getAttribute("class");
        return className.includes("horizontal") ? "horizontal" : "vertical";
    };

    private resizeElement = async (resizeCoords: ILocation): Promise<void> => {
        await this.hover();
        await browser
            .actions()
            .mouseDown(await this.root.getWebElement())
            .perform();
        await browser.actions().mouseMove(resizeCoords).perform();
        return browser.actions().mouseUp().perform();
    };
}
