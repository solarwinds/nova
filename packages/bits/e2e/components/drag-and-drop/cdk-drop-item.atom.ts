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

export interface DragOffset {
    x: number;
    y: number;
}

export class CdkDraggableItemAtom extends Atom {
    public static CSS_CLASS = "cdk-drag";

    public mouseDown = async (): Promise<void> => {
        const box = await this.getLocator().boundingBox();
        if (!box) {
            throw new Error("Element not found or not visible");
        }
        const centerX = box.x + box.width / 2;
        const centerY = box.y + box.height / 2;
        await Helpers.page.mouse.move(centerX, centerY);
        await Helpers.page.mouse.down();
    };

    public mouseUp = async (): Promise<void> => {
        await Helpers.page.mouse.up();
    };

    public dragSelf = async (offset?: DragOffset): Promise<void> => {
        const box = await this.getLocator().boundingBox();
        if (!box) {
            throw new Error("Element not found or not visible");
        }
        const centerX = box.x + box.width / 2;
        const centerY = box.y + box.height / 2;
        await Helpers.page.mouse.move(centerX, centerY);
        await Helpers.page.mouse.down();
        await Helpers.page.mouse.move(
            centerX + (offset?.x ?? 0),
            centerY + (offset?.y ?? 0)
        );
    };

    public dragTo = async (
        target: Locator,
        offset?: DragOffset
    ): Promise<void> => {
        const sourceBox = await this.getLocator().boundingBox();
        const targetBox = await target.boundingBox();
        if (!sourceBox || !targetBox) {
            throw new Error("Source or target element not found or not visible");
        }
        const sourceCenterX = sourceBox.x + sourceBox.width / 2;
        const sourceCenterY = sourceBox.y + sourceBox.height / 2;
        const targetCenterX = targetBox.x + targetBox.width / 2 + (offset?.x ?? 0);
        const targetCenterY = targetBox.y + targetBox.height / 2 + (offset?.y ?? 0);

        await Helpers.page.mouse.move(sourceCenterX, sourceCenterY);
        await Helpers.page.mouse.down();
        await Helpers.page.mouse.move(targetCenterX, targetCenterY);
    };

    public move = async (
        target: Locator,
        offset?: DragOffset
    ): Promise<void> => {
        const targetBox = await target.boundingBox();
        if (!targetBox) {
            throw new Error("Target element not found or not visible");
        }
        const targetCenterX = targetBox.x + targetBox.width / 2 + (offset?.x ?? 0);
        const targetCenterY = targetBox.y + targetBox.height / 2 + (offset?.y ?? 0);
        await Helpers.page.mouse.move(targetCenterX, targetCenterY);
    };

    public dragAndDrop = async (
        target: Locator,
        offset?: DragOffset
    ): Promise<void> => {
        await this.dragTo(target, offset);
        await this.mouseUp();
    };
}
