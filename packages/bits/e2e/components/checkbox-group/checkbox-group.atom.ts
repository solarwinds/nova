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
import { expect } from "../../setup";
import { CheckboxAtom } from "../checkbox/checkbox.atom";

export class CheckboxGroupAtom extends Atom {
    public static CSS_CLASS = "nui-checkbox-group";

    public get checkboxes(): CheckboxAtom {
        return Atom.findIn<CheckboxAtom>(CheckboxAtom, this.getLocator());
    }

    // Used to return specific checkbox element from the group
    public getCheckbox(title: string): CheckboxAtom {
        return this.checkboxes.filter<CheckboxAtom>(CheckboxAtom, {
            hasText: title,
        });
    }

    public getCheckboxByIndex = (index: number): CheckboxAtom =>
        this.checkboxes.nth<CheckboxAtom>(CheckboxAtom, index);

    public getFirst = (): Locator => this.checkboxes.getLocator().first();

    public async isDisabled(): Promise<boolean> {
        const childCount = await this.checkboxes.getLocator().count();
        if (childCount === 0) {
            return false;
        }
        for (let i = 0; i < childCount; i++) {
            const checkbox = this.getCheckboxByIndex(i);
            if (!(await checkbox.isDisabled())) {
                return false;
            }
        }

        return true;
    }

    public async toBeDisabled(): Promise<void> {
        const inputs = this.getLocator().locator(".nui-checkbox__input");
        const count = await inputs.count();
        for (let i = 0; i < count; i++) {
            await expect(inputs.nth(i)).toBeDisabled();
        }
    }

    public async toBeEnabled(): Promise<void> {
        const inputs = this.getLocator().locator(".nui-checkbox__input");
        const count = await inputs.count();
        for (let i = 0; i < count; i++) {
            await expect(inputs.nth(i)).toBeEnabled();
        }
    }
}
