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

import { BaseSelectV2Atom } from "../select-v2/base-select-v2.atom";
import { expect } from "../../setup";

export class FreetypeQueryBuilderAtom extends BaseSelectV2Atom {
    public static CSS_CLASS = "nui-freetype-query-builder";

    public get textarea(): Locator {
        return this.getLocator().locator("textarea");
    }

    public type = async (text: string): Promise<void> => {
        await this.getLocator().click();
        await this.getLocator().pressSequentially(text);
    };

    public clearText = async (): Promise<void> => {
        await this.textarea.clear();
    };

    public getQueryText = async (): Promise<string> =>
        (await this.getLocator().textContent()) ?? "";

    public toHaveQueryText = async (expected: string | RegExp): Promise<void> => {
        await expect(this.getLocator()).toHaveText(expected);
    };
}
