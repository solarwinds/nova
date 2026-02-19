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

import { ChartAtom } from "../atoms/chart.atom";

export class ZoomBooster {
    public static async zoom(
        chart: ChartAtom,
        from: { x: number; y: number },
        to: { x: number; y: number }
    ): Promise<void> {
        const [target] = await chart.getLayer("zoom-brush");
        if (!target) {
            return;
        }

        const box = await target.boundingBox();
        if (!box) {
            return;
        }

        const page = chart.getLocator().page();
        await page.mouse.move(box.x + from.x, box.y + from.y);
        await page.mouse.down();
        await page.mouse.move(box.x + to.x, box.y + to.y);
        await page.mouse.up();
    }
}
