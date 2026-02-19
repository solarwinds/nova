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

import { Atom } from "../../atom";

export class TabHeadingAtom extends Atom {
    public static CSS_CLASS = "nui-tab-heading";

    public async click(times: number = 1): Promise<void> {
        for (let i = 0; i < times; i++) {
            await this.getLocator().click();
        }
    }

    public async isDisabled(): Promise<boolean> {
        const classes =
            (await this.getLocator().getAttribute("class")) ?? "";
        return classes.split(" ").includes("disabled");
    }

    public async isActive(): Promise<boolean> {
        const classes =
            (await this.getLocator().getAttribute("class")) ?? "";
        return classes.split(" ").includes("active");
    }

    public async getText(): Promise<string> {
        return (await this.getLocator().textContent()) ?? "";
    }

    public async toBeActive(): Promise<void> {
        await this.toContainClass("active");
    }

    public async toNotBeActive(): Promise<void> {
        await this.toNotContainClass("active");
    }

    public async toBeDisabled(): Promise<void> {
        await this.toContainClass("disabled");
    }
}
