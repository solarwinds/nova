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
import { expect } from "../../setup";

export class RangeFilterAtom extends Atom {
    public static CSS_SELECTOR = "nui-range-filter";

    public readonly handles: Locator;
    public readonly inputs: Locator;

    constructor(locator: Locator) {
        super(locator);
        this.handles = locator.getByRole("slider");
        this.inputs = locator.getByRole("spinbutton");
    }

    public get lowHandle(): Locator {
        return this.handles.first();
    }

    public get highHandle(): Locator {
        return this.handles.last();
    }

    public get minimumInput(): Locator {
        return this.getLocator().getByRole("spinbutton", {
            name: "Minimum value",
        });
    }

    public get maximumInput(): Locator {
        return this.getLocator().getByRole("spinbutton", {
            name: "Maximum value",
        });
    }

    public async expectHandleCount(count: number): Promise<void> {
        await expect(this.handles).toHaveCount(count);
    }

    public async expectInputCount(count: number): Promise<void> {
        await expect(this.inputs).toHaveCount(count);
    }

    public async expectLowValue(value: number): Promise<void> {
        await expect(this.lowHandle).toHaveAttribute(
            "aria-valuenow",
            String(value)
        );
    }

    public async expectHighValue(value: number): Promise<void> {
        await expect(this.highHandle).toHaveAttribute(
            "aria-valuenow",
            String(value)
        );
    }

    public async expectMinimumInputValue(value: number): Promise<void> {
        await expect(this.minimumInput).toHaveValue(String(value));
    }

    public async expectMaximumInputValue(value: number): Promise<void> {
        await expect(this.maximumInput).toHaveValue(String(value));
    }

    public async pressLowHandle(key: string): Promise<void> {
        await this.lowHandle.press(key);
    }

    public async pressHighHandle(key: string): Promise<void> {
        await this.highHandle.press(key);
    }
}
