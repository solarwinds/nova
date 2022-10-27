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
