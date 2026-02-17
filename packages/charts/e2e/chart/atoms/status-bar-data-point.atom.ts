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

import { expect } from "@nova-ui/bits/sdk/atoms-playwright";

import { BarDataPointAtom } from "./bar-data-point.atom";

export class StatusBarDataPointAtom extends BarDataPointAtom {
    private barIconClass = "bar-icon";

    private get iconLocator() {
        return this.getLocator().locator(`.${this.barIconClass} g`);
    }

    /** @deprecated Use {@link toHaveIcon} / {@link toNotHaveIcon} for auto-retry. */
    public async hasIcon(): Promise<boolean> {
        return (await this.iconLocator.count()) > 0;
    }

    /** Retryable assertion: icon is present. */
    public async toHaveIcon(): Promise<void> {
        await expect(this.iconLocator).toHaveCount(1);
    }

    /** Retryable assertion: icon is absent. */
    public async toNotHaveIcon(): Promise<void> {
        await expect(this.iconLocator).toHaveCount(0);
    }
}
