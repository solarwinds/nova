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
import { expect } from "../../setup";
import { ButtonAtom } from "../button/button.atom";

export class SearchAtom extends Atom {
    public static CSS_CLASS = "nui-search";

    public async acceptInput(input: string): Promise<void> {
        await this.getLocator()
            .locator(".nui-search__input-control")
            .fill(input);
    }

    public async click(): Promise<void> {
        await this.getLocator().click();
    }

    public getCancelButton(): ButtonAtom {
        return Atom.findIn<ButtonAtom>(
            ButtonAtom,
            this.getLocator().locator(".nui-search__button-cancel"),
            true
        );
    }

    public getSearchButton(): ButtonAtom {
        return Atom.findIn<ButtonAtom>(
            ButtonAtom,
            this.getLocator().locator(".nui-button[icon=search]"),
            true
        );
    }

    public async getValueAttr(): Promise<string | null> {
        return this.getLocator().locator("input").getAttribute("value");
    }

    public async isFocused(): Promise<void> {
        const input = this.getLocator().locator(".nui-search__input-control");
        await expect(input).toBeFocused();
    }

    public async isNotFocused(): Promise<void> {
        const input = this.getLocator().locator(".nui-search__input-control");
        await expect(input).not.toBeFocused();
    }

    public async hasError(): Promise<boolean> {
        const searchGroup = this.getLocator().locator(".nui-search__group");
        const cls = await searchGroup.getAttribute("class");
        return (cls || "").includes("has-error");
    }
}
