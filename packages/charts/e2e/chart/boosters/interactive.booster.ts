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

import type { Locator } from "@playwright/test";

import { ChartAtom } from "../atoms/chart.atom";

export class InteractiveBooster {
    private static async getInteractiveTarget(
        chart: ChartAtom
    ): Promise<Locator> {
        const [layer] = await chart.getLayer("rendering-area");
        return layer
            ? layer.locator(".mouse-interactive-area")
            : chart.getLocator();
    }

    private static async getAbsolutePosition(
        target: Locator,
        location: { x: number; y: number }
    ): Promise<{ x: number; y: number }> {
        await target.scrollIntoViewIfNeeded();

        const box = await target.boundingBox();
        if (!box) {
            throw new Error(
                "Could not resolve interactive chart area for interaction"
            );
        }

        return {
            x:
                box.x +
                Math.min(Math.max(location.x, 1), Math.max(box.width - 1, 1)),
            y:
                box.y +
                Math.min(Math.max(location.y, 1), Math.max(box.height - 1, 1)),
        };
    }

    public static async hover(
        chart: ChartAtom,
        location: { x: number; y: number }
    ): Promise<void> {
        const target = await this.getInteractiveTarget(chart);
        const position = await this.getAbsolutePosition(target, location);

        await chart.getLocator().page().mouse.move(position.x, position.y);
    }

    public static async click(
        chart: ChartAtom,
        location: { x: number; y: number }
    ): Promise<void> {
        const target = await this.getInteractiveTarget(chart);
        const position = await this.getAbsolutePosition(target, location);

        await chart.getLocator().page().mouse.click(position.x, position.y);
    }
}
