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

import { Locator } from "@playwright/test";

import { Atom } from "../../atom";
import { Helpers } from "../../setup";

export class LayoutSheetGroupAtom extends Atom {
    public static CSS_CLASS = "nui-sheet-group";

    public getHorizontalResizerByIndex = (index: number): Locator =>
        super.getLocator().locator(".nui-layout-resizer--horizontal").nth(index);

    public getVerticalResizerByIndex = (index: number): Locator =>
        super.getLocator().locator(".nui-layout-resizer--vertical").nth(index);

    public moveLeftHorizontalResizerByIndex = async (
        index: number,
        pixels: number
    ): Promise<void> => {
        await this.dragResizer(this.getHorizontalResizerByIndex(index), -pixels, 0);
    };

    public moveRightHorizontalResizerByIndex = async (
        index: number,
        pixels: number
    ): Promise<void> => {
        await this.dragResizer(this.getHorizontalResizerByIndex(index), pixels, 0);
    };

    public moveUpVerticalResizerByIndex = async (
        index: number,
        pixels: number
    ): Promise<void> => {
        await this.dragResizer(this.getVerticalResizerByIndex(index), 0, -pixels);
    };

    public moveDownVerticalResizerByIndex = async (
        index: number,
        pixels: number
    ): Promise<void> => {
        await this.dragResizer(this.getVerticalResizerByIndex(index), 0, pixels);
    };

    /** Press mouse down on a horizontal resizer (for visual testing of pressed state). */
    public mouseDownHorizontalResizerByIndex = async (
        index: number
    ): Promise<void> => {
        await this.pressResizer(this.getHorizontalResizerByIndex(index));
    };

    /** Press mouse down on a vertical resizer (for visual testing of pressed state). */
    public mouseDownVerticalResizerByIndex = async (
        index: number
    ): Promise<void> => {
        await this.pressResizer(this.getVerticalResizerByIndex(index));
    };

    /** Release the mouse button. Call after mouseDown*ResizerByIndex. */
    public mouseUp = async (): Promise<void> => {
        await Helpers.page.mouse.up();
    };

    private async dragResizer(
        resizer: Locator,
        deltaX: number,
        deltaY: number
    ): Promise<void> {
        const box = await resizer.boundingBox();
        if (!box) {
            throw new Error("Resizer element not found or not visible");
        }
        const startX = box.x + box.width / 2;
        const startY = box.y + box.height / 2;

        await Helpers.page.mouse.move(startX, startY);
        await Helpers.page.mouse.down();
        await Helpers.page.mouse.move(startX + deltaX, startY + deltaY);
        await Helpers.page.mouse.up();
    }

    private async pressResizer(resizer: Locator): Promise<void> {
        const box = await resizer.boundingBox();
        if (!box) {
            throw new Error("Resizer element not found or not visible");
        }
        const x = box.x + box.width / 2;
        const y = box.y + box.height / 2;

        await Helpers.page.mouse.move(x, y);
        await Helpers.page.mouse.down();
    }
}
