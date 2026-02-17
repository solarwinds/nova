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

import { Atom, expect } from "@nova-ui/bits/sdk/atoms-playwright";

export class BarDataPointAtom extends Atom {
    public static CSS_CLASS = "bar-container";

    private rect: Locator;

    constructor(rootElement: Locator) {
        super(rootElement);
        this.rect = rootElement.locator(".bar");
    }

    public async getOpacity(): Promise<number> {
        const opacity = await this.getLocator().evaluate((el) => getComputedStyle(el).opacity);
        return parseFloat(opacity);
    }

    /** Retryable assertion: opacity equals the expected value. */
    public async toHaveOpacity(expected: number): Promise<void> {
        await expect.poll(() => this.getOpacity()).toBe(expected);
    }

    /** Retryable assertion: opacity is strictly less than the given value. */
    public async toHaveOpacityLessThan(value: number): Promise<void> {
        await expect.poll(() => this.getOpacity()).toBeLessThan(value);
    }

    public async getColor(): Promise<string> {
        // SVG rect fill can be computed; prefer the attribute first, fall back to computed style.
        return (
            (await this.rect.getAttribute("fill")) ||
            (await this.rect.evaluate((el) => getComputedStyle(el as any).fill))
        );
    }

    public async getX(): Promise<number> {
        return parseInt((await this.rect.getAttribute("x")) ?? "0", 10);
    }

    public async getWidth(): Promise<number> {
        return parseInt((await this.rect.getAttribute("width")) ?? "0", 10);
    }
}
