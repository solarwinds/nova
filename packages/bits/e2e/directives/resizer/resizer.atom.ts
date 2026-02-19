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

import { Locator } from "playwright-core";

import { Atom } from "../../atom";
import { Helpers } from "../../setup";

export class ResizerAtom extends Atom {
    public static CSS_CLASS = "nui-resize-gutter";

    private get root(): Locator {
        return this.getLocator();
    }

    private get resizeSplitElement(): Locator {
        return this.root.locator(".nui-resize-gutter__split");
    }

    public moveRight = async (pixelValue: number): Promise<void> =>
        this.resizeElement({ x: pixelValue, y: 0 });

    public moveLeft = async (pixelValue: number): Promise<void> =>
        this.resizeElement({ x: -pixelValue, y: 0 });

    public moveUp = async (pixelValue: number): Promise<void> =>
        this.resizeElement({ x: 0, y: -pixelValue });

    public moveDown = async (pixelValue: number): Promise<void> =>
        this.resizeElement({ x: 0, y: pixelValue });

    public getResizeDirection = async (): Promise<
        "horizontal" | "vertical"
    > => {
        const className = (await this.resizeSplitElement.getAttribute("class")) ?? "";
        return className.includes("horizontal") ? "horizontal" : "vertical";
    };

    private resizeElement = async (resizeCoords: {
        x: number;
        y: number;
    }): Promise<void> => {
        await this.hover();

        const box = await this.root.boundingBox();
        if (!box) {
            throw new Error("Resizer root element is not visible");
        }

        const startX = box.x + box.width / 2;
        const startY = box.y + box.height / 2;

        await Helpers.page.mouse.move(startX, startY);
        await Helpers.page.mouse.down();
        await Helpers.page.mouse.move(startX + resizeCoords.x, startY + resizeCoords.y);
        await Helpers.page.mouse.up();
    };
}
